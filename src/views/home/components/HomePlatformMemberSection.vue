<template>
  <section class="home-platform-member-section section-padding">
    <div class="container">
      <SectionHeader title-ch="会员名录" title-en="MEMBERSHIP" more-link="/members" />
      <div class="member-logos-grid">
        <div v-for="member in members" :key="member.id" class="member-logo-item">
          <img :src="member.logo" :alt="member.name" />
          <span class="member-name">{{ member.name }}</span>
        </div>
        <!-- Add more static or dynamic logos -->
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import SectionHeader from '@/components/common/SectionHeader.vue';
import dosiliconLogo from '@/assets/images/home/dosilicon-logo.png'; // Example logo

const members = ref([
  { id: 1, name: '东芯半导体', logo: dosiliconLogo },
  { id: 2, name: '东芯半导体', logo: dosiliconLogo }, // Repeat for layout
  { id: 3, name: '东芯半导体', logo: dosiliconLogo },
  { id: 4, name: '东芯半导体', logo: dosiliconLogo },
]);
</script>

// ... (template and script are fine) ...
<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.section-padding {
  padding: 20px 0;
  background-color:#FAFAFA; // White background
}

.member-logos-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); // 4 logos per row
  gap: @spacing-lg;
  align-items: center;

   @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
   @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.member-logo-item {
  // background-color: @background-color-light-gray; // Lighter background for item itself
  border: 1px solid @border-color-light;
  padding: @spacing-lg @spacing-md;
  border-radius: @border-radius-base;
  text-align: center;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    img {
      filter: grayscale(0%);
      opacity: 1;
    }
  }

  img {
    max-height: 50px; // Adjusted height
    width: auto; // Maintain aspect ratio
    max-width: 150px; // Max width for logo
    margin-bottom: @spacing-sm;
    filter: grayscale(100%);
    opacity: 0.6; // Slightly more visible grayscale
    transition: filter 0.3s ease, opacity 0.3s ease;
  }

  .member-name { // Hidden in the design, but kept for accessibility/data
    display: none; // As per design, name is not shown below logo
    // display: block;
    // font-size: 14px;
    // color: @text-color-secondary;
    // margin-top: @spacing-xs;
  }
}
</style>