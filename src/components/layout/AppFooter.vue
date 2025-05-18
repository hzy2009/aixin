<template>
  <footer class="app-footer">
    <div class="footer-main">
      <div class="footer-main-content container">
        <div class="footer-column">
          <h4>相关政府部门</h4>
          <ul>
            <li><a href="#" target="_blank" rel="noopener noreferrer">中华人民共和国工业和信息化部</a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer">中华人民共和国科学技术部</a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer">中华人民共和国国家知识产权局</a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer">国家软件与集成电路促进中心</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>友情链接</h4>
          <ul>
            <li><a href="#" target="_blank" rel="noopener noreferrer">中国半导体行业协会</a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer">广东省半导体行业协会</a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer">广州市半导体行业协会</a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer">深圳市半导体行业协会</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>业务</h4>
          <ul>
            <li><router-link to="/services/domestic-sourcing">国产替代寻源</router-link></li>
            <li><router-link to="/services/original-parts">原厂件寻源</router-link></li>
            <li><router-link to="/services/rd-breakthrough">研发攻关</router-link></li>
            <li><router-link to="/services/testing-validation">检测验证</router-link></li>
            <li><router-link to="/services/offline-salon">线下沙龙</router-link></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom-bar">
      <div class="footer-bottom-content container">
        <p class="copyright">
          ©{{ new Date().getFullYear() }} 爱芯享信息共享平台 AipuMax Information Sharing Platform Co.LTD. 版权所有 ALL RIGHT RESERVED | 粤ICP备00000000号-0
        </p>
        <nav class="footer-bottom-nav">
          <router-link to="/">首页</router-link>
          <router-link to="/industry-dynamics">行业动态</router-link>
          <router-link to="/demand-square">需求广场</router-link>
          <router-link to="/tech-forum">技术论坛</router-link>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No specific script needed for this footer structure
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

// Define a specific darker red for the bottom bar if not using a variable
@footer-bottom-background: darken(@primary-color, 8%); // Adjust percentage to match design

.app-footer {
  color: @text-color-light; // Default text color for footer
}

.footer-main {
  background-color: @primary-color; // Main primary red background
  padding: @spacing-xl 0 @spacing-lg 0; // Top/bottom padding for the links section

  .footer-main-content {
    // .container class is applied for max-width and centering
    display: flex;
    justify-content: space-between; // Distribute columns
    gap: @spacing-xl; // Gap between columns
    flex-wrap: wrap; // Allow columns to wrap on smaller screens
  }

  .footer-column {
    flex: 1; // Try to make columns take equal width
    min-width: 220px; // Minimum width before wrapping for a column

    h4 {
      font-size: 16px;
      font-weight: 600; // Bolder headings
      color: @text-color-light;
      margin-bottom: @spacing-md;
      padding-bottom: @spacing-xs; // Small space before potential underline
      // border-bottom: 1px solid rgba(255,255,255,0.3); // Optional: underline for heading
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: @spacing-sm;

        a {
          font-size: 14px;
          color: #e6e6e6; // Slightly off-white for links for better readability on red
          text-decoration: none;
          transition: color 0.3s ease;

          &:hover {
            color: @text-color-light; // Brighter white on hover
            text-decoration: underline;
          }
        }
      }
    }
  }
}

.footer-bottom-bar {
  background-color: @footer-bottom-background; // Darker red for this strip
  padding: @spacing-md 0;
  border-top: 1px solid rgba(255, 255, 255, 0.15); // Subtle separator line from top section

  .footer-bottom-content {
    // .container class is applied
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap; // Allow content to wrap on small screens
    gap: @spacing-md;
  }

  .copyright {
    font-size: 12px;
    color: #c0c0c0; // Lighter gray for copyright text on darker red
    margin: 0;
    line-height: 1.5;
    flex-grow: 1; // Allow copyright to take available space on the left
  }

  .footer-bottom-nav {
    display: flex;
    gap: @spacing-lg; // Space between bottom nav links

    a {
      font-size: 13px;
      color: #d0d0d0; // Slightly brighter than copyright
      text-decoration: none;
      transition: color 0.3s ease;

      &:hover {
        color: @text-color-light; // Brighter white on hover
        text-decoration: underline;
      }
    }
  }
}

// Responsive adjustments for footer columns if needed
@media (max-width: 767px) {
  .footer-main .footer-main-content {
    flex-direction: column; // Stack columns
    align-items: flex-start; // Align columns to the start
  }
  .footer-bottom-bar .footer-bottom-content {
    flex-direction: column;
    align-items: center; // Center copyright and nav on small screens
    text-align: center;
    .footer-bottom-nav {
        margin-top: @spacing-sm;
    }
  }
}
</style>