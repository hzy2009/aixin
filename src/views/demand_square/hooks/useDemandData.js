import { ref, reactive } from 'vue';
import defHttp from '@/utils/http/axios'

// TODO: This should ideally come from an environment variable or a central API config service
// For now, it's not directly used by the mock function but good to keep in mind for real API.
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const APIMAP = {
  domestic: 'apm/apmSourcing/list/front?sourcingType=国产替代寻源',
  originalSourcing: 'apm/apmSourcing/list/front?sourcingType=原厂件寻源',
  rndCollaboration: 'apm/apmRdBreakthrough/list/front',
  testingValidation: 'apm/apmInspection/list/front',
  // industryReport: '/api/demand_square/industryReport',
  // offlineEvents: '/api/demand_square/offlineEvents',
  // myAlternativeSourcing: '/api/demand_square/myAlternativeSourcing',
  
}
export function useDemandData(demandTypeKey) {
  const items = ref([]);
  const isLoading = ref(false);
  const totalItems = ref(0);
  const pagination = reactive({
    currentPage: 1,
    pageSize: 9, // Default pageNo size, can be overridden by parent component
  });
  const currentFilters = ref({});
  const keyWord = ref('');

  // --- Mock API Call ---
  // TODO: Replace this entire function with actual API calls using an Axios instance.
  async function fetchItemsAPI(typeKey, filters, searchTerm, pageNo, pageSize) {
    console.log(`[MOCK API] Fetching for "${typeKey}" with:`, { filters, searchTerm, pageNo, pageSize });
    // Simulate network delay
    // await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200)); // 200-1000ms delay
    
    let res = await defHttp.get({ url: APIMAP[typeKey], params: {pageNo, pageSize } });
    const {result: {records, total}} = res
    const paginatedData = records
    return {
      data: paginatedData,
      total: total, // Total after filtering for accurate pagination
    };
  }
  // --- End Mock API Call ---

  async function loadItems() {
    isLoading.value = true;
    try {
      const response = await fetchItemsAPI(
        demandTypeKey,
        currentFilters.value,
        keyWord.value,
        pagination.currentPage,
        pagination.pageSize
      );
      items.value = response.data;
      totalItems.value = response.total;
    } catch (error) {
      console.error(`Error fetching items for "${demandTypeKey}":`, error);
      items.value = []; // Reset on error
      totalItems.value = 0;
      // TODO: Implement user-facing error handling (e.g., using a notification store/system)
      // Example: useNotificationStore().showError('加载数据失败，请稍后再试。');
    } finally {
      isLoading.value = false;
    }
  }

  const updateFiltersAndSearch = (newFilters, newSearchTerm) => {
    currentFilters.value = { ...newFilters };
    keyWord.value = newSearchTerm || ''; // Ensure searchTerm is always a string
    pagination.currentPage = 1; // Reset to first pageNo on any filter/search change
    loadItems();
  };

  // This function might be redundant if updateFiltersAndSearch covers it,
  // but can be kept if you want a specific "only search term changed" trigger.
  const updateSearchTerm = (newSearchTerm) => {
    keyWord.value = newSearchTerm || '';
    pagination.currentPage = 1;
    loadItems();
  }

  const changePage = (newPage) => {
    if (newPage !== pagination.currentPage) {
      pagination.currentPage = newPage;
      loadItems();
    }
  };

  const resetData = () => {
    // items.value = []; // loadItems will replace this
    // totalItems.value = 0; // loadItems will replace this
    pagination.currentPage = 1;
    // currentFilters.value = {}; // Let parent component manage initial filters on tab change
    // keyWord.value = ''; // Let parent component manage initial search on tab change
    // Note: loadItems() is usually called by the parent component after reset and re-initialization
  };

  return {
    items,
    isLoading,
    totalItems,
    pagination,     // Expose the reactive pagination object
    currentFilters, // Expose for parent to set initial state if needed
    keyWord, // Expose for parent to set initial state if needed
    loadItems,
    updateFiltersAndSearch,
    updateSearchTerm,
    changePage,
    resetData,
  };
}