<template>
  <a-modal
    :open="isVisible"
    v-if="isVisible"
    :closable="false"
    :mask-closable="true"
    :footer="null"
    wrap-class-name="login-prompt-modal-wrapper"
    centered
    width="420px"
    @cancel="handleCancel"
  >
    <div class="login-prompt-content">
      <button class="close-button" @click="handleCancel" aria-label="关闭">
        <CloseOutlined />
      </button>
      <div class="form-view-pane" v-show="currentView === 'login'">
        <div class="header-text">此为会员功能，请登录</div>
        <div class="form-title-section">
          <h2 class="form-title">用户</h2>
        </div>

        <a-form :model="formState" @finish="handleLogin" class="login-form">
          <a-form-item
            name="username"
            :rules="[{ required: true, message: '请输入账号' }]"
          >
            <a-input v-model:value="formState.username" placeholder="请输入账号" size="large" class="custom-input">
              <template #prefix><UserOutlined style="color: #BFBFBF;" /></template>
            </a-input>
          </a-form-item>

          <a-form-item
            name="password"
            :rules="[{ required: true, message: '请输入密码!' }]"
          >
            <a-input-password v-model:value="formState.password" placeholder="请输入密码" size="large" class="custom-input">
              <template #prefix><LockOutlined style="color: #BFBFBF;" /></template>
            </a-input-password>
          </a-form-item>
          <a-form-item name="captcha">
            <a-input v-model:value="formState.captcha" placeholder="请输入验证码"  size="large" class="custom-input">
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

          <a-form-item class="extra-actions-row">
            <a-checkbox v-model:checked="formState.rememberMe" class="remember-me-checkbox">
              自动登录
            </a-checkbox>
            <a href="#" @click.prevent="switchToForgotPassword" class="forgot-password-link">忘记密码?</a>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" class="login-button" :loading="isLoading" block size="large">
              立即登录
            </a-button>
          </a-form-item>
        </a-form>

        <div class="register-prompt">
          没有账号? <a href="#" @click.prevent="handleRegister" class="register-link">注册一键敲门</a>
        </div>
      </div>
      <div class="form-view-pane" v-show="currentView === 'forgotPassword'">
        <div class="form-title-section">
          <h2 class="form-title">请联系管理员</h2>
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
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { reactive, ref, onMounted  } from 'vue';
import {
  Modal as AModal, Form as AForm, FormItem as AFormItem, Input as AInput,
  InputPassword as AInputPassword, Checkbox as ACheckbox, Button as AButton, message
} from 'ant-design-vue';
import { UserOutlined, LockOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '@/store/authStore'; // Assuming you have this
import { useRouter } from 'vue-router'; // If needed for navigation
import { getCodeInfo } from '@/api/user.js';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  }
});

const emit = defineEmits(['close', 'loginSuccess', 'navigateToRegister', 'navigateToForgotPassword']);

const authStore = useAuthStore();
const router = useRouter(); // If you navigate after login directly from here
const isLoading = ref(false);
const currentView = ref('login');
const switchToForgotPassword = () => { currentView.value = 'forgotPassword'; };
const switchToLogin = () => { currentView.value = 'login'; };
const formState = reactive({
  username: '',
  password: '',
  rememberMe: true,
});

const handleLogin = async values => {
  isLoading.value = true;
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
    emit('loginSuccess', res);
    emit('close'); // Close modal on success
  } catch (error) {
    console.error('Login failed:', error);
    message.error(error.message || '登录失败，请检查您的凭据。');
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = () => {
  emit('close');
};

const handleForgotPassword = () => {
  emit('navigateToForgotPassword');
  emit('close'); // Close this modal before navigating
};

const handleRegister = () => {
  emit('navigateToRegister');
  emit('close'); // Close this modal before navigating
};

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
const handleChangeCheckCode = () => {
  randCodeData.requestCodeSuccess = false;
  getCaptchaCode();
};

onMounted(() => {
  getCaptchaCode()
});

</script>

<style lang="less"> // Using lang="less" (not scoped) for .login-prompt-modal-wrapper
@import '@/assets/styles/_variables.less'; // Your global LESS variables

.login-prompt-modal-wrapper {
  .ant-modal {
    max-width: 420px; // As per your width prop
    padding-bottom: 0; // AntD default
  }
  .ant-modal-content {
    padding: 0; // Remove all default padding
    border-radius: 4px; // Subtle rounding for the modal box
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .ant-modal-body {
    padding: 0; // We'll handle padding in .login-prompt-content
  }
  .ant-modal-mask {
    background-color: rgba(0, 0, 0, 0.65); // Standard AntD mask color, ensure it's dark enough
  }
}
</style>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.login-prompt-content {
  padding: 32px 40px 32px 40px; // Padding around the content
  position: relative; // For absolute positioning of close button
  background-color: @background-color-base; // White
}

.close-button {
  position: absolute;
  top: 18px; // Adjust to match image
  right: 18px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px; // Icon size
  color: #00000073; // AntD default close icon color
  padding: 0;
  line-height: 1;
  transition: color 0.3s;
  &:hover {
    color: #000000D9;
  }
}

.header-text {
  font-size: 16px;
  color: @text-color-base; // Black/dark gray
  margin-bottom: 20px; // Space to "用户"
  text-align: left;
  font-weight: 500;
}

.form-title-section {
  margin-bottom: 24px; // Space after "用户" and its underline
  padding-bottom: 8px; // Space for the underline
  border-bottom: 1px solid @border-color-light; // Gray line below "用户" section
  position: relative; // For the red accent line

  .form-title {
    font-size: 18px;
    font-weight: 500; // Matches image
    color: @text-color-base;
    margin: 0;
    display: inline-block; // For the accent to fit text width

    &::after { // Red accent underline
      content: '';
      position: absolute;
      left: 0;
      bottom: -1px; // Sit on top of the gray border-bottom
      width: 36px; // Width of the red accent (adjust to match "用户")
      height: 2px;
      background-color: @primary-color; // Your red
    }
  }
}

.login-form {
  .custom-input {
    :deep(input) {
      font-size: 14px;
      // AntD size="large" usually results in 40px height.
      // If you need custom height, target .ant-input directly.
    }
    :deep(.ant-input-prefix .anticon) {
        color: #BFBFBF; // Icon color
    }
  }

  .extra-actions-row {
    margin-bottom: 20px; // Space before login button
    :deep(.ant-form-item-control-input-content) {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .remember-me-checkbox {
    font-size: 14px;
    color: @text-color-secondary; // Matches "忘记密码" color
    :deep(.ant-checkbox-checked .ant-checkbox-inner) {
      background-color: @primary-color; // Red checkmark background
      border-color: @primary-color;
    }
     :deep(.ant-checkbox-wrapper:hover .ant-checkbox-inner),
     :deep(.ant-checkbox:hover .ant-checkbox-inner),
     :deep(.ant-checkbox-input:focus + .ant-checkbox-inner) {
        border-color: @primary-color;
    }
  }

  .forgot-password-link {
    font-size: 14px;
    color: @text-color-secondary; // Gray link
    &:hover {
      color: @primary-color;
    }
  }

  .login-button {
    background-color: @primary-color; // Red button
    border-color: @primary-color;
    font-size: 16px;
    font-weight: 500;
    // height: 40px; // AntD size="large" should handle this
    &:hover, &:focus {
      background-color: darken(@primary-color, 8%);
      border-color: darken(@primary-color, 8%);
    }
  }
}

.register-prompt {
  margin-top: 24px; // Space above "没有账号?"
  text-align: center;
  font-size: 14px;
  color: @text-color-secondary; // Gray text

  .register-link {
    color: @primary-color; // Red link
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
}

.captcha-code {
  position: absolute;
  right: 10px;
  top: 0;
  cursor: pointer;
  z-index: 1;
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
  margin-top: @spacing-xl;
  width: 360px;
  height: 50px;
  border-radius: 4px;
  gap: 10px;
}
</style>