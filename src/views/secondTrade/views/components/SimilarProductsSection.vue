<template>
  <section class="similar-products-section">
    <!-- 3.类似商品 -->
    <div class="product-similar-section">
      <div class="details-title-bar">
        <h3 class="details-title-text">{{ '类似商品' }}</h3>
      </div>
      <div class="container section-container">
        <div class="carousel-content-wrapper">
          <div v-if="relatedDevices && relatedDevices.length > 0">
            <div class="paginated-cards-container">
              <EquipmentCard
                v-for="device in paginatedDevices"
                :item="device"
                :key="device.id"
                :product="device"
                :fieldList="fieldList"
                :tagList="tagList"
                @details="handleDetails"
                class="scroll-item"
              />
            </div>
            <div class="pagination-container" v-if="relatedDevices.length > pageSize">
              <a-pagination
                v-model:current="currentPage"
                :page-size="pageSize"
                :total="relatedDevices.length"
                @change="onPageChange"
                :show-less-items="true"
                :hide-on-single-page="true"
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
import { ref, computed } from 'vue';
import { Empty as AEmpty, Pagination as APagination } from 'ant-design-vue';
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
const emit = defineEmits(['handleDetails']);

const handleDetails = (item) => {
  // 将事件继续向上冒泡到父页面 (listPage)
  emit('handleDetails', item);
};

// 使用 product 中的 relatedDeviceList 作为数据源
const relatedDevices = computed(() => {
  return props.product?.relatedDeviceList || [];
});

// --- Pagination Logic ---
const currentPage = ref(1);
const pageSize = 4;

const paginatedDevices = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return relatedDevices.value.slice(start, end);
});

const onPageChange = (page) => {
  currentPage.value = page;
};
// --- End Pagination Logic ---

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.similar-products-section {
  padding: @spacing-md 0;
  background-color: #fff;
}

.paginated-cards-container {
  display: flex;
  gap: 16px; /* Matches the old gap */
  justify-content: flex-start; /* Align items to the start */
  flex-wrap: wrap; /* Allow wrapping if needed, though with 4 items it shouldn't */
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: @spacing-md;
}
.carousel-content-wrapper{
  padding: 0 8px;
}
.scroll-item {
  // EquipmentCard component - styles remain the same
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