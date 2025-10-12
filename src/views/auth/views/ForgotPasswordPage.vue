<template>
  <div class="forgot-password-page">
    <div class="form-container">
      <div class="form-header">
        <img src="@/assets/images/logo.png" alt="LOGO" class="logo-image" />
        <span class="site-name">爱芯享信息服务平台</span>
      </div>
      <h2 class="form-title">找回密码</h2>
      <p class="instructions">
        请输入您要找回的账号，境外用户请输入手机号
      </p>
      <a-form
        :model="formState"
        @finish="onFinish"
      >
        <a-form-item
          name="account"
          :rules="[{ required: true, message: '请输入账号或手机号!' }]"
        >
          <a-input v-model:value="formState.account" placeholder="请输入账号或手机号" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" class="submit-button" :loading="loading">
            下一步
          </a-button>
        </a-form-item>
        <div class="footer-note">
          如需帮助，请点此<a @click="contactSupport">联系人工客服</a>
        </div>
      </a-form>
       <div class="back-to-login">
        <router-link to="/login">< 返回登录</router-link>
      </div>
    </div>
     <footer class="page-footer">
      <p>爱芯享信息服务平台</p>
      <p>©{{ new Date().getFullYear() }} AipuMax Information Sharing Platform Co.LTD. 版权所有 ALL RIGHT RESERVED | 粤ICP备00000000号-0</p>
    </footer>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Form as AForm, FormItem as AFormItem, Input as AInput, Button as AButton, message } from 'ant-design-vue';

const router = useRouter();
const loading = ref(false);
const formState = reactive({
  account: '',
});

const onFinish = async values => {
  loading.value = true;
  console.log('Attempting to find account:', values.account);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  loading.value = false;
  message.info('下一步功能暂未实现。');
  // router.push('/reset-password'); // Or verification step
};

const contactSupport = () => {
  message.info('联系人工客服功能暂未实现。');
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

// Re-use similar styling to LoginPage
.forgot-password-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: @primary-color;
  padding: @spacing-lg;
  position: relative;

  &::before, &::after {
    content: '';
    position: absolute;
    background-repeat: no-repeat;
    opacity: 0.25;
    pointer-events: none;
    z-index: 0;
  }

  &::before {
    background-image: url('@/assets/images/auth/circuit-bg-left.png');
    background-position: top left;
    top: 0; left: 0; width: 50%; height: 50%;
    background-size: contain;
  }

  &::after {
    background-image: url('@/assets/images/auth/circuit-bg-right.png');
    background-position: bottom right;
    bottom: 0; right: 0; width: 50%; height: 50%;
    background-size: contain;
  }
}

.form-container {
  background-color: @background-color-base;
  padding: @spacing-xl @spacing-xxl;
  border-radius: @border-radius-base;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 420px;
  text-align: center;
  z-index: 1;
  position: relative;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: @spacing-md;

  .logo-image { height: 32px; margin-right: @spacing-sm; }
  .site-name { font-size: 20px; font-weight: 600; color: @text-color-base; }
}

.form-title {
  font-size: 24px;
  font-weight: 500;
  color: @text-color-base;
  margin-bottom: @spacing-sm;
}
.instructions {
    font-size: 14px;
    color: @text-color-secondary;
    margin-bottom: @spacing-lg;
}

.ant-form-item { margin-bottom: @spacing-md; }
.ant-input { height: 40px; font-size: 14px; }

.submit-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
}
.footer-note {
    margin-top: @spacing-md;
    font-size: 13px;
    color: @text-color-secondary;
    a {
        color: @primary-color;
        cursor: pointer;
        &:hover { text-decoration: underline; }
    }
}
.back-to-login {
    margin-top: @spacing-xl;
    a {
        color: @text-color-secondary;
        font-size: 14px;
        &:hover { color: @primary-color; }
    }
}

.page-footer {
  position: absolute;
  bottom: @spacing-lg;
  left: 0; right: 0;
  text-align: center;
  color: fade(@text-color-light, 60%);
  font-size: 14px;
  z-index: 1;
  p { margin: 3px 0; }
}
</style>