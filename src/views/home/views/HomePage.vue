<template>
  <div class="home-page">
    <HomeHeroSection :height="200"/>
    <HomeStatsSection />
    <HomePlatformMemberSection v-if="isLogin" @request-verification="isVerificationModalVisible = true" />
    <HomeNewsWrapper />
    <HomeBreakthroughsSection v-if="isLogin" @request-verification="isVerificationModalVisible = true" />
    <PromoCard/>
    <HomeFeaturedListsSection/>
    <HomeResearchReportSection />
    <SynergyNodesSection/>
  </div>
  <SecondaryVerificationModal v-model:open="isVerificationModalVisible" />
</template>

<script setup>
import { ref, computed } from 'vue';
import HomeHeroSection from '../components/HomeHeroSection.vue';
import HomeStatsSection from '../components/HomeStatsSection.vue';
import HomePlatformMemberSection from '../components/HomePlatformMemberSection.vue';
import HomeResearchReportSection from '../components/HomeResearchReportSection.vue';
import HomeNewsWrapper from '../components/HomeNewsWrapper.vue';
import HomeBreakthroughsSection from '../components/HomeBreakthroughsSection.vue';
import PromoCard from '../components/PromoCard.vue';
import HomeFeaturedListsSection from '../components/HomeFeaturedListsSection.vue';
import SynergyNodesSection from '../components/SynergyNodesSection.vue';
import SecondaryVerificationModal from '../components/SecondaryVerificationModal.vue';
import { useAuthStore } from '@/store/authStore';

const authStore = useAuthStore();
const isLogin = computed(() => authStore.isLogin);
const isVerificationModalVisible = ref(false);
</script>

<style scoped lang="less">
.home-page {
  // No specific styles needed here for now, sections manage their own.
}
</style>