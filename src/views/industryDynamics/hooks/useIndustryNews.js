import { ref, reactive } from 'vue';
// import apiClient from '@/api'; // Your Axios instance
import { message } from 'ant-design-vue';

export function useIndustryNews(listType = 'main') { // listType can be 'main' or 'hot'
  const newsItems = ref([]);
  const isLoading = ref(false);
  const totalItems = ref(0);
  const pagination = reactive({
    currentPage: 1,
    pageSize: listType === 'main' ? 6 : 4, // Main list shows 6, hot list shows 4
  });
  const error = ref(null);

  async function fetchNews(page = pagination.currentPage, limit = pagination.pageSize) {
    isLoading.value = true;
    error.value = null;
    try {
      // TODO: Replace with actual API call
      // const endpoint = listType === 'hot' ? '/api/news/hot' : '/api/news/list';
      // const params = { page, limit, type: 'industry' }; // Add any specific filters
      // const response = await apiClient.get(endpoint, { params });
      // newsItems.value = response.data.items;
      // totalItems.value = response.data.total;

      // --- Mock API Call ---
      console.log(`[MOCK API] Fetching ${listType} news: page ${page}, limit ${limit}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockDataPool = [];
      const startId = (page - 1) * limit * 5; // To ensure different data for different pages/types
      for (let i = 0; i < (listType === 'main' ? 30 : 10) ; i++) { // Smaller pool for hot news
        const id = startId + i + 1;
        mockDataPool.push({
          id: `news-${listType}-${id}`,
          title: `${listType === 'hot' ? '热门动态' : '行业动态'} - 中国半导体企业加速技术突围示例标题 ${id}`,
          summary: `人民财讯5月${id % 30 + 1}日电，近日，中国第三代半导体领军企业英诺赛科在与国际芯片巨头英飞凌的专利诉讼中取得关键胜利，确认管辖权。此事件标志着国内企业在高端技术领域的竞争力显著增强，并为未来发展奠定坚实基础。`,
          publishDate: `2025-0${Math.floor(id % 9) + 1}-${String(id % 28 + 1).padStart(2, '0')}`,
        });
      }
      const paginatedItems = mockDataPool.slice((page-1)*limit, page*limit);
      newsItems.value = paginatedItems;
      totalItems.value = mockDataPool.length;
      // --- End Mock API Call ---

    } catch (err) {
      console.error(`Failed to fetch ${listType} news:`, err);
      error.value = `加载${listType === 'hot' ? '热门' : ''}动态失败。`;
      message.error(error.value);
      newsItems.value = [];
      totalItems.value = 0;
    } finally {
      isLoading.value = false;
    }
  }

  const changePage = (newPage) => {
    if (newPage !== pagination.currentPage) {
      pagination.currentPage = newPage;
      fetchNews(newPage, pagination.pageSize);
    }
  };

  return {
    newsItems,
    isLoading,
    totalItems,
    pagination,
    error,
    fetchNews,
    changePage,
  };
}