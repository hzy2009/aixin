// store/modalStore.js
import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
  state: () => ({
    loginModalVisible: false,
    intendedPathAfterLogin: null, // 用于保存登录后要跳转的路径
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
    }
  },
  getters: {
    isLoginModalVisible: (state) => state.loginModalVisible,
  },
});