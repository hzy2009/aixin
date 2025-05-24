// src/store/authStore.js
import { defineStore } from 'pinia';
import { loginApi, getUserInfo } from '@/api/user.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userInfo: null,
    token: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    // Example role getters - adjust based on your user object structure
    isMember: (state) => state.user && state.user.role === 'member',
    isAdmin: (state) => state.user && state.user.role === 'admin',
  },
  actions: {
    async login(params) {
      const data = await loginApi(params);
      const { result: { userInfo, token } } = data;
      this.setToken(token);
      this.setUserInof(userInfo);
      return data;
    },
    logout() {
      this.user = null;
      this.token = null;
      // Optionally, clear other stores or redirect
    },
    setToken(info) {
      this.token = info ? info : ''; // for null or undefined value
      // setAuthCache(TOKEN_KEY, info);
    },
     setUserInof(info) {
      this.userInfo = info ? info : ''; // for null or undefined value
      // setAuthCache(TOKEN_KEY, info);
    },
    // You'll add async actions for API calls here
    // async fetchUser() { ... }
  },
  persist: { // Configuration for pinia-plugin-persistedstate
    key: 'auth', // Key for localStorage
    storage: localStorage, // or sessionStorage
    paths: ['user', 'token'], // Which state properties to persist
  },
});