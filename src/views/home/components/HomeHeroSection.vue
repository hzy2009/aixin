<template>
  <section class="home-hero-section-banner" :style="{ height: height + 'px' }">
    <div class="hero-banner-content container"> 
      <div class="text-overlay-block">
        <p class="hero-title" >
          打通产业链上下游，为会员提供寻源、攻关、贸易、
          验证、行研、人才等一站式解决方案
        </p>
        <div class="hero-divider" ></div>
        <p class="hero-description" >
          打破信息孤岛，构建共享生态，汇聚全球洞察，赋能行业决策，让每一次交流，都成为价值的传递。
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  height: {
    type: [Number, String],
    default: 160
  }
})
// No specific script logic needed for this static hero section
// Data would typically be static or come from a CMS/props if dynamic
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less'; // Your global LESS variables

.home-hero-section-banner {
  width: 100%;
  height: 420px; // Adjust height to match your design or image aspect ratio
  background-image: url('@/assets/images/home/banner-big.jpg'); // <<--- YOUR ACTUAL BANNER IMAGE PATH HERE
  background-size: cover; // Cover the entire area
  background-position: center center; // Center the image
  background-repeat: no-repeat;
  position: relative; // For positioning the text overlay content
  display: flex; // To help center the .container if needed, or align items
  align-items: center; // Vertically center content within the banner height

  // Optional: Add a very subtle dark overlay on the image if text contrast is an issue
  // &::before {
  //   content: '';
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   background-color: rgba(0, 0, 0, 0.15); // Adjust opacity as needed
  //   z-index: 1;
  // }
}

.hero-banner-content { // This is the .container
  position: relative; // To be above the optional ::before overlay
  z-index: 2;
  display: flex;
  // justifyContent: flex-start; // Default, aligns .text-overlay-block to the left
  // The .container class already handles max-width and margin: auto for centering the block.
}

.text-overlay-block {
  color: @text-color-light; // White text
  text-align: left; // Text is left-aligned
  max-width: 610px; // Max width for the text block itself, adjust as needed
                    // This prevents text from spanning too wide on large screens within the container

  // Optional: Add a subtle text shadow for better readability on complex backgrounds
  // text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);

  .hero-title {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 24px;
    line-height: 28px;
    letter-spacing: 0%;
    margin: 0;
    // text-transform: uppercase; // If needed
  }
  .hero-divider{
    width: 88px;
    height: 1px;
    top: 289px;
    left: 360px;
    background-color: #fff;
    margin: 11px 0;
  }
  .hero-subtitle {
    font-size: 36px; // Same size as title, as per image
    font-weight: 500; // Same weight
    line-height: 1.3;
    margin-bottom: @spacing-lg; // More space below subtitle
    opacity: 0.9; // Slightly less prominent than title if desired
  }

  .hero-description {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0%;
    text-align: justify;
    // If you use <br> tags for line breaks, they will be respected.
    // white-space: pre-line; // Use this if you want to respect newline characters (\n) in the string itself
  }
}

// Responsive adjustments if needed
@media (max-width: 768px) {
  .home-hero-section-banner {
    height: 350px; // Shorter banner on mobile
    align-items: center; // Keep content centered
    text-align: center; // Center text on mobile for better readability
  }
  .hero-banner-content {
    justify-content: center; // Center text block on mobile
  }
  .text-overlay-block {
    padding: @spacing-lg; // Add some padding on mobile
    max-width: 90%; // Allow text block to be wider relative to screen
    text-align: center; // Center text within its block
    background-color: rgba(0,0,0,0.3); // Add a slight background for mobile text contrast
    border-radius: @border-radius-base;

    .hero-title, .hero-subtitle {
      font-size: 28px; // Slightly smaller titles on mobile
    }
    .hero-description {
      font-size: 14px;
    }
  }
}
</style>