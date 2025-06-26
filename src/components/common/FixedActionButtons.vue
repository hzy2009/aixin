<template>
  <div class="fixed-action-buttons-container">
    <div
      class="action-button-wrapper contact-button-wrapper"
      @mouseenter="isPhoneContactHovered = true"
      @mouseleave="isPhoneContactHovered = false"
      @click="handleContactClick"
      role="button"
      tabindex="0"
    >
      <div class="contact-button-inner" :class="{ 'expanded': isPhoneContactHovered }">
        <img src="@/assets/images/phone.png" alt="联系电话" class="action-image phone-image" />
        <div class="text-part">
          <span class="phone-number">{{ contactPhoneNumber }}</span>
        </div>
      </div>
    </div>


    <div class="action-button-wrapper back-to-top-wrapper" @click="scrollToTop">
      <div class="back-to-top-button-inner">
        <img src="@/assets/images/toTop.png" alt="回到顶部" class="action-image to-top-image" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// Icons are no longer used from ant-design-vue

const props = defineProps({
  contactPhoneNumber: {
    type: String,
    default: '021-55698507'
  },
  // verticalOffsetFromBottom prop removed
});

const isPhoneContactHovered = ref(false);

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

const handleContactClick = () => {
  console.log('Contact button clicked. Phone:', props.contactPhoneNumber);
  // window.location.href = `tel:${props.contactPhoneNumber.replace(/-/g, '')}`;
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

// --- Dimensions ---
@button-square-size: 60px; // Both width and height for the square part
@image-visual-size: 30px;

@phone-text-internal-padding: 15px; // Horizontal padding WITHIN the text part
// Estimate visual width of the phone number text itself (excluding its padding)
@phone-number-text-content-width: 120px;

.contact-button-wrapper{
    margin-bottom: 10px;
}
.fixed-action-buttons-container {
  position: fixed;
  right: 0px; // Adjust distance from right edge as needed
  top: 50%;    // Position top edge at 50% of viewport height
  transform: translateY(-50%); // Shift up by half its own height for true vertical center
  z-index: @zindex-header + 100;
  display: flex;
  flex-direction: column;
  align-items: flex-end; // If buttons have varying final widths
  gap: 1px; // Minimal separation, or 0 if they should touch
}

.action-button-wrapper {
  cursor: pointer;
  // background is on the inner element
  &:hover {
    .contact-button-inner, .back-to-top-button-inner {
       background-color: darken(@primary-color, 7%);
    }
  }
}

.contact-button-inner,
.back-to-top-button-inner {
  height: @button-square-size;
  background-color: @primary-color;
  display: flex;
  align-items: center; // Vertically center content
  transition: background-color 0.2s ease-in-out;
}

.contact-button-inner {
  width: @button-square-size; // Initial width for the icon square
  justify-content: center;    // Horizontally center the icon initially
  overflow: hidden;           // Clip the text part
  position: relative;         // For positioning text part if needed
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              padding-left 0.35s cubic-bezier(0.4, 0, 0.2, 1), // Animate padding for smooth icon shift
              padding-right 0.35s cubic-bezier(0.4, 0, 0.2, 1); // Animate padding

  .phone-image { // The icon itself
    flex-shrink: 0; // Prevent image from shrinking
    // No specific transition needed for image itself, parent handles width
  }

  .text-part {
    display: flex;
    align-items: center;
    white-space: nowrap;
    // It's not actually padded itself, the parent's padding changes
    // padding: 0 @phone-text-internal-padding;
    opacity: 0;
    max-width: 0; // Start with no width contribution for the text content
    overflow: hidden;
    // Transition for opacity and revealing width
    transition: opacity 0.25s ease-in-out 0.1s,
                max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.05s,
                margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1); // Animate margin for spacing
    margin-left: 0; // No margin initially when hidden

    .phone-number {
      font-family: PingFang SC;
        font-weight: 400;
        font-size: 18px;
        line-height: 14px;
        letter-spacing: 0%;

      color: #fff;
    }
  }

  &.expanded {
    // Expanded width: Initial square size (for icon) + text part total width
    width: 200px;
    justify-content: flex-start; // Align icon and text to the start
    // Add padding to the main button when expanded to create space around icon and text
    padding-left: @phone-text-internal-padding; // Overall left padding for the expanded button
    padding-right: @phone-text-internal-padding; // Overall right padding

    .phone-image {
      // No change needed if it's always centered in its initial space
    }

    .text-part {
      opacity: 1;
      max-width: @phone-number-text-content-width; // Allow text to take its content width
      margin-left: 10px; // Space between icon and text when expanded
    }
  }
}

.back-to-top-button-inner {
  width: @button-square-size;
  justify-content: center; // Center the image
}

.action-image {
  width: @image-visual-size;
  height: @image-visual-size;
  display: block;
}
</style>