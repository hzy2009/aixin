<template>
  <div class="home-page">
    <HomeHeroSection />
    <HomePlatformMemberSection />
    <HomeStatsSection />
    <HomeFeaturedContentSection />
    <HomeExpertTalentSection />
    <HomeResearchReportSection />
  </div>
</template>

<script setup>
import HomeHeroSection from '../components/HomeHeroSection.vue';
import HomeStatsSection from '../components/HomeStatsSection.vue';
import HomeFeaturedContentSection from '../components/HomeFeaturedContentSection.vue'; // Changed
import HomeExpertTalentSection from '../components/HomeExpertTalentSection.vue';
import HomePlatformMemberSection from '../components/HomePlatformMemberSection.vue';
import HomeResearchReportSection from '../components/HomeResearchReportSection.vue';
</script>

<style scoped lang="less">
.home-page {
  // No specific styles needed here for now, sections manage their own.
}
</style>