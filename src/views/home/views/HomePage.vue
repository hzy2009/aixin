<template>
  <div class="home-page">
    <HomeHeroSection :height="200"/>
    <HomeStatsSection />
    <HomePlatformMemberSection />
    <HomeNewsWrapper />
    <HomeBreakthroughsSection/>
    <PromoCard/>
    <HomeFeaturedListsSection/>
    <HomeResearchReportSection />
    <SynergyNodesSection/>
  </div>
</template>

<script setup>
import HomeHeroSection from '../components/HomeHeroSection.vue';
import HomeStatsSection from '../components/HomeStatsSection.vue';
import HomePlatformMemberSection from '../components/HomePlatformMemberSection.vue';
import HomeResearchReportSection from '../components/HomeResearchReportSection.vue';
import HomeNewsWrapper from '../components/HomeNewsWrapper.vue';
import HomeBreakthroughsSection from '../components/HomeBreakthroughsSection.vue';
import PromoCard from '../components/PromoCard.vue';
import HomeFeaturedListsSection from '../components/HomeFeaturedListsSection.vue';
import SynergyNodesSection from '../components/SynergyNodesSection.vue';
</script>

<style scoped lang="less">
.home-page {
  // No specific styles needed here for now, sections manage their own.
}
</style>