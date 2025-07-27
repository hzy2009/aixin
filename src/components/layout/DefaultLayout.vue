<template>
  <div class="default-layout">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />
     <FixedActionButtons
      contact-phone-number="4000118892"
    />
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue';
import AppFooter from './AppFooter.vue';
import FixedActionButtons from '@/components/common/FixedActionButtons.vue'; // Adjust path
</script>

<style scoped lang="less">
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; // Ensure layout takes full viewport height
}

.main-content {
  background-color: #FAFAFA;
  flex-grow: 1; // Allows main content to expand and push footer down
  // Optional: add some default padding if all pages need it
  // padding-top: @spacing-lg;
  // padding-bottom: @spacing-lg;
}
</style>