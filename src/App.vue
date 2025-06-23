<template>
  <a-config-provider :locale="zhCN">
    <router-view />
  </a-config-provider>
   <LoginPromptModal
      :is-visible="isLoginModalVisible"
      @close="hideLoginModal"
      @login-success="handleLoginSuccess"
      @navigate-to-register="navigateToRegister"
      @navigate-to-forgot-password="navigateToForgotPassword"
    />
    <SuccessPromptModal
      :is-visible="modalStore.isSuccessPromptVisible"
      :title="getSuccessPromptConfig.title"
      :message="getSuccessPromptConfig.message"
      :contact-info="getSuccessPromptConfig.contactInfo"
      :button-text="getSuccessPromptConfig.buttonText"
      :on-action="getSuccessPromptConfig.onActionCallback"
      :on-close="getSuccessPromptConfig.onCloseCallback"
      :show-button="getSuccessPromptConfig.showButton"
      @close="modalStore.hideSuccessPrompt"
      @action="() => { /* Modal internal action also calls its onClose */ }"
    />
</template>

<script setup>
import { computed } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import LoginPromptModal from '@/components/layout/LoginPromptModal.vue';
import SuccessPromptModal from '@/components/common/SuccessPromptModal.vue';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore'; 
const authStore = useAuthStore();
authStore.getDictItems();


const modalStore = useModalStore();
// const router = useRouter();
// const route = useRoute(); // For redirect after login

const isLoginModalVisible = computed(() => modalStore.isLoginModalVisible);
const getSuccessPromptConfig = computed(() => modalStore.getSuccessPromptConfig);

const showLoginModal = () => {
  modalStore.showLogin();
};

const hideLoginModal = () => {
  modalStore.hideLogin();
};

const handleLoginSuccess = (userData) => {
  console.log('App.vue: Login successful', userData);
  // 根据登录前的意图进行重定向
  // const redirectPath = route.query.redirect || authStore.defaultRedirectPath || '/user/dashboard';
  // router.push(redirectPath);
  // modalStore.hideLogin(); // 确保弹窗关闭
};

const navigateToRegister = () => {
  // router.push({ name: 'RegisterPage' }); // 假设你有注册页的路由名
  modalStore.hideLogin();
};

const navigateToForgotPassword = () => {
  // router.push({ name: 'ForgotPasswordPage' }); // 假设你有忘记密码页的路由名
  modalStore.hideLogin();
};

</script>

<style lang="less"></style>