import { ref, reactive } from 'vue';
// import apiClient from '@/api'; // Your Axios instance
// import { useAuthStore } from '@/store/authStore';

export function useMyDemandsData(demandType) { // e.g., 'alternativeSourcing', 'originalSourcing'
  const demands = ref([]);
  const isLoading = ref(false);
  const pagination = reactive({
    current: 1,
    pageSize: 10, // Default for tables
    total: 0,
  });
  const currentFilters = ref({}); // For the filter panel within this page
  const currentSearchTerm = ref('');
  const stats = ref([]); // For the top stats bar

  // const authStore = useAuthStore();

  // TODO: Replace with actual API call
  async function fetchMyDemandsAPI(type, filters, searchTerm, page, limit) {
    console.log(`[MOCK API - MyDemands] Fetching for "${type}" with:`, { filters, searchTerm, page, limit });
    // if (!authStore.user?.id) return { data: [], total: 0, statsData: [] };
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate stats data
    const mockStats = [
      { label: '未响应', value: Math.floor(Math.random() * 30) + 20, iconComponent: 'PictureOutlined', color: '#faad14' }, // Using string for component name for simplicity, resolve in StatsBar
      { label: '进行中', value: Math.floor(Math.random() * 20) + 5, iconComponent: 'LoadingOutlined', color: '#1890ff' },
      { label: '已完成', value: Math.floor(Math.random() * 50) + 30, iconComponent: 'CheckCircleOutlined', color: '#52c41a' },
      { label: '总计', value: 0, iconComponent: 'BarChartOutlined', color: '#2f54eb' }, // Total will be calculated
    ];
    mockStats[3].value = mockStats[0].value + mockStats[1].value + mockStats[2].value;


    const mockDemandsList = [];
    const totalMockItems = mockStats[3].value; // Total items match the stats for consistency

    for (let i = 0; i < totalMockItems; i++) {
      const statusOptions = ['未响应', '进行中', '已寻到', '已关闭'];
      const item = {
        id: `demand-${type}-${i + 1}`,
        title: `我发布的${type === 'alternativeSourcing' ? '国产替代' : '原厂件'}需求 ${searchTerm || 'XYZ'} - ${i + 1}`,
        sourcingType: (filters.category || ['Pump', 'MFC', 'Sensor', 'Valve'])[(i % 4)], // "寻源类型"
        status: statusOptions[i % statusOptions.length],
        deadline: `2024-12-${String(Math.floor(i % 20) + 10).padStart(2, '0')}`,
        publishDate: `2024-0${Math.floor(i % 9) + 1}-${String(Math.floor(i % 28) + 1).padStart(2, '0')}`,
        processNumber: `A000${Math.floor(Math.random() * 9000) + 1000}`,
      };
      mockDemandsList.push(item);
    }

    // Simulate filtering (client-side for mock)
    let filtered = [...mockDemandsList];
    if (searchTerm) {
        filtered = filtered.filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filters.status) {
        filtered = filtered.filter(d => d.status === filters.status);
    }
    if (filters.category) { // Assuming filter key for sourcingType is 'category'
        filtered = filtered.filter(d => d.sourcingType === filters.category);
    }


    const paginatedData = filtered.slice((page - 1) * limit, page * limit);

    return {
      data: paginatedData,
      total: filtered.length,
      statsData: mockStats
    };
  }

  async function loadDemands() {
    isLoading.value = true;
    try {
      const response = await fetchMyDemandsAPI(
        demandType,
        currentFilters.value,
        currentSearchTerm.value,
        pagination.current,
        pagination.pageSize
      );
      demands.value = response.data;
      pagination.total = response.total;
      stats.value = response.statsData;
    } catch (error) {
      console.error("Error fetching my demands:", error);
      demands.value = [];
      pagination.total = 0;
      stats.value = []; // Clear stats on error
      // TODO: Show error to user
    } finally {
      isLoading.value = false;
    }
  }

  const handleFilterChange = (filters, searchTermFromPanel) => {
    currentFilters.value = { ...filters };
    // If FilterPanel updates search term along with filters, use it.
    // Otherwise, SearchInput component will handle search term separately.
    if (searchTermFromPanel !== undefined && searchTermFromPanel !== currentSearchTerm.value) {
        currentSearchTerm.value = searchTermFromPanel;
    }
    pagination.current = 1;
    loadDemands();
  };

  const handleSearch = (searchTerm) => {
    currentSearchTerm.value = searchTerm;
    pagination.current = 1;
    loadDemands();
  };

  const handleTableChange = (pager, filters, sorter) => {
    pagination.current = pager.current;
    pagination.pageSize = pager.pageSize;
    // TODO: Handle server-side sorting if 'sorter' is used
    loadDemands();
  };

  return {
    demands,
    isLoading,
    pagination,
    stats,
    currentFilters, // To bind to FilterPanel's initial state
    currentSearchTerm, // To bind to SearchInput's v-model
    loadDemands,
    handleFilterChange,
    handleSearch,
    handleTableChange,
  };
}