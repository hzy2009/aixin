<template>
  <section class="similar-products-section">
    <div class="container section-container">
      <div class="carousel-content-wrapper">
        <div v-if="isLoading" class="loading-placeholder">
          <a-spin size="large" />
        </div>
        <div v-else-if="products && products.length > 0" class="horizontal-scroll-container">
          <div class="scrollable-track">
            <EquipmentCard
              v-for="product in products"
              :key="product.id"
              :product="product"
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
                <span class="page-indicator">{{ currentPage }} / {{ totalPages }}</span>
                <button class="control-arrow" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
                <RightOutlined />
                </button>
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
// import apiClient from '@/api'; // Your Axios instance

const props = defineProps({
  basedOnProductId: {
    type: String,
    default: null
  }
});

const products = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const totalItems = ref(0);
const itemsPerPage = 10; // As per your requirement

const totalPages = computed(() => {
  if (totalItems.value === 0) return 1;
  return Math.ceil(totalItems.value / itemsPerPage);
});

async function fetchSimilarProducts(page = 1) {
  isLoading.value = true;
  try {
    // TODO: Replace with your actual API call.
    // The API should support pagination (`page` and `limit` parameters).
    // const response = await apiClient.get('/api/products/similar', {
    //   params: {
    //     id: props.basedOnProductId,
    //     page: page,
    //     limit: itemsPerPage
    //   }
    // });
    // products.value = response.data.records;
    // totalItems.value = response.data.total;

    // --- Mock Data ---
    console.log(`[MOCK API] Fetching page ${page} of similar products...`);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate a larger total dataset on the "backend"
    const mockTotalItems = 25; // e.g., 25 items total, so there will be 3 pages
    totalItems.value = mockTotalItems;

    const mockItems = [];
    const startIndex = (page - 1) * itemsPerPage;
    // Generate only the items for the current page
    for (let i = 1; i <= itemsPerPage; i++) {
        const currentIndex = startIndex + i;
        if (currentIndex > mockTotalItems) break; // Stop if we've generated all items

        const priceTypes = ['fixed', 'negotiable', 'open', 'auction'];
        const priceType = priceTypes[currentIndex % priceTypes.length];
        let priceInfo = {};
         switch (priceType) {
            case 'fixed': priceInfo = { type: 'fixed', price: 350 + currentIndex, unit: '万元', subtitle: '固定价, 不可议价' }; break;
            case 'negotiable': priceInfo = { type: 'negotiable', price: 350 + currentIndex, unit: '万元', subtitle: '可议价' }; break;
            case 'open': priceInfo = { type: 'open', price: '****', unit: '万元', subtitle: '开放价格, 接受询价' }; break;
            case 'auction': priceInfo = { type: 'auction', price: 350 + currentIndex, unit: '万元起拍', subtitle: '在线竞拍' }; break;
        }

        mockItems.push({
          id: `prod-scroll-${currentIndex}`,
          imageUrl: currentIndex % 3 === 1 ? '@/assets/images/some-machine.png' : null,
          tags: [{ text: '全新整机(原厂状态)', type: 'primary' }, { text: currentIndex % 2 === 0 ? '现货' : '非现货', type: currentIndex % 2 === 0 ? 'stock' : 'secondary' }],
          title: `Nikon NSR 2205i14E 类似光刻机 #${currentIndex}`,
          details: [{ label: '设备类型', value: '光刻设备(Lithography)' }, { label: '设备型号', value: 'NSR-2205i14E' }, { label: '设备厂商', value: 'Nikon' }],
          priceInfo: priceInfo
        });
    }
    products.value = mockItems;
    currentPage.value = page; // Update current page state
    // --- End Mock Data ---

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
  fetchSimilarProducts(1); // Fetch the first page on mount
});

// Watch for changes in the base product ID to refetch similar items
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

        .page-indicator {
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
</style>