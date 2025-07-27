<template>
  <div class="membership-guide-page-wrapper">
    <div class="container content-container">
      <div class="page-title-section">
        <h1 class="page-title">入会指南</h1>
      </div>

      <div class="guide-content">
        <div class="intro-text">申请加入爱芯享集成电路信息共享平台，请联系：</div>
        <!-- <div class="intro-text">陈靖玮</div> -->
        <div class="intro-text">座机： 4000118892</div>
        <div class="intro-text">手机： 15317664387</div>
        <div class="intro-text">E-MAIL： info-service@icshare.com</div>
        <div class="intro-text">注：新会员提交注册申请后，运营专员会在30分钟内与您联系。</div>

        <!-- <div class="contact-details">
          <p><span class="contact-label">陈靖玮</span></p> 
          <p><span class="contact-label">座机：</span>4000118892</p>
          <p><span class="contact-label">手机：</span>15317664387</p>
          <p><span class="contact-label">E-MAIL：</span>info-service@icshare.com</p>
        </div> -->
<!-- 
        <p class="note-text">
          注：新会员提交注册申请后，运营专员会在30分钟内与您联系。
        </p> -->
      </div>
    </div>
  </div>
</template>

<script setup>
// No complex script logic needed for this static page
// If contact info were dynamic, you'd fetch it here (e.g., from a store or API call in onMounted)
import { onMounted } from 'vue';

onMounted(() => {
  // If you need to fetch contact info:
  // fetchContactInformation();
});

// const contactInfo = ref({
//   name: '陈靖玮',
//   landline: '4000118892',
//   mobile: '15317664387',
//   email: 'info-service@icshare.com'
// });
// async function fetchContactInformation() { /* ... API call ... */ }
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less'; // Your global LESS variables

.membership-guide-page-wrapper {
  background-color: @background-color-base; // Assuming a white page background
  padding: 20px 26px; // Generous top and bottom padding for the page
  min-height: 580px; // Attempt to fill space
}

.content-container {
  // The .container class from global styles will handle max-width and centering.
  // Add specific padding if needed for this page's content block
  // background-color: white; // If page wrapper is gray, content block is white
  // padding: @spacing-xl;
  // border-radius: @border-radius-base;
  // box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.page-title-section {
  margin-bottom: 20px; // ~32px space below title section
  padding-bottom: @spacing-sm; // Space for the red underline
  border-bottom: 1px solid @border-color-light; // Full-width light gray line
  position: relative; // For the red accent line

  .page-title {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 24px;
    letter-spacing: 0%;

    color: #656C74;
    margin: 0;
    display: inline-block; // For the accent to fit text width
    position: relative; // For the ::after pseudo-element

    &::after { // Red accent underline for "入会指南"
      content: '';
      position: absolute;
      left: 0;
      bottom: -@spacing-sm - 1px; // Position it aligned with the border-bottom
      width: 100%; // Underlines the entire text width
      height: 2px;
      background-color: @primary-color; // Your red
    }
  }
}

.guide-content {
  padding: 0 26px;
  font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 10px;
    letter-spacing: 0%;
    text-align: justify;

  color: #656C74; // Main text color (dark gray)
}

.intro-text {
  margin-bottom: @spacing-md;
  color: #595959; // Slightly lighter gray for intro
}

.contact-details {
  margin-bottom: @spacing-lg;
  p {
    margin-bottom: 8px; // Space between contact lines
    color: #595959; // Text color for contact details
    &:last-child {
      margin-bottom: 0;
    }
  }
  .contact-label {
    // No specific styling for label if it's just part of the text,
    // but if "陈靖玮" is meant to be styled differently (e.g., bolder):
    // font-weight: 500;
    // color: @text-color-base;
  }
}

.note-text {
  font-size: 14px;
  color: @text-color-secondary; // Standard secondary text color for the note
}
</style>