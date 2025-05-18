<template>
  <section class="home-featured-content-section section-padding">
    <div class="container featured-content-grid">
      <div class="carousel-area">
        <HomeDeviceCarousel />
      </div>
      <div class="trends-area">
        <HomeIndustryTrendsList />
      </div>
    </div>
  </section>
</template>

<script setup>
import HomeDeviceCarousel from './HomeDeviceCarousel.vue';
import HomeIndustryTrendsList from './HomeIndustryTrendsList.vue';
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.section-padding {
  padding-top: @spacing-xl;
  padding-bottom: @spacing-xl;
  background-color: @background-color-base;
}

.featured-content-grid {
  display: grid;
  // CAROUSEL NARROWER: Try 1.2fr for carousel, 1.8fr for trends (approx 40% / 60%)
  // Or even more skewed if needed: 1fr for carousel, 2fr for trends (33% / 67%)
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1.7fr); // Start with this ratio (adjust!)
  gap: 24px; // Adjust gap as per design (e.g., 24px, 28px, 30px)
  align-items: flex-start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: @spacing-lg;
  }
}

.carousel-area,
.trends-area {
  min-width: 0;
}
</style>