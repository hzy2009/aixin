<template>
  <div class="results-grid">
    <EquipmentCard
      v-for="item in formattedDataSource"
      :key="item.id"
      :item="item"
      :fieldList="fieldList"
      @details="handleDetails"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import EquipmentCard from './EquipmentCard.vue';

const props = defineProps({
  // 假设从 listPage 传入原始数据源
  dataSource: {
    type: Array,
    required: true
  },
  fieldList: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['handleDetails']);

// 将后端返回的原始数据格式化为 EquipmentCard 需要的 props 格式
const formattedDataSource = computed(() => {
  if (!props.dataSource) return [];
  return props.dataSource
});

const handleDetails = (item) => {
  // 将事件继续向上冒泡到父页面 (listPage)
  emit('handleDetails', item);
};

</script>

<style scoped lang="less">
.results-grid {
  display: grid;
  // 响应式布局：在不同屏幕宽度下显示不同列数
  grid-template-columns: repeat(4, 1fr); // 默认4列
  gap: 20px; // 卡片之间的间距

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}
</style>