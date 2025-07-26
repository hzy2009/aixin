<template>
  <a-config-provider
    :locale="zhCN"
     :theme="{
      token: {
        colorPrimary: '#BC1A2C',
        borderRadius: 4,
        colorError: '#BC1A2C',
      },
    }"
    >
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
  <PhoneAndEmailModal ref="phoneAndEmailModal" @finish="handleFinish" title="填写信息获取交易信息" actionText="联系平台获取最新进展"></PhoneAndEmailModal>

</template>

<script setup>
import { computed, ref } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import LoginPromptModal from '@/components/layout/LoginPromptModal.vue';
import SuccessPromptModal from '@/components/common/SuccessPromptModal.vue';
import PhoneAndEmailModal from '@/components/common/PhoneAndEmailModal.vue';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore'; 
import { message } from 'ant-design-vue';
import defHttp from '@/utils/http/axios'
const authStore = useAuthStore();
authStore.getDictItems();

const phoneAndEmailModal = ref()

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
  // modalStore.hideLogin();
  phoneAndEmailModal.value.opneModal()
};
const handleFinish = async (data) => {
  const response = await defHttp.get({ url: `/apm/apmTodo/newVip/newTodo/front`, params: data });
  if (response && response.success) {
    phoneAndEmailModal.value.handleClose()
      const defaultConfig = {
      title: '一键敲门成功',
      message: '一键敲门后，客服人员将在30分钟内与您联系',
      contactInfo: { name: '陈靖玮', phone: '021-55698507', email: 'info-service@icshare.com' },
      buttonText: '返回首页',
      showButton: false,
      onAction: null, // Default onAction is handled in store to go home
    };
    modalStore.showSuccessPrompt({ ...defaultConfig });
  } else {
    message.info(response.message);
  }
};

const navigateToForgotPassword = () => {
  // router.push({ name: 'ForgotPasswordPage' }); // 假设你有忘记密码页的路由名
  modalStore.hideLogin();
};

</script>

<style lang="less"></style>