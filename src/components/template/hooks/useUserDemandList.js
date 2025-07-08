import { ref, reactive, computed, onMounted } from 'vue';
import defHttp from '@/utils/http/axios'
import { useAuthStore } from '@/store/authStore';
import { message } from 'ant-design-vue';

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


export function useUserDemandList({otherParams, initialPageSize = 10, statusMapping = defaultStatusMap, url, statusDictKey, userStatCardVisible = false}) {
  const stats = ref({ pendingResponse: 0, inProgress: 0, completed: 0, total: 0 });
  const authStore = useAuthStore();
  const currentFilters = ref({});
  const statusFilter = ref({});
  const search = ref('');
  const isLoading = ref(false);
  const tableData = ref([]);
  const searchParams = ref({});
  
  // *** THIS IS THE ONLY CHANGE ***
  // Simplified pagination object to only hold state, not UI config.
  // vxe-grid's pager-config in the component will handle the UI aspects.
  const pagination = reactive({
    current: 1,
    pageSize: initialPageSize,
    total: 0,
  });

  const selectOptions = (dictKey) => {
    const all = { value: '', label: '全部' }
    if (!dictKey) return [];
    if (!authStore.sysAllDictItems[dictKey]) return []
    const options = authStore.sysAllDictItems[dictKey].map(({ label, value }) => ({ label, value })) || [];
    return [all,...options];
  }
  
  async function fetchStatsAPI() {
    const statusMapp = authStore.sysAllDictItems[statusDictKey] || []
    const res = await defHttp.get({url: url.overview, params: {...otherParams}});
    const result = res.result || [];
    const countMap = {}
    let total = 0
    result.forEach(item => {
      countMap[item.status_code] = item.count
      total = total + item.count
    })
    statusMapp.forEach(item => {
      item.count = countMap[item.value]
    });
    // return {list:statusMapp.slice(0, 5), total:total}
    return {list:statusMapp, total:total}
  }
  
  async function loadStats() {
    stats.value = await fetchStatsAPI();
  }

  async function loadTableData(propsParans = {}) {
    isLoading.value = true;
    try {
      const params = {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
        ...currentFilters.value, 
        search: search.value,
        ...statusFilter.value,
        ...otherParams,
        ...propsParans
      };
      const response = await defHttp.get({url: url.list, params});
      tableData.value = response.result.records || [];
      pagination.total = response.result.total || 0;
    } catch (error) {
      tableData.value = [];
      pagination.total = 0;
    } finally {
      isLoading.value = false;
    }
  }

  const handleFiltersChange = (newFilters) => {
    currentFilters.value = { ...newFilters };
    if(currentFilters.value.skillAreaCode_MultiString){
      currentFilters.value['skillAreaCode'] = `,${currentFilters.value.skillAreaCode_MultiString},`
      delete currentFilters.value.skillAreaCode_MultiString
    }
    pagination.current = 1; 
    loadTableData();
  };
  const handleStatClick = (statusKey) => {
    const cacaedStatus = currentFilters.value.statusCode;
    if (cacaedStatus === statusKey?.value) {
      currentFilters.value = {statusCode: ''};
    } else {
      currentFilters.value = { ...currentFilters.value,statusCode: statusKey?.value };
    }
    pagination.current = 1; 
    loadTableData();
  };

  const handleSearchTermChange = (newSearchTerm) => {
    search.value = newSearchTerm;
  };

  const triggerSearch = (params = {}) => {
    pagination.current = 1;
    searchParams.value = params;
    loadTableData(params);
  };

  // This function remains unchanged and works perfectly with the adapter in ListPage.vue
  const handleTablePaginationChange = (pageInfo) => {
    pagination.current = pageInfo.current;
    pagination.pageSize = pageInfo.pageSize;
    return loadTableData();
  };

  const getStatusTagColor = (statusKey) => statusMapping[statusKey]?.color || 'default';
  

  const XLSX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const XLSX_FILE_SUFFIX = '.xlsx';

  const handleExportXls = async (name, url, params, isXlsx = false) => {
    const data = await defHttp.get({ url: url, params: params, responseType: 'blob', timeout: 60000 }, { isTransformResponse: false });
    if (!data) {
      message.warning('文件下载失败');
      return;
    }
    let reader = new FileReader()
    reader.readAsText(data, 'utf-8')
    reader.onload = async () => {
      if(reader.result){
        if(reader.result.toString().indexOf("success") !=-1){
          try {
            const { success, message } = JSON.parse(reader.result.toString());
            if (!success) {
              message.warning('导出失败，失败原因：' + message);
            } else {
              exportExcel(name, isXlsx, data);
            }
            return;
          } catch (error) {
            exportExcel(name, isXlsx, data);
          }
        }
      }
      exportExcel(name, isXlsx, data);
    }
  }

  const exportExcel = (name, isXlsx, data) => {
    if (!name || typeof name != 'string') {
      name = '导出文件';
    }
    let blobOptions = { type: 'application/vnd.ms-excel' };
    let fileSuffix = '.xls';
    if (isXlsx) {
      blobOptions['type'] = XLSX_MIME_TYPE;
      fileSuffix = XLSX_FILE_SUFFIX;
    }
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(new Blob([data], blobOptions), name + fileSuffix);
    } else {
      let url = window.URL.createObjectURL(new Blob([data], blobOptions));
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', name + fileSuffix);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  }

  const clearfilters = () => {
    currentFilters.value = {};
    search.value = '';
    pagination.current = 1;
    loadTableData();
  }
  const handleDelete = ({id, statusCode, statusName}) => {
    debugger 
    if (statusCode !== 'submit') {
      message.error(`${statusName} 状态的需求无法删除`);
      return;
    }
    isLoading.value = true;
    defHttp.delete({ url: url.delete, params: { id } }).then(() => {
      message.success('删除成功');
      loadTableData();
    }).finally(() => {
      isLoading.value = false;
    });
  }

  onMounted(() => {
    if (userStatCardVisible) loadStats();
    loadTableData();
  });

  return {
    stats,
    currentFilters,
    search,
    isLoading,
    tableData,
    pagination,
    searchParams,
    loadStats,
    loadTableData,
    handleFiltersChange,
    handleStatClick,
    handleSearchTermChange,
    triggerSearch,
    handleTablePaginationChange,
    getStatusTagColor,
    selectOptions,
    handleExportXls,
    clearfilters,
    handleDelete,
  };
}