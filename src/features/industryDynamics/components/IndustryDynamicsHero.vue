<template>
  <section class="industry-dynamics-hero">
    <!-- The design shows a static image, if it's dynamic, adjust accordingly -->
  </section>
</template>

<script setup>
// No script needed for a static image banner
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.industry-dynamics-hero {
  height: 300px; // Adjust height as needed based on your image/design
  background-image: url('@/assets/images/industryDynamics/hero-bg.jpg'); // Replace with your actual hero image for this page
  background-size: cover;
  background-position: center;
  // No text overlay as per the provided full-page image for industry dynamics
}
</style>