<template>
  <div class="device-carousel-wrapper"> 
    <a-carousel autoplay arrows dots class="device-carousel">
      <template #prevArrow>
        <div class="custom-slick-arrow arrow-prev">
          <!-- <LeftOutlined /> -->
        </div>
      </template>
      <template #nextArrow>
        <div class="custom-slick-arrow arrow-next">
          <!-- <RightOutlined /> -->
        </div>
      </template>
      <div v-for="item in carouselItems" :key="item.id" class="carousel-slide">
        <img :src="item.image" :alt="item.alt" class="carousel-image" />
        <div class="carousel-caption-container">
          <span class="carousel-caption">{{ item.caption }}</span>
        </div>
      </div>
    </a-carousel>
  </div>
</template>

<script setup>
// ... (script from previous attempts)
import { ref } from 'vue';
import { Carousel as ACarousel } from 'ant-design-vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';

import carouselImg1 from '@/assets/images/home/carousel1.png';
import carouselImg2 from '@/assets/images/home/carousel1.png';

const carouselItems = ref([
  { id: 1, image: carouselImg1, caption: '半导体设备：工欲善其事，必先利其器', alt: 'Semiconductor Equipment 1' },
  { id: 2, image: carouselImg2, caption: '先进封装技术：赋能芯片新纪元', alt: 'Advanced Packaging' },
]);
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.device-carousel-wrapper {
  border-radius: @border-radius-base;
  overflow: hidden;
  height: 340px; // <<<<<<< YOUR DESIGN'S EXACT PIXEL HEIGHT HERE
  // box-shadow: 0 1px 2px rgba(0,0,0,0.04); // Very, very subtle shadow
}

.device-carousel {
  height: 100%;
}

.carousel-slide {
  position: relative;
  height: 100%;
  background-color: #333;

  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.carousel-caption-container {
  position: absolute;
  bottom: 28px; // Position caption container up to make space for dots
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 5;
}

.carousel-caption {
  display: inline-block;
  background-color: rgba(0, 0, 0, 0.55); // Adjust opacity
  color: @text-color-light;
  padding: 3px 10px; // Tighter padding
  border-radius: 3px; // Slightly less radius
  font-size: 15px;    // Design's caption font size
  font-weight: 400;   // Normal weight
}

// Arrow Customization - these should be fairly close to design
:deep(.slick-arrow.custom-slick-arrow) {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex !important; 
  align-items: center; 
  justify-content: center;
  z-index: @zindex-carousel-arrows;
  transition: background-color 0.2s ease;
  &:hover { background-color: rgba(0, 0, 0, 0.45); }
}
:deep(.arrow-prev) { left: 10px; }
:deep(.arrow-next) { right: 10px; }

// Dots Customization - these should be fairly close
:deep(.slick-dots) {
  bottom: 7px; // Dots close to the very bottom
  li {
    margin: 0 2px;
    button {
      background: rgba(255, 255, 255, 0.35);
      border-radius: 50%;
      height: 6px;
      width: 6px;
      opacity: 1;
      transition: all 0.2s ease;
    }
    &.slick-active button {
      background: @primary-color;
      width: 7px;
      height: 7px;
    }
  }
}
</style>