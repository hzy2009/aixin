<template>
  <div
    class="vertical-marquee-container"
    ref="marqueeContainerRef"
    @mouseenter="pauseAnimation"
    @mouseleave="resumeAnimation"
  >
    <div
      class="marquee-track"
      ref="marqueeTrackRef"
      :class="{ 'is-scrolling': canScroll }"
      :style="{ animationDuration: animationSpeedDuration }"
    >
      <!-- 渲染原始列表项 -->
      <div
        v-for="(item, index) in itemsToDisplay"
        :key="item.id ? `${item.id}-${index}` : `item-original-${index}`"
        class="marquee-item-display"
        @click="() => onItemClick(item)"
      >
        <span class="marquee-item-text-content">{{ item.content || item.message || item.text }}</span>
        <span class="marquee-item-date-content">{{ item[props.timeCode] ? formatDate(item[props.timeCode]) : (item.date || '') }}</span>
      </div>
      <!-- 如果可以滚动，则复制一份列表项用于无缝循环 -->
      <template v-if="canScroll">
        <div
          v-for="(item, index) in itemsToDisplay"
          :key="item.id ? `${item.id}-dup-${index}` : `item-duplicate-${index}`"
          class="marquee-item-display"
          @click="() => onItemClick(item)"
          aria-hidden="true"
        >
          <span class="marquee-item-text-content">{{ item.content || item.message || item.text }}</span>
          <span class="marquee-item-date-content">{{ item[props.timeCode] ? formatDate(item[props.timeCode]) : (item.date || '') }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { formatDate } from '@/utils'; // 请确保此路径正确

// --- 组件 Props 定义 ---
const props = defineProps({
  items: { type: Array, required: true, default: () => [] },
  visibleItemCount: { type: Number, default: 5 },
  scrollSpeedPxPerSecond: { type: Number, default: 25 },
  timeCode: { type: String, default: 'createTime' },
});

// --- 组件 Emits 定义 ---
const emit = defineEmits(['itemClick']);

// --- DOM 引用和响应式状态 ---
const marqueeTrackRef = ref(null);
const animationSpeedDuration = ref('20s'); // 动画周期的CSS字符串，将被动态计算

// --- 计算属性 ---

// 要显示的项目列表（原始数据）
const itemsToDisplay = computed(() => props.items);

// 判断是否需要滚动。只有当项目总数超过可视数量时才启动滚动。
const canScroll = computed(() => {
  return props.items && props.items.length > props.visibleItemCount;
});

// --- 核心方法：计算动画时长 ---
const calculateAnimationDuration = async () => {
  // 如果轨道元素不存在，或者内容不足以滚动，则无需计算。
  // CSS的 :class="{ 'is-scrolling': canScroll }" 会自动处理动画的启停。
  if (!marqueeTrackRef.value || !canScroll.value) {
    return;
  }

  // 等待DOM更新完成，确保能获取到包含“复制内容”后的正确scrollHeight
  await nextTick();

  // 在异步操作后，再次检查DOM元素是否存在，以防组件已卸载
  if (!marqueeTrackRef.value) return;

  // 1. 获取包含“原始+复制”内容的整个滚动轨道的高度
  const trackHeight = marqueeTrackRef.value.scrollHeight;
  // 2. 动画实际移动的距离是轨道总高度的一半（即一套原始列表的高度）
  const scrollDistance = trackHeight / 2;

  if (scrollDistance > 0 && props.scrollSpeedPxPerSecond > 0) {
    // 3. 根据公式 `时间 = 距离 / 速度` 计算动画完成一个周期需要的时间
    const durationInSeconds = scrollDistance / props.scrollSpeedPxPerSecond;
    animationSpeedDuration.value = `${Math.max(1, durationInSeconds).toFixed(2)}s`;
  } else {
    // 如果计算无效，可以设置一个默认值，但通常canScroll会阻止这种情况
    animationSpeedDuration.value = '20s';
  }
};

// --- 事件处理方法 ---

// 鼠标悬停时暂停动画
const pauseAnimation = () => {
  if (marqueeTrackRef.value && canScroll.value) {
    // 直接通过JS修改animationPlayState，这个不会与class冲突
    marqueeTrackRef.value.style.animationPlayState = 'paused';
  }
};

// 鼠标离开时恢复动画
const resumeAnimation = () => {
  if (marqueeTrackRef.value && canScroll.value) {
    marqueeTrackRef.value.style.animationPlayState = 'running';
  }
};

// 点击项目时触发外部事件
const onItemClick = (item) => {
  emit('itemClick', item);
};

// --- 生命周期钩子 ---

onMounted(() => {
  calculateAnimationDuration();
});

// 监视可能影响滚动的props变化
watch(
  [() => props.items, () => props.visibleItemCount],
  () => {
    // 当数据或可视数量变化时，重新计算动画时长
    // Vue的响应式系统会自动处理 class 和 style 的更新
    calculateAnimationDuration();
  },
  {
    deep: true, // 深度监视items数组内部的变化
    flush: 'post' // 确保在DOM更新之后执行回调，以便获取正确的元素尺寸
  }
);
</script>

<style scoped lang="less">
// 引入你的全局LESS变量
// @import '@/assets/styles/_variables.less'; 

// 估算值，用于计算容器高度
@estimated-item-total-height: 38px;

.vertical-marquee-container {
  height: calc(v-bind('props.visibleItemCount') * @estimated-item-total-height);
  overflow: hidden;
  position: relative;
  background-color: #fff;
  padding: 0 30px;
  box-sizing: border-box;
}

.marquee-track {
  // 默认无动画
  animation-name: none;
  
  // 当 canScroll 为 true 时，is-scrolling 类被添加
  &.is-scrolling {
    // JS只负责提供 animation-duration，CSS负责应用动画本身
    animation-name: continuous-vertical-scroll;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    will-change: transform;
  }
}

// 定义滚动动画
@keyframes continuous-vertical-scroll {
  0% {
    transform: translateY(0);
  }
  100% {
    // 向上移动整个轨道高度的50%，实现无缝循环
    transform: translateY(-50%);
  }
}

.marquee-item-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dotted #E8E8E8;
  box-sizing: border-box;
  cursor: pointer;
}

.marquee-item-text-content {
  flex-grow: 1;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
  font-size: 14px;
  line-height: 1.2;
  padding-right: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.marquee-item-date-content {
  font-family: 'PingFang SC', sans-serif;
  font-size: 14px;
  line-height: 1.2;
  color: #333333;
  flex-shrink: 0;
}
</style>