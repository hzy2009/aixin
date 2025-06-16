<template>
  <div class="login-page-wrapper">
    <!-- Main Content with Form -->
    <main class="login-main-content">
      <!-- Logo and Site Name - Positioned relative to the form box -->
      <div class="branding-header">
        <img src="@/assets/images/logo.png" alt="LOGO" class="logo-image" />
        <span class="site-name">爱芯享信息共享平台</span>
      </div>

      <div class="login-form-box">
        <!-- Login Form View -->
        <div v-show="currentView === 'login'" class="form-view-pane">
          <h2 class="form-greeting-title">欢迎登录</h2>
          <div class="form-section-title-container">
            <h3 class="form-section-title">用户</h3>
          </div>

          <a-form :model="loginFormState" name="login" class="auth-form" @finish="onLoginFinish"
            @finishFailed="onFormFinishFailed" layout="vertical">
            <a-form-item name="username" :rules="[{ required: true, message: '请输入您的邮箱或账号!' }]">
              <a-input v-model:value="loginFormState.username" placeholder="请输入邮箱或账号">
                <template #prefix>
                  <UserOutlined class="site-form-item-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item name="password" :rules="[{ required: true, message: '请输入您的密码!' }]">
              <a-input-password v-model:value="loginFormState.password" placeholder="请输入密码">
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item name="captcha">
              <a-input v-model:value="loginFormState.captcha" placeholder="请输入验证码">
                <template #prefix>
                  <UserOutlined class="site-form-item-icon" />
                </template>

              </a-input>
              <div class="captcha-code">
                <img v-if="randCodeData.requestCodeSuccess" style="margin-top: 2px; max-width: initial"
                  :src="randCodeData.randCodeImage" @click="handleChangeCheckCode" />
                <img v-else style="margin-top: 2px; max-width: initial" src="@/assets/images/checkcode.png"
                  @click="handleChangeCheckCode" />
              </div>
            </a-form-item>

            <a-form-item class="form-options">
              <a-checkbox v-model:checked="loginFormState.remember">自动登录</a-checkbox>
              <a @click="switchToForgotPassword" class="interactive-link">忘记密码?</a>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" class="submit-button" :loading="loginLoading">
                立即登录
              </a-button>
            </a-form-item>

            <a-form-item>
              <a-button class="secondary-action-button" @click="navigateToRegister">
                会员入会申请
              </a-button>
            </a-form-item>
          </a-form>
        </div>

        <!-- Forgot Password Form View -->
        <div v-show="currentView === 'forgotPassword'" class="form-view-pane">
          <h2 class="form-greeting-title">找回密码</h2>
          <div class="form-section-title-container">
            <h3 class="form-section-title">请联系管理员</h3>
          </div>
          <div style="margin-top: 40px;">
            <p class="form-instructions">
              管理员
            </p>
            <p class="form-instructions-value">
              张三
            </p>
            <p class="form-instructions">
              联系电话
            </p>
            <p class="form-instructions-value">
              180 000 0000
            </p>
          </div>
          <a-button html-type="submit" @click="switchToLogin" class="back-button">
            返回
          </a-button>
          <!-- <p class="form-instructions">
            请输入您要找回的账号，境外用户请输入手机号
          </p> -->

          <!-- <a-form :model="forgotPasswordFormState" name="forgotPassword" class="auth-form"
            @finish="onForgotPasswordFinish" @finishFailed="onFormFinishFailed" layout="vertical">
            <a-form-item name="account" :rules="[{ required: true, message: '请输入账号或手机号!' }]">
              <a-input v-model:value="forgotPasswordFormState.account" placeholder="请输入账号或手机号">
                <template #prefix>
                  <MailOutlined class="site-form-item-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" class="submit-button" :loading="forgotPasswordLoading">
                下一步
              </a-button>
            </a-form-item>
            <div class="form-footer-note">
              如需帮助，请点此<a @click="contactSupport" class="interactive-link">联系人工客服</a>
            </div>
          </a-form>
          <div class="back-to-login-container">
            <a @click="switchToLogin" class="interactive-link">
              < 返回登录</a>
          </div> -->
        </div>
      </div>
    </main>
    <!-- Footer has been removed -->
  </div>
</template>

<script setup>
// Script remains the same as the previous version
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import {
  Form as AForm,
  FormItem as AFormItem,
  Input as AInput,
  InputPassword as AInputPassword,
  Button as AButton,
  Checkbox as ACheckbox,
  message
} from 'ant-design-vue';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue';
import { getCodeInfo } from '@/api/user.js';

const router = useRouter();
const authStore = useAuthStore();
const currentView = ref('login');
const loginLoading = ref(false);
const loginFormState = reactive({ username: '', password: '', remember: true });
const forgotPasswordLoading = ref(false);
const forgotPasswordFormState = reactive({ account: '' });

const switchToForgotPassword = () => { currentView.value = 'forgotPassword'; };
const switchToLogin = () => { currentView.value = 'login'; };
const randCodeData = reactive({
  requestCodeSuccess: false,
  randCodeImage: ''
});
const getCaptchaCode = async () => {
  try {
    randCodeData.checkKey = new Date().getTime() + Math.random().toString(36).slice(-4); // 1629428467008;
    getCodeInfo(randCodeData.checkKey).then((res) => {
      randCodeData.randCodeImage = res.result;
      randCodeData.requestCodeSuccess = true;
    });
  } catch (error) {
    message.error('验证码获取失败，请重试。');
  }
};
const onLoginFinish = async values => {
  loginLoading.value = true;
  try {
    let data = {
      username: values.username,
      password: values.password,
      checkKey: randCodeData.checkKey,
      captcha: values.captcha
    };
    // 登录
    let res = await authStore.login(data);
    // 获取用户角色
    await authStore.getUserRole(res?.result?.userInfo?.id);
    message.success('登录成功!');
    // const redirectPath = router.currentRoute.value.query.redirect || '/';
    router.push('/user/published/DomesticSourcing');
  } catch (error) {
    message.error(error?.response?.data?.message || error?.message || '登录失败!');
  } finally {
    loginLoading.value = false;
  }
};
const onForgotPasswordFinish = async values => {
  forgotPasswordLoading.value = true;
  console.log('Attempting to find account:', values.account);
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    message.success('验证邮件已发送（模拟）。');
  } catch (error) {
    message.error('操作失败，请重试。');
  } finally {
    forgotPasswordLoading.value = false;
  }
};
const onFormFinishFailed = errorInfo => { console.log('Form submission failed:', errorInfo); };
const navigateToRegister = () => { router.push('/register'); };
const contactSupport = () => { message.info('联系人工客服功能暂未实现。'); };

const handleChangeCheckCode = () => {
  randCodeData.requestCodeSuccess = false;
  getCaptchaCode();
};

onMounted(() => {
  getCaptchaCode()
});


</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

@login-page-bg: #BC1A2C;
@login-form-box-width: 448px;
// Adjusted min-height based on the visual content of the screenshot's login form
@login-form-box-min-height: 460px; // Fine-tune this based on final content
@login-button-width: 360px;
@login-button-height: 40px;
@login-input-height: 44px;

@header-logo-height: 28px;
@header-logo-width: auto; // Allow logo to scale based on height while maintaining aspect ratio
@header-sitename-font-size: 20px; // As previously set, looks reasonable

.login-page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: @login-page-bg;
  padding: @spacing-lg;
  position: relative;
  overflow: hidden; // Prevent scrollbars if pseudo-elements are large

  // Circuit Background Images - Adjusted for better screen coverage and subtlety
  &::before,
  &::after {
    content: '';
    position: absolute;
    background-repeat: no-repeat;
    pointer-events: none;
    z-index: 0;
  }

  // Left image
  &::before {
    background-image: url('@/assets/images/auth/circuit-bg-left.png');
    background-position: 0 0; // top left
    top: 2vh;
    left: 0;
    width: 38vw; // Use viewport units for better coverage
    height: 70vh;
    background-size: cover; // Cover the area, may crop if aspect ratio differs
    // Or 'contain' if you want the whole image visible but possibly smaller
  }

  // Right image
  &::after {
    background-image: url('@/assets/images/auth/circuit-bg-right.png');
    background-position: 100% 100%; // bottom right
    bottom: 0;
    right: 0;
    width: 38vw;
    height: 65vh;
    background-size: cover;
  }
}

.login-main-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: @login-form-box-width;
  position: relative;
  z-index: 1;
}

.branding-header {
  display: flex;
  align-items: center;
  margin-bottom: 18px; // Reduced space based on screenshot visual
  padding-left: 0; // Align with form box edge

  .logo-image {
    height: @header-logo-height;
    width: @header-logo-width; // Using auto for aspect ratio
    margin-right: 10px; // Slightly reduced margin
  }

  .site-name {
    font-size: @header-sitename-font-size;
    font-weight: 600;
    color: @text-color-light;
    line-height: 1; // Ensure it aligns well with logo
  }
}

.login-form-box {
  width: 100%;
  min-height: @login-form-box-min-height;
  background-color: @background-color-base;
  padding: 28px 44px 35px 44px; // Adjusted padding, esp. top and bottom
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 0;
  position: relative;
  overflow: hidden;
}

.form-view-pane {
  width: 100%;
  height: 100%;
}

.form-greeting-title {
  font-size: 18px;
  font-weight: 600;
  color: @text-color-base;
  margin-bottom: 22px; // Adjusted
  text-align: left;
}

.form-section-title-container {
  margin-bottom: 18px; // Adjusted
  text-align: left;
  border-bottom: 1px solid @border-color-light;
  padding-bottom: 8px; // Adjusted
  position: relative;
}

.form-section-title {
  font-size: 16px;
  font-weight: 500;
  color: @text-color-base;
  display: inline-block;
  margin: 0;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 100%; // Underline width matches text
    height: 2px;
    background-color: @primary-color;
    position: absolute;
    bottom: -9px; // (padding-bottom of container + border-width)
    left: 0;
  }
}

.form-instructions {
  // font-size: 14px;
  color: #9AA0A3;
  margin-bottom: @spacing-md; // Adjusted from lg
  text-align: left;
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0%;
  text-transform: uppercase;

}
.form-instructions-value {
  color: #1C1F23;
  margin-bottom: @spacing-md; // Adjusted from lg
  text-align: left;
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 25px;
  line-height: 22px;
  letter-spacing: 0%;
  text-transform: uppercase;
}
.back-button{
  margin-top: @spacing-xxl;
  width: 360px;
  height: 50px;
  border-radius: 4px;
  gap: 10px;
}
.auth-form {
  .ant-form-item {
    margin-bottom: 18px; // Slightly reduced spacing
  }

  :deep(.ant-input-affix-wrapper) {
    border-radius: @border-radius-sm;
    height: @login-input-height;

    .ant-input {
      height: 100%;
      font-size: 14px;
    }

    .site-form-item-icon {
      color: #BFBFBF;
      font-size: 16px;
    }
  }

  :deep(.ant-input-password) {
    height: @login-input-height;

    .ant-input {
      height: 100%;
    }
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px; // Adjusted

    .ant-checkbox-wrapper {
      font-size: 14px;
      color: @text-color-secondary;

      :deep(.ant-checkbox-checked .ant-checkbox-inner) {
        background-color: @primary-color;
        border-color: @primary-color;
      }

      :deep(.ant-checkbox-wrapper:hover .ant-checkbox-inner),
      :deep(.ant-checkbox:hover .ant-checkbox-inner),
      :deep(.ant-checkbox-input:focus + .ant-checkbox-inner) {
        border-color: @primary-color;
      }
    }
  }

  .interactive-link {
    font-size: 14px;
    color: @text-color-secondary;
    cursor: pointer;

    &:hover {
      color: @primary-color;
      text-decoration: underline;
    }
  }

  .submit-button {
    width: @login-button-width;
    height: @login-button-height;
    font-size: 16px;
    font-weight: 500;
    background-color: @primary-color;
    border-color: @primary-color;
    border-radius: @border-radius-sm;
    display: block;
    margin: 0 auto;

    &:hover,
    &:focus {
      background-color: darken(@primary-color, 5%);
      border-color: darken(@primary-color, 5%);
    }
  }

  .secondary-action-button {
    width: @login-button-width;
    height: @login-button-height;
    font-size: 16px;
    font-weight: 500;
    color: @primary-color;
    border-color: @primary-color;
    border-radius: @border-radius-sm;
    display: block;
    margin: @spacing-sm auto 0 auto;

    &:hover,
    &:focus {
      color: darken(@primary-color, 5%);
      border-color: darken(@primary-color, 5%);
      background-color: lighten(@primary-color, 45%);
    }
  }

  .form-footer-note {
    margin-top: @spacing-md; // Adjusted
    font-size: 13px;
    color: @text-color-secondary;
    text-align: center;
  }
}

.back-to-login-container {
  margin-top: @spacing-lg; // Adjusted
  text-align: center;
  padding-top: 0;
}

.captcha-code {
  position: absolute;
  right: 10px;
  top: 0;
  cursor: pointer;
  z-index: 1;
}
</style>