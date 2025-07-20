<template>
    <section class="home-news-section section-padding">
      <div class="container">
        <div class="news-columns-wrapper">
          <div class="news-column">
            <SectionHeader title-ch="平台动态" title-en="ICSHARE NEWS" />
            <div class="news-list-wrapper">
              <ScrollingNewsList
                :items="platformNews"
                :items-per-page="5"
                :auto-cycle-interval="5000"
                @item-click="handleNewsItemClick"
              />
            </div>
          </div>
          <div class="news-column">
            <SectionHeader title-ch="会员动态" title-en="MEMBER NEWS" />
            <div class="news-list-wrapper">
              <ScrollingNewsList
                :items="memberNews"
                :items-per-page="5"
                :timeCode="'publishTime'"
                :auto-cycle-interval="5500"
                @item-click="handleNewsItemClick"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
</template>
<script setup>
import { ref, onMounted  } from 'vue';
import SectionHeader from '@/components/common/SectionHeader.vue'; // Your existing section header
import ScrollingNewsList from './ScrollingNewsList.vue'; // Adjust path
import defHttp from '@/utils/http/axios'

const platformNews = ref([]);
const memberNews = ref([]);

const fetchPlatformNews = async () => {
  const res = await defHttp.get({ url: `/apm/apmOperateLog/list/front`, params: { page: 1, pageSize: 20 } });
  let items = [];
  if (res.success) {
    items = res.result.records
  }
  platformNews.value = items;
};
const fetchMemberNews = async () => {
  const res = await defHttp.get({ url: `/apm/apmNewsForVip/list/front`, params: { page: 1, pageSize: 20 } });
  let items = [];
  if (res.success) {
    items = res.result.records
  }
  memberNews.value = items;
};

onMounted(() => {
  fetchPlatformNews();
  fetchMemberNews();
});

const handleNewsItemClick = (item) => {
  console.log('News item clicked:', item);
  // router.push({ name: 'NewsDetail', params: { id: item.id } });
  message.info(`点击了新闻: ${item.text.substring(0, 20)}...`);
};

</script>
<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.home-news-section { background-color: #FAFAFA; }
.section-padding { padding: 0 0 10px; }
.news-columns-wrapper { display: flex; gap: @spacing-xxl; @media (max-width: 992px) { flex-direction: column; gap: @spacing-xl; } }
.news-column { flex: 1; min-width: 0; }
.news-list-wrapper{ padding: 15px 0; background: #fff; border: 1px solid #EAEAEA;}
</style>