<template>
  <section class="home-hero-section" :style="{ height: height + 'px' }">
    <div class="home-hero-section__background-image container"></div> <!-- New div for bg image -->
    <!-- <div class="home-hero-section__content container">
      <h1>致力于为半导体行业提供专业的信息服务</h1>
      <h2>连接产业链上下游，促进产业协同发展</h2>
      <p>
        汇聚国产替代资源，精准对接原厂直供，赋能研发设计协同创新，汇集权威产业数据，打通芯片设计、制造、封装、测试环节，助力企业快速匹配优质国产供应商，降低供应链风险；优化创新协作生态，共享技术方案与攻关经验，加速核心器件自主化进程；数据驱动价值创造，赋能行业生态共创未来，携手突破“卡脖子”难题，共襄中国芯竞争力！
      </p>
    </div> -->
  </section>
</template>

<script setup>
 defineProps({
   height: {
     type: Number,
     default: 502
   }
 })
// No specific script logic for this static section yet
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.home-hero-section {
  background-image: url('@/assets/images/home/banner.png'); // Moved to child div
  // background-size: cover;
  // background-position: center;
  color: @text-color-light;
  text-align: center;
  position: relative; // Needed for absolute positioning of bg and z-index context
  // min-height: 500px; // Ensure it has some height even before image loads
  // padding-top: 80px; // Space for content from top
  // padding-bottom: 130px; // << INCREASED PADDING BOTTOM to make space for the overlapping stats. Adjust as needed.

  // &__background-image {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  //   background-image: url('@/assets/images/home/hero-bg.jpg'); // YOUR HERO BACKGROUND IMAGE
  //   background-size: cover;
  //   background-position: center bottom; // Adjust position, bottom might be good if it cuts off
  //   z-index: 1; // Behind content
  //    &::after { // Optional: Dark overlay for better text readability
  //       content: '';
  //       position: absolute;
  //       top: 0;
  //       left: 0;
  //       right: 0;
  //       bottom: 0;
  //       background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%); // Example gradient
  //       // background-color: rgba(0, 0, 0, 0.5); // Simpler overlay
  //   }
  // }

  &__content {
    position: relative;
    z-index: 2; // Above background
    padding-left: @content-padding-horizontal;
    padding-right: @content-padding-horizontal;

    h1 {
      font-size: 38px;
      margin-bottom: @spacing-sm;
      font-weight: 600;
      text-shadow: 0px 2px 4px rgba(0,0,0,0.5);
    }
    h2 {
      font-size: 30px;
      margin-bottom: @spacing-md;
      font-weight: 500;
      color: #f0f0f0;
      text-shadow: 0px 1px 3px rgba(0,0,0,0.5);
    }
    p {
      font-size: 15px;
      line-height: 1.8;
      max-width: 850px;
      margin: 0 auto @spacing-lg;
      color: #e0e0e0;
    }
  }
}
</style>