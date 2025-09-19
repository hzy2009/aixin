<template>
  <section class="home-featured-lists-section section-padding">
    <div class="container">
      <div class="featured-lists-grid">
        <!-- Column 1: Industry Hotspots -->
        <div class="list-column">
          <SectionHeader title-ch="行业热点" title-en="INDUSTRY HOTSPOTS" :more-link="hotspotsMoreLink" />
          <div class="items-list-container hotspots-list-inner">
            <div v-if="isLoadingHotspots && hotspots.length === 0" class="list-loading">
              <a-spin />
            </div>
            <IndustryHotspotItem
              v-for="hotspot in hotspots"
              :key="hotspot.id"
              :hotspot="hotspot"
            />
            <a-empty v-if="!isLoadingHotspots && hotspots.length === 0" description="暂无行业热点" :image-style="{ height: '60px' }"/>
          </div>
        </div>

        <!-- Column 2: Experts and Talents -->
        <div class="list-column">
          <SectionHeader title-ch="专家人才" title-en="EXPERTS AND TALENTS" :more-link="expertsMoreLink" />
          <div class="experts-grid-container">
             <div v-if="isLoadingExperts && experts.length === 0" class="list-loading">
              <a-spin />
            </div>
            <ExpertTalentCard
              v-for="expert in experts"
              :key="expert.id"
              :expert="expert"
              class="expert-card-in-list"
            />
             <a-empty v-if="!isLoadingExperts && experts.length === 0" description="暂无专家人才信息" :image-style="{ height: '60px' }" class="expert-empty-span-cols"/>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Spin as ASpin, Empty as AEmpty } from 'ant-design-vue';
import SectionHeader from '@/components/common/SectionHeader.vue';
import defHttp from '@/utils/http/axios'
// Import the item components directly (no longer separate files if you prefer full encapsulation later)
// For now, assuming they are still separate components as per previous step for clarity.
import IndustryHotspotItem from './IndustryHotspotItem.vue'; // Path relative to this new component or from feature root
import ExpertTalentCard from './ExpertTalentCard.vue';   // Path relative to this new component or from feature root

const hotspots = ref([]);
const isLoadingHotspots = ref(false);
const hotspotsMoreLink = ref('/industry-dynamics'); // Example "More" link

const experts = ref([]);
const isLoadingExperts = ref(false);
const expertsMoreLink = ref('/demands/Talent'); // Example "More" link

async function fetchIndustryHotspots() {
  isLoadingHotspots.value = true;
  try {
    // TODO: Replace with actual API call: apiClient.get('/api/home/hotspots?limit=6')
    const res = await defHttp.get({ url: `/apm/apmNews/list/front`, params: { page: 1, pageSize: 5 } });
    let items = [];
    if (res.success) {
      items = res.result.records
    }
    hotspots.value = items;
  } catch (error) {
    console.error("Failed to fetch industry hotspots:", error);
  } finally {
    isLoadingHotspots.value = false;
  }
}

async function fetchExpertsAndTalents() {
  isLoadingExperts.value = true;
  try {
    // TODO: Replace with actual API call: apiClient.get('/api/home/experts?limit=4')
    const res = await defHttp.get({ url: `/apm/apmTalent/list/front`, params: { page: 1, pageSize: 4 } });
    let items = [];
    if (res.success) {
      items = res.result.records
    }
    experts.value = items;
  } catch (error) {
    console.error("Failed to fetch experts and talents:", error);
  } finally {
    isLoadingExperts.value = false;
  }
}

onMounted(() => {
  fetchIndustryHotspots();
  fetchExpertsAndTalents();
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.section-padding { // Re-use or define locally
  padding-top: 10px;
  padding-bottom: 10px;
}

.home-featured-lists-section {
  background-color: #FAFAFA; // White background for this entire section
}

.featured-lists-grid {
  display: flex;
  // As per your request, gap between the two columns
  gap: 20px; // The specific gap you requested

  @media (max-width: 992px) { // Stack on smaller screens
    flex-direction: column;
    gap: @spacing-xl; // Adjust gap for stacked view if needed
  }
}

.list-column {
  flex: 1; // Each column takes up half the space (minus gap)
  min-width: 0; // Important for flex children containing text that might overflow
  background-color: #F7F8FA; // Light gray background for each column's content area
  border-radius: @border-radius-sm; // Slight rounding for the column background
}

.items-list-container { // For IndustryHotspotItem list
    background-color: #fff;
    padding: 25px 14px;
  // No specific styling needed here if items handle their own separation
}
.hotspots-list-inner {
  min-height: 309px;
    // If IndustryHotspotItem has padding:0 on top for first-child, this container might need padding-top.
    // But current IndustryHotspotItem has padding:10px 0; so it's fine.
}


.experts-grid-container {
  min-height: 309px;
  display: grid;
  // For "专家人才", it's a 2x2 grid within its column if space allows
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); // Responsive within its column
  // To strictly enforce 2 columns if the list-column is wide enough:
  // grid-template-columns: repeat(2, 1fr);
  gap: @spacing-md; // Gap between expert cards
}

.expert-card-in-list {
  // Ensure ExpertTalentCard background is white or transparent to show column's gray
  // Or, remove background from list-column and let cards have their own.
  // The image seems to have gray background for the column, and then cards on top.
  // So ExpertTalentCard should have its own background (which it does: #F7F8FA default, or set to white)
  // For this design, ExpertTalentCard already has background: #F7F8FA;
  // If you want cards to be white on gray column:
  // background-color: @background-color-base;
  // box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.list-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 150px; // Give some space for spinner
}
// Span empty message across columns in expert grid
.expert-empty-span-cols {
    grid-column: 1 / -1; // Make empty component span all columns
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 150px;
}
</style>