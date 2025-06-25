<template>
  <div class="stat-row-container">
    <div
      v-for="(item, index) in stats"
      :key="index"
      class="stat-item"
      @click="$emit('statsChanged', item)"
    >
      <div class="stat-content">
        <div class="stat-label">{{ item.label }}</div>
        <div class="stat-value">{{ item.count || 0 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
const emit = defineEmits(['statsChanged']);
defineProps({
  /**
   * @type {Array<{label: string, value: number | string}>} 统计数据数组
   * 每个对象应包含 label (标签文本) 和 value (数值)
   */
  stats: {
    type: Array,
    required: true,
    default: () => [], // 提供默认值，防止父组件未传入数组时报错
  }
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.stat-row-container {
  display: flex;
  justify-content: space-between; // 让子项在主轴上分散对齐
  align-items: center; // 子项在交叉轴上居中对齐
  background-color: #fff; // 图片背景色是白色
  padding: 25px 20px; // 上下留白
  margin-bottom: 20px;
  // border-radius: @border-radius-base; // 如果需要圆角可以加上
  // box-shadow: 0 1px 3px rgba(0,0,0,0.04); // 如果需要阴影可以加上
}

.stat-item {
  flex: 1.5; // 让每个统计项占据相等的空间
  min-width: 0; // 允许flex项收缩到比其内容更小
  // padding: 0 20px; // 左右内边距，这会创建统计项之间的空隙
  color: @primary-color; // 图片中标签的红色
  cursor: pointer;
  // 添加右边框作为分隔线，最后一个项除外
  &:not(:last-child) {
    border-right: 1px solid #e0e0e0; // 淡灰色边框
  }

  // 内部布局：标签在上，数值在下，并居中
  display: flex;
  flex-direction: column;
  align-items: center; // 子项（label和value）在交叉轴上居中
  text-align: center; // 文本水平居中
  &:first-child {
    flex: 1;
    align-items: normal; 
    text-align: left; 
    padding-right: 20px;
    display: flex;
    align-items: flex-start;
  }
  &:last-child {
    flex: 1;
    align-items: normal; 
    text-align: right; 
    padding-right: 20px;
    display: flex;
    align-items: flex-end;
  }
}
.stat-label {
  font-family: PingFang SC;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  width: 100%;
  letter-spacing: 0%;
  text-align: center;
  height: 14px;
  margin-bottom: 10px; // 标签与数值之间的间距
  white-space: nowrap; // 防止标签文本换行
  overflow: hidden;
  text-overflow: ellipsis; // 如果标签过长，显示省略号
}

.stat-value {
  height: 35px;
  width: 100%;
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 30px;
  line-height: 35px;
  letter-spacing: 0%;
  text-align: center;
  white-space: nowrap; // 防止数值换行
  overflow: hidden;
  text-overflow: ellipsis; // 如果数值过长，显示省略号 (尽管不太可能)
}
</style>