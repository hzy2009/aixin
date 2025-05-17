<template>
  <footer class="app-footer">
    <div class="footer-content container">
      <div class="footer-top">
          <div class="footer-column links-column">
              <h4>相关政府部门</h4>
              <ul>
                  <li><a href="#">中华人民共和国工业和信息化部</a></li>
                  <li><a href="#">中华人民共和国科学技术部</a></li>
                  <li><a href="#">中华人民共和国国家知识产权局</a></li>
                  <li><a href="#">国家软件与集成电路促进中心</a></li>
              </ul>
          </div>
          <div class="footer-column links-column">
              <h4>友情链接</h4>
              <ul>
                  <li><a href="#">中国半导体行业协会</a></li>
                  <li><a href="#">广东省半导体行业协会</a></li>
                  <li><a href="#">广州市半导体行业协会</a></li>
                  <li><a href="#">深圳市半导体行业协会</a></li>
              </ul>
          </div>
          <div class="footer-column links-column">
              <h4>业务</h4>
              <ul>
                  <li><a href="#">国产替代寻源</a></li>
                  <li><a href="#">原厂件寻源</a></li>
                  <li><a href="#">研发攻关</a></li>
                  <li><a href="#">检测验证</a></li>
                  <li><a href="#">线下沙龙</a></li>
              </ul>
          </div>
          <!-- Add more columns if needed, e.g., contact info -->
      </div>
      <div class="footer-bottom">
          <div class="footer-nav">
              <a href="#">首页</a>
              <a href="#">行业动态</a>
              <a href="#">需求广场</a>
              <a href="#">技术论坛</a>
          </div>
          <p class="copyright">
              ©{{ new Date().getFullYear() }} 爱芯享信息共享平台 AipuMax Information Sharing Platform Co.LTD. 版权所有 ALL RIGHT RESERVED | 粤ICP备00000000号-0
          </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No specific script needed for this basic footer
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.app-footer {
  background-color: @primary-color; // The red color from the image
  color: @text-color-light;
  padding: @spacing-xl 0 @spacing-md; // More padding at the top
  // margin-top: auto; // Pushes footer to bottom if content is short

  .footer-content {
    // .centered-content(); // Mixin already applied by .container
  }

  .footer-top {
    display: flex;
    justify-content: space-around; // Or space-between
    flex-wrap: wrap;
    gap: @spacing-lg;
    margin-bottom: @spacing-lg;
    padding-bottom: @spacing-lg;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .footer-column {
    h4 {
      font-size: 16px;
      margin-bottom: @spacing-sm;
      color: @text-color-light;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      li {
        margin-bottom: @spacing-xs;
        a {
          color: #e0e0e0; // Lighter than pure white for less emphasis
          font-size: 13px;
          &:hover {
            color: @text-color-light;
            text-decoration: underline;
          }
        }
      }
    }
  }

  .footer-bottom {
      text-align: center;
      font-size: 12px;
      color: #e0e0e0;

      .footer-nav {
          margin-bottom: @spacing-sm;
          a {
              color: #e0e0e0;
              margin: 0 @spacing-xs;
              &:hover {
                  color: @text-color-light;
              }
          }
      }
  }

  .copyright {
    margin-top: @spacing-sm;
    font-size: 12px;
    color: #e0e0e0; // Slightly lighter for less emphasis
  }
}
</style>