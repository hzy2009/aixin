// store/modalStore.js
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

export const useModalStore = defineStore('modal', {
  state: () => ({
    loginModalVisible: false,
    intendedPathAfterLogin: null, // 用于保存登录后要跳转的路径
    isSuccessPromptVisible: false,
    successPromptConfig: {
      title: '操作成功',
      message: '您的操作已成功处理。',
      contactInfo: { name: '陈靖玮', phone: '4000118892', email: 'info-service@icshare.com' },
      buttonText: '确定',
      onActionCallback: null, // Function to call when action button is clicked
      onCloseCallback: null,  // Function to call when modal is closed (X or cancel)
      showButton: true
    },
  }),
  actions: {
    showLogin(intendedPath = null) {
      this.loginModalVisible = true;
      if (intendedPath) {
        this.intendedPathAfterLogin = intendedPath;
      }
    },
    hideLogin() {
      this.loginModalVisible = false;
      // Optionally clear intendedPathAfterLogin after use or on close
      // this.intendedPathAfterLogin = null;
    },
    clearIntendedPath() {
      this.intendedPathAfterLogin = null;
    },
    showSuccessPrompt(config = {}) {
      // Merge provided config with defaults
      this.successPromptConfig = {
        title: config.title || '操作成功',
        message: config.message || '您的操作已成功处理。',
        contactInfo: config.contactInfo || null,
        buttonText: config.buttonText || '确定',
        showButton: config.showButton || true,
        // showButton: config.showButton !== undefined ? config.showButton : true,
        onActionCallback: config.onAction || null,
        onCloseCallback: config.onClose || null,
      };
      this.isSuccessPromptVisible = true;
    },
    hideSuccessPrompt() {
      if (this.successPromptConfig.onCloseCallback) {
        this.successPromptConfig.onCloseCallback();
      }
      this.isSuccessPromptVisible = false;
      // Reset config after hiding
      this.successPromptConfig = {
        title: '操作成功',
        message: '您的操作已成功处理。',
        contactInfo: { name: '陈靖玮', phone: '4000118892', email: 'info-service@icshare.com' },
        buttonText: '确定',
        onActionCallback: null,
        onCloseCallback: null,
        showButton: true
      };
    },
  },
  getters: {
    isLoginModalVisible: (state) => state.loginModalVisible,
    getSuccessPromptConfig: (state) => state.successPromptConfig,
  },
});