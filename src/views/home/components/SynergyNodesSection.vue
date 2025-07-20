<template>
  <section class="synergy-nodes-section section-padding">
    <div class="container">
      <SectionHeader title-ch="友情链接" title-en="SYNERGY NODES" :more-link="null" />
      <div class="nodes-grid">
        <div v-for="(column, colIndex) in linkColumns" :key="`col-${colIndex}`" class="nodes-column">
          <ul>
            <li v-for="link in column.links" :key="link.id" class="node-item">
              <a :href="link.url" target="_blank" rel="noopener noreferrer" class="node-link">
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SectionHeader from '@/components/common/SectionHeader.vue'; // Your existing section header
// import apiClient from '@/api'; // If fetching links from an API

// Data for the links, structured into columns
// In a real app, this would likely come from a CMS or API call
const linkColumns = ref([
  {
    id: 'gov',
    // title: '相关政府部门', // Titles above columns are not in this specific image
    links: [
      // { id: 'gov1', name: '中华人民共和国工业和信息化部', url: '#' },
      // { id: 'gov2', name: '中华人民共和国科学技术部', url: '#' },
      // { id: 'gov3', name: '中华人民共和国国家发展和改革委员会', url: '#' },
      // { id: 'gov4', name: '中华人民共和国国家统计局', url: '#' },
      // { id: 'gov5', name: '中华人民共和国海关总署', url: '#' },
      { id: 'assoc1', name: '上海市集成电路行业协会', url: 'https://www.sica.org.cn/#/overview' },
    ]
  },
  {
    id: 'associations',
    // title: '行业协会',
    links: [
      // { id: 'assoc1', name: '上海市集成电路行业协会', url: 'https://www.sica.org.cn/#/overview' },
      { id: 'assoc2', name: '大半导体产业网', url: 'https://www.semi.org.cn' },
      // { id: 'assoc3', name: '求是缘半导体联盟', url: 'https://www.truthsemi.com' },
      // { id: 'assoc4', name: '中国膜工业协会', url: 'http://www.membranes.com.cn/' },
      // { id: 'assoc5', name: '天津市集成电路行业协会', url: '#' },
    ]
  },
  {
    id: 'associations',
    links: [
      { id: 'assoc323', name: 'Semicon China', url: 'https://www.semiconchina.org/' },
    ]
  },
  {
    id: 'media',
    // title: '合作媒体与机构',
    links: [
      // { id: 'media1', name: '《中国电子报》', url: '#' },
      // { id: 'media2', name: '上海硅知识产权交易中心', url: '#' },
      // { id: 'media3', name: '信息化观察网', url: '#' },
      // { id: 'media4', name: '中国电子材料网', url: '#' },
      // { id: 'media5', name: '21IC电子网', url: '#' },
      { id: 'assoc3', name: '求是缘半导体联盟', url: 'https://www.truthsemi.com' },
    ]
  },
  {
    id: 'industries',
    links: [
      { id: 'assoc4', name: '中国膜工业协会', url: 'http://www.membranes.com.cn/' },
    ]
  },
]);

// TODO: If fetching from API:
// const isLoading = ref(false);
// async function fetchLinks() {
//   isLoading.value = true;
//   try {
//     // const response = await apiClient.get('/api/synergy-links');
//     // linkColumns.value = response.data; // Assuming API returns data in the correct structure
//   } catch (error) {
//     console.error("Failed to fetch synergy links:", error);
//   } finally {
//     isLoading.value = false;
//   }
// }
// onMounted(fetchLinks);
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.section-padding { // Re-use or define locally
  padding-top: 10px; // Slightly less top padding than other major sections
  padding-bottom: @spacing-xxl;
}

.synergy-nodes-section {
  background-color: #FAFAFA; // Very light gray background for this section, matching image
}

.nodes-grid {
  background-color: #fff; // Very light gray background for this section, matching image
  display: grid;
  // 3 columns as per the image
  grid-template-columns: repeat(5, 1fr);
  gap: @spacing-xxl; // Generous gap between columns
padding: 10px 30px;
  @media (max-width: 992px) { // 2 columns on tablets
    grid-template-columns: repeat(2, 1fr);
    gap: @spacing-xl;
  }
  @media (max-width: 576px) { // 1 column on small mobile
    grid-template-columns: 1fr;
    gap: @spacing-lg;
  }
}

.nodes-column {
  // No specific styling needed for the column itself if ul handles it
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}

.node-item {
  margin-bottom: 12px; // Space between links in a column, matches image

  &:last-child {
    margin-bottom: 0;
  }
}

.node-link {
  font-family: PingFang SC;
font-weight: 400;
font-size: 14px;
line-height: 30px;
letter-spacing: 0%;
text-transform: uppercase;

  color: #000000; // Dark gray text color for links, matches image
  text-decoration: none;
  transition: color 0.3s ease;
  &:hover {
    color: @primary-color; // Red on hover
    text-decoration: underline; // Underline on hover
  }
}
</style>