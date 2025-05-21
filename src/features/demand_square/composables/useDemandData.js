import { ref, reactive, computed } from 'vue';

// TODO: API_BASE_URL should come from env or a config file
const API_BASE_URL = '/api/demand-square'; // Example base

export function useDemandData(demandTypeKey) {
  const items = ref([]);
  const isLoading = ref(false);
  const totalItems = ref(0);
  const pagination = reactive({
    currentPage: 1,
    pageSize: 9, // Default page size, can be made configurable
  });
  const currentFilters = ref({});
  const currentSearchTerm = ref('');

  // --- Mock API Call ---
  // TODO: Replace with actual API calls using Axios instance
  async function fetchItemsAPI(typeKey, filters, searchTerm, page, limit) {
    console.log(`[API STUB] Fetching ${typeKey}:`, { filters, searchTerm, page, limit });
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Simulate different data based on typeKey if needed for mock
    let mockData = [];
    const baseId = (page - 1) * limit;
    for (let i = 0; i < limit; i++) {
      const id = baseId + i + 1;
      mockData.push({
        id: `${typeKey}-${id}`,
        category: (filters.category || ['Pump', 'Sensor', 'Valve'])[(id % 3)],
        title: `${searchTerm || '示例项目'} - ${typeKey} - ${id}`,
        views: Math.floor(Math.random() * 200) + 50,
        description: `这是${typeKey}类型的一个模拟项目描述，编号 ${id}。应用筛选条件：${JSON.stringify(filters)}。搜索词：'${searchTerm}'。`,
        date: `2024-0${Math.floor(id % 9) + 1}-${String(Math.floor(id % 28) + 1).padStart(2, '0')}`,
        location: (filters.region || ['华东', '华南', '华中'])[(id % 3)],
      });
    }

    // Simulate basic search filtering on title (client-side for mock)
    if (searchTerm) {
      mockData = mockData.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    // Simulate filtering by category (client-side for mock)
    if (filters.category) {
       mockData = mockData.filter(item => item.category.toLowerCase() === filters.category.toLowerCase());
    }


    // Simulate total results
    // In a real API, the backend would provide the correct total based on filters.
    let simulatedTotal = 200; // Base total for this type
    if (searchTerm || Object.keys(filters).length > 0) {
        simulatedTotal = mockData.length > 0 ? mockData.length * 2 + 5 : 0; // Make total dynamic based on filtered mock data
    }


    return {
      data: mockData, // The API should return only the items for the current page
      total: simulatedTotal,
    };
  }
  // --- End Mock API Call ---

  async function loadItems() {
    isLoading.value = true;
    try {
      // TODO: Construct actual API endpoint, e.g., `${API_BASE_URL}/${demandTypeKey}/list`
      const response = await fetchItemsAPI(
        demandTypeKey,
        currentFilters.value,
        currentSearchTerm.value,
        pagination.currentPage,
        pagination.pageSize
      );
      items.value = response.data;
      totalItems.value = response.total;
    } catch (error) {
      console.error(`Error fetching items for ${demandTypeKey}:`, error);
      items.value = [];
      totalItems.value = 0;
      // TODO: Implement user-facing error handling (e.g., using a notification system)
    } finally {
      isLoading.value = false;
    }
  }

  const updateFiltersAndSearch = (filters, searchTerm) => {
    currentFilters.value = { ...filters };
    currentSearchTerm.value = searchTerm || '';
    pagination.currentPage = 1; // Reset to first page
    loadItems();
  };

  const updateSearchTerm = (searchTerm) => {
    currentSearchTerm.value = searchTerm || '';
    pagination.currentPage = 1;
    loadItems();
  }

  const changePage = (page) => {
    pagination.currentPage = page;
    loadItems();
  };

  // Reset function for when tabs change or explicit reset is needed
  const resetData = () => {
    items.value = [];
    totalItems.value = 0;
    pagination.currentPage = 1;
    currentFilters.value = {};
    currentSearchTerm.value = '';
    // Optionally, trigger a loadItems() here if a tab should always load initial data
  };

  return {
    items,
    isLoading,
    totalItems,
    pagination,
    currentFilters,     // Expose for initial state if needed
    currentSearchTerm,  // Expose for initial state if needed
    loadItems,
    updateFiltersAndSearch,
    updateSearchTerm,
    changePage,
    resetData,
  };
}