<template>
  <section class="similar-products-section">
    <!-- 3.类似商品 -->
    <div class="product-similar-section">
      <div class="details-title-bar">
        <h3 class="details-title-text">{{ '类似商品' }}</h3>
      </div>
      <div class="container section-container">
        <div class="carousel-content-wrapper">
          <div v-if="isLoading" class="loading-placeholder">
            <a-spin size="large" />
          </div>
          <div v-else-if="products && products.length > 0" class="horizontal-scroll-container">
            <div class="scrollable-track">
              <EquipmentCard
                v-for="product in products"
                :item="product"
                :key="product.id"
                :product="product"
                :fieldList="fieldList"
                :tagList="tagList"
                class="scroll-item"
              />
            </div>
          </div>
          <div v-else class="empty-placeholder">
            <a-empty description="暂无商品推荐" />
          </div>
          <div class="pagination-controls">
              <div v-if="totalPages > 1" class="carousel-controls">
                  <button class="control-arrow" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
                  <LeftOutlined />
                  </button>
                  <span class="pageNo-indicator">{{ currentPage }} / {{ totalPages }}</span>
                  <button class="control-arrow" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
                  <RightOutlined />
                  </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { Spin as ASpin, Empty as AEmpty, message } from 'ant-design-vue';
import EquipmentCard from './EquipmentCard.vue'; // Adjust path if necessary
import defHttp from '@/utils/http/axios'

const props = defineProps({
  basedOnProductId: {
    type: String,
    default: null
  },
  config: {
    type: Object,
    default: () => ({})
  },
  fieldList: {
    type: Array,
    default: () => []
  },
  tagList: {
    type: Array,
    default: () => []
  }
});

const products = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const totalItems = ref(0);
const pageSize = 10; // As per your requirement

const totalPages = computed(() => {
  if (totalItems.value === 0) return 1;
  return Math.ceil(totalItems.value / pageSize);
});

async function fetchSimilarProducts(pageNo = 1) {
  isLoading.value = true;
  try {
    const {success, result, message } = await defHttp.get({ url: props.config.url, params: { pageNo, pageSize: pageSize, ...props.config.params } });
    if (success) {
      const {records, total, current} = result
      products.value = records || [];
      console.log(products.value);
      totalItems.value = total;
      currentPage.value = current; // Update current pageNo state
    }
  } catch (err) {
    console.error("Failed to fetch similar products:", err);
    message.error("加载类似商品失败");
    products.value = [];
    totalItems.value = 0;
  } finally {
    isLoading.value = false;
  }
}

const changePage = (newPage) => {
  if (newPage < 1 || newPage > totalPages.value || isLoading.value) {
    return;
  }
  fetchSimilarProducts(newPage);
};

onMounted(() => {
  fetchSimilarProducts(1); // Fetch the first pageNo on mount
});

watch(() => props.basedOnProductId, () => {
    fetchSimilarProducts(1);
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.similar-products-section {
  padding: @spacing-md 0;
  background-color: #fff;
//   background-color: #F7F8FA;
}

.section-title-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: @spacing-lg;

  .title-decorator-bar {
    width: 4px;
    height: 20px;
    background-color: @primary-color;
    margin-right: @spacing-sm;
  }
  .section-title-text {
    font-size: 20px;
    font-weight: 500;
    color: @text-color-base;
    margin: 0;
    // Push the decorator and title together to the left, leaving space for controls
    flex-grow: 1;
    display: flex;
    align-items: center;
  }
}
.pagination-controls{
    display: flex;
    .carousel-controls {
        margin-left: auto; 
        // Now part of the title block, no longer absolutely positioned
        flex-shrink: 0; // Prevent controls from shrinking
        display: flex;
        align-items: center;
        border-radius: @border-radius-base;
        padding: 4px 8px;
        color: #31363F;

        .control-arrow {
            background: none;
            border: none;
            color: #31363F;
            font-size: 14px;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            &:disabled {
            color: #777;
            cursor: not-allowed;
            }
        }

        .pageNo-indicator {
            font-size: 14px;
            margin: 0 8px;
            user-select: none;
        }
    }
}



.carousel-content-wrapper {
  // This wrapper can be used for consistent height if needed
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