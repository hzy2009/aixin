// src/store/authStore.js
import { defineStore } from 'pinia';
import { loginApi, getUserRoleApi, logoutApi, getAllDictApi } from '@/api/user.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userInfo: null,
    token: null,
    sysAllDictItems: [],
    userRole: {},
    isLoginModalVisible: false
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isLogin: (state) => !!state.userInfo,
  },
  actions: {
    async login(params) {
      const data = await loginApi(params);
      const { result: { userInfo, token, sysAllDictItems } } = data;
      this.setToken(token);
      this.setUserInof(userInfo);
      this.setSysAllDictItems(sysAllDictItems);
      return data;
    },
    async getUserRole() {
      const {result} = await getUserRoleApi();
      this.setUserRose(result);
      return result;
    },

    async logout() {
      await logoutApi()
      this.setToken(null);
      this.setUserInof(null);
      this.setSysAllDictItems([]);
      this.setUserRose({});
      // Optionally, clear other stores or redirect
    },
    clearUser() {
      this.setToken(null);
      this.setUserInof(null);
      this.setSysAllDictItems([]);
      this.setUserRose({});
    },
    async getDictItems() {
      const res =  await getAllDictApi()
      this.setSysAllDictItems(res.result || []);
    },
    setToken(info) {
      this.token = info ? info : ''; // for null or undefined value
      // setAuthCache(TOKEN_KEY, info);
    },
     setUserInof(info) {
      this.userInfo = info ? info : ''; // for null or undefined value
      // setAuthCache(TOKEN_KEY, info);
    },
    setUserRose(info) {
      this.userRole = info ? info : {}; // for null or undefined value
    },
    setSysAllDictItems(info) {
      this.sysAllDictItems = info ? info : []; // for null or undefined value
      // setAuthCache(TOKEN_KEY, info);
    }
    // You'll add async actions for API calls here
    // async fetchUser() { ... }
  },
  persist: { // Configuration for pinia-plugin-persistedstate
    key: 'auth', // Key for localStorage
    storage: localStorage, // or sessionStorage
    paths: ['user', 'token'], // Which state properties to persist
  },
});