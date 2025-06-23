<template>
    <section class="home-news-section section-padding">
      <div class="container">
        <div class="news-columns-wrapper">
          <div class="news-column">
            <SectionHeader title-ch="平台动态" title-en="ICSHARE NEWS" />
            <ScrollingNewsList
              :items="platformNews"
              :items-per-page="5"
              :auto-cycle-interval="5000"
              @item-click="handleNewsItemClick"
            />
          </div>
          <div class="news-column">
            <SectionHeader title-ch="会员动态" title-en="MEMBER NEWS" />
            <ScrollingNewsList
              :items="memberNews"
              :items-per-page="5"
              :auto-cycle-interval="5500"
              @item-click="handleNewsItemClick"
            />
          </div>
        </div>
      </div>
    </section>
</template>
<script setup>
import { ref, onMounted  } from 'vue';
import SectionHeader from '@/components/common/SectionHeader.vue'; // Your existing section header
import ScrollingNewsList from './ScrollingNewsList.vue'; // Adjust path


const platformNews = ref([]);
const memberNews = ref([]);

const fetchPlatformNews = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const items = [];
  for (let i = 1; i <= 12; i++) {
    items.push({
      id: `pn-${i}`,
      text: `欢迎会员A000${i}加入，成为爱芯享平台零${i > 9 ? i : '0'+i}部件会员！`,
      date: `2025/06/${i > 9 ? i : '0'+i}`,
    });
  }
  platformNews.value = items;
};

const fetchMemberNews = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const items = [];
  for (let i = 1; i <= 7; i++) {
    items.push({
      id: `mn-${i}`,
      text: `会员B000${i}发布一条国产替代寻源需求，寻陶${i}件国产厂商！`,
      date: `2025/05/${i + 20}`,
    });
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
</style>