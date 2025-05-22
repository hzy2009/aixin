// src/features/demand_square/composables/useDemandData.js
import { ref, reactive } from 'vue';

// TODO: This should ideally come from an environment variable or a central API config service
// For now, it's not directly used by the mock function but good to keep in mind for real API.
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export function useDemandData(demandTypeKey) {
  const items = ref([]);
  const isLoading = ref(false);
  const totalItems = ref(0);
  const pagination = reactive({
    currentPage: 1,
    pageSize: 9, // Default page size, can be overridden by parent component
  });
  const currentFilters = ref({});
  const currentSearchTerm = ref('');

  // --- Mock API Call ---
  // TODO: Replace this entire function with actual API calls using an Axios instance.
  async function fetchItemsAPI(typeKey, filters, searchTerm, page, limit) {
    console.log(`[MOCK API] Fetching for "${typeKey}" with:`, { filters, searchTerm, page, limit });
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200)); // 200-1000ms delay

    let allMockDataForType = [];
    const totalMockPoolSize = 50; // Create a larger pool of mock data to simulate filtering

    for (let i = 0; i < totalMockPoolSize; i++) {
      const uniqueId = i + 1;
      let baseItem = {
        id: `${typeKey}-${uniqueId}`,
        views: Math.floor(Math.random() * 200) + 10,
      };

      if (typeKey === 'alternativeSourcing') {
        allMockDataForType.push({
          ...baseItem,
          category: (['Pump', 'Sensor', 'Valve', 'MFC', 'Motor'])[uniqueId % 5],
          title: `国产${(filters.category || '设备')}${uniqueId}替代方案 - ${searchTerm || '项目' + uniqueId}`,
          description: `寻求国内优质${(filters.category || '设备')}${uniqueId}供应商，替代进口产品，要求性能稳定，供货周期短。地点：${(filters.region || '不限')}`,
          date: `2024-0${Math.floor(uniqueId % 9) + 1}-${String(Math.floor(uniqueId % 28) + 1).padStart(2, '0')}`,
          location: (filters.region || ['华东', '华南', '华中', '华北'])[(uniqueId % 4)],
        });
      } else if (typeKey === 'originalSourcing') {
        allMockDataForType.push({
          ...baseItem,
          category: (filters.partCategory || ['MCU', 'FPGA', '电源IC'])[(uniqueId % 3)], // Using partCategory as the display tag
          title: `${(filters.manufacturer || '知名品牌')} ${(filters.partCategory || '核心芯片')} ${searchTerm || 'P/N XYZ' + uniqueId} 原厂寻源`,
          description: `紧急求购一批${(filters.manufacturer || '进口')}原厂${(filters.partCategory || '芯片')}，型号${searchTerm || 'XYZ' + uniqueId}，要求正品，带原厂证明。`,
          date: `2024-1${Math.floor(uniqueId % 3)}-${String(Math.floor(uniqueId % 28) + 1).padStart(2, '0')}`, // More recent dates
          location: (['深圳仓', '上海仓', '香港仓'])[(uniqueId % 3)], // Different locations
        });
      } else if (typeKey === 'rndCollaboration') {
        allMockDataForType.push({
          ...baseItem,
          category: (filters.techDomain || ['数字IC设计', '模拟IC设计', '算法'])[(uniqueId % 3)],
          title: `基于${(filters.techDomain || 'AI')}的${searchTerm || '芯片架构'}研发合作 - ${uniqueId}`,
          description: `寻求${(filters.collaborationType === 'jointDev' ? '联合开发伙伴' : '技术方案')}，共同攻克下一代${(filters.techDomain || 'AI芯片')}的关键技术难题。`,
          date: `2025-0${Math.floor(uniqueId % 2) + 1}-${String(Math.floor(uniqueId % 28) + 1).padStart(2, '0')}`, // Future dates
          location: (['北京', '上海', '杭州', '成都'])[(uniqueId % 4)],
        });
      } else if (typeKey === 'testingValidation') {
        allMockDataForType.push({
          ...baseItem,
          category: (filters.testType || ['可靠性测试', '性能验证', '失效分析'])[(uniqueId % 3)],
          title: `${searchTerm || '新型材料芯片'}的${(filters.testType || '全面')}测试服务需求 - ${uniqueId}`,
          description: `为一批${searchTerm || '新研发的传感器芯片'}提供${(filters.testType || '全套')}测试验证，需具备${(filters.equipment || 'ATE')}测试平台。`,
          date: `2024-0${Math.floor(uniqueId % 6) + 7}-${String(Math.floor(uniqueId % 28) + 1).padStart(2, '0')}`,
          location: (['苏州测试中心', '上海实验室', '深圳检测所'])[(uniqueId % 3)],
        });
      } else if (typeKey === 'industryReport') {
        allMockDataForType.push({
          ...baseItem,
          title: `${(filters.publishYear || '2024')}年${(filters.reportType || '全球半导体市场')}发展${searchTerm || '趋势'}报告 - ${uniqueId}`,
          author: `行业分析师 ${String.fromCharCode(65 + (uniqueId % 26))}`, // A, B, C...
          summary: `本报告深入分析了${(filters.publishYear || '当前')}年度${(filters.reportType || '半导体产业')}的${searchTerm || '关键动态、技术进展、市场格局及未来挑战与机遇'}，为业内人士提供决策参考。`,
          category: (filters.reportType || ['半导体制造', 'IC设计', '市场分析', '政策研究'])[(uniqueId % 4)],
          publishDate: `${(filters.publishYear || '2024')}-0${Math.floor(uniqueId % 9) + 1}-${String(Math.floor(uniqueId % 28) + 1).padStart(2, '0')}`,
          thumbnailUrl: null, // Will use placeholder from component
          // No location for reports usually
        });
      } else if (typeKey === 'offlineEvents') {
        allMockDataForType.push({
          ...baseItem,
          title: `${(filters.eventRegion || '全国')}半导体${(filters.eventType || '技术创新')} ${searchTerm || '交流会'} - 第${uniqueId}届`,
          bannerUrl: null, // Will use placeholder
          organizerLogo: null,
          organizerName: `[活动主办方 ${String.fromCharCode(65 + (uniqueId % 5))}]`,
          eventType: (filters.eventType || ['行业会议', '技术沙龙', '展览展示', '培训课程'])[(uniqueId % 4)],
          location: (filters.eventRegion || ['北京', '上海', '深圳', '杭州'])[(uniqueId % 4)],
          eventDate: `2024-1${Math.floor(uniqueId % 2)}-${String(Math.floor(uniqueId % 20) + 1).padStart(2, '0')}`, // Simulate upcoming events
          registeredCount: Math.floor(Math.random() * 80) + (limit > 10 ? 10 : 20), // Make some popular
          maxCapacity: 100 + Math.floor(Math.random() * (limit > 10 ? 50 : 100)),
        });
      }
      else if (typeKey === 'myAlternativeSourcing') { // Key for user's own demands
          allMockDataForType.push({
              ...baseItem,
              id: `my-alt-${uniqueId}`,
              demandTitle: `${searchTerm || 'LETH 675-092 T091 Parts寻源'} - 用户发布 ${uniqueId}`,
              sourcingCategory: (filters.category || ['Pump', 'MFC', 'Sensor', 'Valve'])[(uniqueId % 4)],
              sourcingStatus: (filters.sourcingStatus || ['pending', 'sourcing', 'found', 'closed'])[(uniqueId % 4)],
              deadlineDate: `2024-1${Math.floor(uniqueId % 3)}-${String(Math.floor(uniqueId % 28) + 1).padStart(2, '0')}`,
              publishDate: `2024-0${Math.floor(uniqueId % 9) + 1}-${String(Math.floor(uniqueId % 28) + 1).padStart(2, '0')}`,
              processNumber: `A0009234${uniqueId % 100}`,
              // Add other fields if your table or detail page needs them
          });
      }
    }

    // Simulate Server-Side Filtering (basic examples)
    let filteredMockData = [...allMockDataForType];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredMockData = filteredMockData.filter(item =>
        (item.title && item.title.toLowerCase().includes(lowerSearchTerm)) ||
        (item.description && item.description.toLowerCase().includes(lowerSearchTerm)) ||
        (item.summary && item.summary.toLowerCase().includes(lowerSearchTerm))
      );
    }

    Object.keys(filters).forEach(filterKey => {
      const filterValue = filters[filterKey];
      if (filterValue) { // If a filter is actually set
        const lowerFilterValue = filterValue.toLowerCase();
        filteredMockData = filteredMockData.filter(item => {
          if (item[filterKey] && typeof item[filterKey] === 'string') {
            return item[filterKey].toLowerCase().includes(lowerFilterValue);
          }
          // Add more specific filter logic for different keys if needed
          if (filterKey === 'eventRegion' && item.location) { // Example: if filter key is different from data key
             return item.location.toLowerCase().includes(lowerFilterValue);
          }
          return false;
        });
      }
    });

    // Simulate Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredMockData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total: filteredMockData.length, // Total after filtering for accurate pagination
    };
  }
  // --- End Mock API Call ---

  async function loadItems() {
    isLoading.value = true;
    try {
      // TODO: When connecting to real API, you'll construct the endpoint:
      // const endpoint = `${API_BASE_URL}/${demandTypeKey}/list`;
      // const params = { ...currentFilters.value, search: currentSearchTerm.value, page: pagination.currentPage, limit: pagination.pageSize };
      // const response = await axios.get(endpoint, { params });
      // items.value = response.data.items;
      // totalItems.value = response.data.total;

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
    currentSearchTerm.value = newSearchTerm || ''; // Ensure searchTerm is always a string
    pagination.currentPage = 1; // Reset to first page on any filter/search change
    loadItems();
  };

  // This function might be redundant if updateFiltersAndSearch covers it,
  // but can be kept if you want a specific "only search term changed" trigger.
  const updateSearchTerm = (newSearchTerm) => {
    currentSearchTerm.value = newSearchTerm || '';
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
    // currentSearchTerm.value = ''; // Let parent component manage initial search on tab change
    // Note: loadItems() is usually called by the parent component after reset and re-initialization
  };

  return {
    items,
    isLoading,
    totalItems,
    pagination,     // Expose the reactive pagination object
    currentFilters, // Expose for parent to set initial state if needed
    currentSearchTerm, // Expose for parent to set initial state if needed
    loadItems,
    updateFiltersAndSearch,
    updateSearchTerm,
    changePage,
    resetData,
  };
}