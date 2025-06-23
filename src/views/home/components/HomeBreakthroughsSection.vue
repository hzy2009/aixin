<template>
    <section class="home-breakthroughs-section section-padding">
      <div class="container">
        <div class="breakthroughs-column">
          <SectionHeader title-ch="最新国产化研发成果" title-en="LATEST BREAKTHROUGHS IN PARTS&MATERIALS LOCALIZATION" more-link="/breakthroughs" />
          <!-- Use the new SpecificPagedList component -->
          <SpecificPagedList
            :items="breakthroughItems"
            :items-per-page="7"
            :auto-cycle-interval="6000"
            :show-pagination="breakthroughItems.length > 7"
            @item-click="handleBreakthroughItemRowClick"
            @action-click="handleBreakthroughActionBtnClick"
          />
        </div>
      </div>
    </section>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import SectionHeader from '@/components/common/SectionHeader.vue';
import SpecificPagedList from './SpecificPagedList.vue';
const breakthroughItems = ref([]);
const fetchBreakthroughItems = async () => {
  await new Promise(resolve => setTimeout(resolve, 450));
  const itemsData = [];
  const texts = [ '光学声子软化新理论：突破半导体器件功耗瓶颈新希望', '浙江大学PEDL团队五项重要成果在功率器件顶级会议ISPSD发表', '镓仁半导体成功制备VB法100毫米(010)面氧化镓单晶衬底', '高整流、超低漏P-Si/N-ALN异质结PN二极管', '众专家学者共话硅、碳化硅器件及其他高压功率器件进展', '高整流、超低漏P-Si/N-ALN异质结PN二极管 (重复示例)', '众专家学者共话硅、碳化硅器件及其他高压功率器件进展 (重复示例)' ];
  const dates = ['2025/06/03', '2025/06/03', '2025/06/03', '2025/06/01', '2025/05/24', '2025/06/01', '2025/05/24', '2025/05/20', '2025/05/18'];
  for (let i = 0; i < texts.length; i++) {
    itemsData.push({ id: `bk-${i + 1}`, text: texts[i], date: dates[i], actionText: '点击联系平台获取最新进展', });
  }
  breakthroughItems.value = itemsData;
};

const handleBreakthroughItemRowClick = (item) => {
  console.log('Breakthrough item ROW clicked:', item);
  // Potentially navigate to a detail page if the row itself is meant to be a link
  // router.push({ name: 'BreakthroughDetail', params: { id: item.id } });
};
const handleBreakthroughActionBtnClick = (item) => {
  console.log('Breakthrough ACTION BUTTON clicked:', item);
  message.info(`联系平台关于: ${item.text.substring(0,15)}...`);
  // Implement contact logic (e.g., open a modal, go to contact page)
};

onMounted(() => {
  fetchBreakthroughItems();
});
</script>