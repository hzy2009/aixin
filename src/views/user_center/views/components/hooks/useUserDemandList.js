import { ref, reactive, computed, onMounted } from 'vue';
import defHttp from '@/utils/http/axios'
import { useAuthStore } from '@/store/authStore';

// 模拟的状态映射表，可以从外部传入或在这里定义
const defaultStatusMap = {
  pending: { text: '未响应', color: '#faad14' },
  sourcing: { text: '寻源中', color: '#1890ff' },
  found: { text: '已寻到', color: '#52c41a' },
  inProgress: { text: '进行中', color: '#13c2c2' },
  published: { text: '寻源发布', color: '#2db7f5' },
  not_found: { text: '未寻到', color: '#f5222d' },
  closed: { text: '已关闭', color: '#bfbfbf' },
  user_recommended: { text: '用户推荐', color: 'purple' },
  third_party_match: { text: '三方对接', color: 'magenta' },
  verified: { text: '验证', color: 'lime' },
  all: { text: '全部', color: 'default' }
};


export function useUserDemandList({otherParams, initialPageSize = 10, statusMapping = defaultStatusMap, url}) {
  const stats = ref({ pendingResponse: 0, inProgress: 0, completed: 0, total: 0 });
  const auth = useAuthStore();
  const currentFilters = ref({});
  const search = ref('');
  const isLoading = ref(false);
  const tableData = ref([]);
  const pagination = reactive({
    current: 1,
    pageSize: initialPageSize,
    total: 0,
    showSizeChanger: false,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
    // itemRender can be customized directly in component if needed, or passed as prop to hook
  });
  const selectOptions = (dictKey) => {
    const all = { value: '', label: '全部' }
    if (!dictKey) return [];
    if (!auth.sysAllDictItems[dictKey]) return [all]
    const options = auth.sysAllDictItems[dictKey].map(({ label, value }) => ({ label, value })) || [];
    return [all, ...options];
  }
  // --- API Call Placeholders ---
  // TODO: Replace with actual API calls
  async function fetchStatsAPI() {
    const statusMapp = selectOptions('sourcing_status')
    console.log(auth.sysAllDictItems)
    const response = await defHttp.get({url: url.overview});
    console.log(response);
    // Simulate different stats for different demand types if necessary
    return { pendingResponse: 26, inProgress: 12, completed: 52, total: 90 }; // Adjusted total
  }

  // --- End API Call Placeholders ---

  async function loadStats() {
    stats.value = await fetchStatsAPI();
  }

  async function loadTableData() {
    isLoading.value = true;
    try {
      const params = {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        ...currentFilters.value, 
        search: search.value,
        ...otherParams,
      };
      const response = await defHttp.get({url: url.list, params});
      tableData.value = response.result.records || [];
      pagination.total = response.result.total || 0;
    } catch (error) {
      console.error("Failed to fetch table data:", error);
      tableData.value = [];
      pagination.total = 0;
      // TODO: Show error to user
    } finally {
      isLoading.value = false;
    }
  }

  const handleFiltersChange = (newFilters) => {
    currentFilters.value = { ...newFilters };
    pagination.current = 1; // Reset to first page
    loadTableData();
  };

  const handleSearchTermChange = (newSearchTerm) => {
    search.value = newSearchTerm;
    // Decide if search triggers immediately or on button click
    // For now, let's assume it triggers on button click or Enter
  };

  const triggerSearch = () => {
    pagination.current = 1;
    loadTableData();
  };

  const handleTablePaginationChange = (pageInfo) => {
    pagination.current = pageInfo.current;
    // pagination.pageSize = pageInfo.pageSize; // If page size changer enabled
    loadTableData();
  };

  const getStatusTagColor = (statusKey) => statusMapping[statusKey]?.color || 'default';
  
  const isVIP = computed(() => {
    return auth.isVip || false;
  });

  onMounted(() => {
    loadStats();
    loadTableData();
  });

  return {
    stats,
    currentFilters,
    search,
    isLoading,
    tableData,
    pagination, // Expose the reactive pagination object
    // Methods
    loadStats,
    loadTableData,
    handleFiltersChange,
    handleSearchTermChange, // If you want to bind v-model directly to search
    triggerSearch,
    handleTablePaginationChange,
    getStatusTagColor,
    selectOptions,
    isVIP,
  };
}