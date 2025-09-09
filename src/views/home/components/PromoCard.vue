<template>
  <section class="common-parts-purchase-section section-padding">
    <div class="container">
      <SectionHeader title-ch="通用件集采" title-en="STANDARD PARTS BULK PURCHASING" /> 
      <div class="purchase-blocks-container">
        <!-- Left Block -->
        <div class="purchase-block special-hover-effect">
          <img src="@/assets/images/home/PromoCard1.jpg" alt="FA工厂自动化零件一站式采购平台" class="block-background-image"/>
          <!-- <div class="block-content">
            <a-button type="primary" class="purchase-button" @click="handlePurchaseClick('aian')">
              点击采购，享受爱芯享会员折扣
            </a-button>
          </div> -->
           <div class="block-hover-overlay" @click="handlePurchaseClick('aian')">
            <span class="hover-action-text">点击采购，享受爱芯享会员折扣</span>
          </div>
        </div>

        <!-- Right Block -->
        <div class="purchase-block special-hover-effect">
          <img src="@/assets/images/home/PromoCard2.jpg" alt="打造多元化资产管理服务生态" class="block-background-image"/>
          <!-- <div class="block-content">
            <a-button type="primary" class="purchase-button" @click="handlePurchaseClick('jd')">
              点击采购，享受爱芯享会员折扣
            </a-button>
          </div> -->
          <div class="block-hover-overlay" @click="handlePurchaseClick('jd')">
            <span class="hover-action-text">点击采购，享受爱芯享会员折扣</span>
          </div>
        </div>
         <div class="purchase-block special-hover-effect">
          <img src="@/assets/images/home/PromoCard3.jpg" alt="为客户提供质量可靠优质的一站式采购服务" class="block-background-image"/>
          <!-- <div class="block-content">
            <a-button type="primary" class="purchase-button" @click="handlePurchaseClick('jd')">
              点击采购，享受爱芯享会员折扣
            </a-button>
          </div> -->
          <div class="block-hover-overlay" @click="handlePurchaseClick('guoptics')">
            <span class="hover-action-text">点击采购，享受爱芯享会员折扣</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Button as AButton, message } from 'ant-design-vue';
import defHttp from '@/utils/http/axios'; // Your Axios instance
import SectionHeader from '@/components/common/SectionHeader.vue'; // Assuming you use this
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore'; 
const modalStore = useModalStore();
const authStore = useAuthStore();
// TODO: Replace with actual image paths for partner logos if they are separate images
// import aianLogo from '@/assets/images/home/aian_logo.png';
// import jdIndustrialLogo from '@/assets/images/home/jd_industrial_logo.png';


const handlePurchaseClick = (partnerKey) => {
  if (authStore.isLogin) {
    if (!['apm-vip', 'apm-vip-inspection', 'apm-register', 'apm-super-vip', 'apm-super-vip-free'].includes(authStore.role)) {
      return message.error('您没有权限进行此操作');
    }
    let url = ''
    const urlMap = {
      'aian': '/apm/jicai/redirectToAtEdiJson',
      'jd': '/apm/jicai/redirectToJdJson',
      'guoptics': '/apm/jicai/redirectToLianHeGuangKeiJson'
    }
    url = urlMap[partnerKey]
    defHttp.get({ url }).then((res) => {
      if(res.success){
        window.open(res.result, '_blank');
      } else {
        message.error(res.message);
      }
    });
  } else {
    modalStore.showLogin();
  }
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.section-padding { // Re-use if you have this globally
 padding: 10px 0;
}

.common-parts-purchase-section {
  background-color: #FAFAFA; // Or your desired section background
}

.purchase-blocks-container {
  display: flex;
  gap: 22px; // Gap between the two blocks
  justify-content: space-between; // Ensure they spread if container is wider

  @media (max-width: 992px) { // Stack on smaller screens
    flex-direction: column;
  }
}

.purchase-block {
  flex: 1; // Each block takes equal space
  min-width: 0; // For flex responsiveness
  position: relative; // For absolute positioning of content and button
  border-radius: @border-radius-base; // Slight rounding for the block
  overflow: hidden; // Keep content within rounded corners and hide overflowing image parts
  // aspect-ratio: 16 / 7; // Optional: Enforce an aspect ratio for the blocks
  height: 120px; // Or a fixed height, adjust to match image

  .block-background-image {
    width: 100%;
    height: 100%;
    object-fit: cover; // Ensure image covers the block
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    transition: transform 0.4s ease-out;
  }

  .block-content {
    position: absolute;
    bottom: 15px;
    right: 10px;
    z-index: 2; // Content above the background image
    // This creates a subtle overlay so text is more readable on various backgrounds
    // background: linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.0) 50%);
  }

  .purchase-button {
    background-color: @background-color-base; // White button background
    color: @primary-color; // Red text
    border: 1px solid #EAEAEA; // Red border
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    padding: 7px 10px; // Button padding
    height: auto; // Let padding define height
    // position: absolute; // Position button if not using flex end
    // bottom: @spacing-xl;
    // left: @spacing-xl;
    align-self: flex-start; // Keep button aligned left with text
    z-index: 3; // Button above content overlay if any

    &:hover {
      border-color: @primary-color;
      color: @primary-color;
    }
  }

  // Hover effect for the block
  &:hover {
    .block-background-image {
      // transform: scale(1.05); // Slight zoom on background image
    }
  }
 
}
.hover-action-text{
      color: #fff;

}
.special-hover-effect:hover {
    .block-background-image {
      // transform: scale(1.05); // Still zoom background
    }
    .block-hover-overlay {
      opacity: 1;
      pointer-events: auto; // Make overlay interactive on hover
    }
    .hover-action-text {
      opacity: 1;
      transform: translateY(0);
    }
    .original-button.small-initial-button { // Hide the initial small button
        opacity: 0;
        transform: scale(0.9); // Optional: shrink it out
        pointer-events: none;
    }
}
.block-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45); // Semi-transparent dark overlay from image
  z-index: 3; // Overlay on top of .block-content
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  opacity: 0; // Hidden by default
  pointer-events: none; // Not interactive by default
  transition: opacity 0.3s ease-in-out;
  cursor: pointer; // Overlay itself is clickable
}
</style>