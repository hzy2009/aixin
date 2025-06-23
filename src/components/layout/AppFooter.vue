<template>
  <footer class="app-footer-revised">
    <div class="footer-content-revised container">
      <p class="copyright-line">
        ©{{ new Date().getFullYear() }} 爱芯享信息共享平台 AipuMax Information Sharing Platform Co.LTD.版权所有ALL RIGHT RESERVED | 粤ICP备00000000号-0
      </p>
      <div class="footer-links-line">
        <a href="#" @click.prevent="scrollToContact" class="footer-link">联系我们</a>
        <span class="link-separator">|</span>
        <a href="#" @click.prevent="scrollToTop" class="footer-link">回到顶部</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const scrollToContact = () => {
  // TODO: Implement navigation or scroll to contact section if you have one
  // Example: document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
  console.log('Navigate to contact or scroll to contact section');
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less'; // Your global LESS variables

.app-footer-revised {
  background-color: @primary-color; // Solid red background from your primary color variable
  color: fade(@text-color-light, 80%); // White text, slightly transparent for softer look
  padding: @spacing-lg 0; // Vertical padding for the footer
  // margin-top: auto; // Use this in DefaultLayout.vue if content is short to push footer down
}

.footer-content-revised {
  // .container class handles max-width and centering
  text-align: center; // Center all content within the footer
}

.copyright-line {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0%;
  
  margin: 0 0 @spacing-xs 0; // Margin below copyright line
}

.footer-links-line {
  font-size: 13px; // Font size for "联系我们 | 回到顶部"
  line-height: 1.6;

  .footer-link {
    color: @text-color-light; // White links
    text-decoration: none;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.8; // Slightly transparent on hover
      text-decoration: underline;
    }
  }

  .link-separator {
    margin: 0 @spacing-sm; // Space around the separator
    color: fade(@text-color-light, 60%); // Separator color, more transparent
  }
}
</style>