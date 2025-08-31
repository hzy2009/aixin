<template>
  <section class="similar-products-section">
    <!-- 3.类似商品 -->
    <div class="product-similar-section">
      <div class="details-title-bar">
        <h3 class="details-title-text">{{ '类似商品' }}</h3>
      </div>
      <div class="container section-container">
        <div class="carousel-content-wrapper">
          <div v-if="relatedDevices && relatedDevices.length > 0" class="horizontal-scroll-container">
            <div class="scrollable-track">
              <EquipmentCard
                v-for="device in relatedDevices"
                :item="device"
                :key="device.id"
                :product="device"
                :fieldList="fieldList"
                :tagList="tagList"
                class="scroll-item"
              />
            </div>
          </div>
          <div v-else class="empty-placeholder">
            <a-empty description="暂无商品推荐" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { Empty as AEmpty } from 'ant-design-vue';
import EquipmentCard from './EquipmentCard.vue';

const props = defineProps({
  fieldList: {
    type: Array,
    default: () => []
  },
  tagList: {
    type: Array,
    default: () => []
  },
  product: {
    type: Object,
    default: () => ({})
  }
});

// 使用 product 中的 relatedDeviceList 作为数据源
const relatedDevices = computed(() => {
  return props.product?.relatedDeviceList || [];
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.similar-products-section {
  padding: @spacing-md 0;
  background-color: #fff;
//   background-color: #F7F8FA;
}





.horizontal-scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: @spacing-md;

  &::-webkit-scrollbar { height: 8px; }
  &::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
  &::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
  &::-webkit-scrollbar-thumb:hover { background: #aaa; }
}

.scrollable-track {
  display: flex;
  width: max-content;
  gap: 20px;
}

.scroll-item {
  // EquipmentCard component
}

.loading-placeholder, .empty-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px; // Ensure it has height
  background-color: @background-color-base; // Give it a white background like the cards
  border: 1px solid @border-color-light;
  border-radius: @border-radius-base;
}
.details-title-bar {
    padding-bottom: @spacing-xs;
    margin-bottom: @spacing-sm;
    border-bottom: 1px solid @border-color-light;
    position: relative;

    .details-title-text {
     color: #656C74;
      margin: 0;
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 14px;
      line-height: 15px;
      letter-spacing: 0px;

      display: inline-block;
      position: relative;

      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 2px;
        background-color: @primary-color;
        position: absolute;
        bottom: -8px;
        left: 0;
        z-index: 1;
      }
    }
  }
</style>