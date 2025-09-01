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
    isAuthenticated: (state) => !!state.token && !!state.userInfo,
    isLogin: (state) => !!state.userInfo && !!state.token,
  },
  actions: {
    async login(params) {
      const data = await loginApi(params);
      const { result: { userInfo, token, sysAllDictItems } } = data;
      this.setToken(token);
      this.setUserInfo(userInfo);
      this.setSysAllDictItems(sysAllDictItems);
      return data;
    },
    async getUserRole() {
      const {result} = await getUserRoleApi();
      this.setUserRole(result);
      return result;
    },

    async logout() {
      await logoutApi()
      this.setToken(null);
      this.setUserInfo(null);
      this.setSysAllDictItems([]);
      this.setUserRole({});
      // Optionally, clear other stores or redirect
    },
    clearUser() {
      this.setToken(null);
      this.setUserInfo(null);
      this.setSysAllDictItems([]);
      this.setUserRole({});
    },
    async getDictItems() {
      const res =  await getAllDictApi()
      this.setSysAllDictItems(res.result || []);
    },
    setToken(info) {
      this.token = info || null; // for null or undefined value
      // setAuthCache(TOKEN_KEY, info);
    },
     setUserInfo(info) {
      this.userInfo = info || null; // for null or undefined value
      // setAuthCache(TOKEN_KEY, info);
    },
    setUserRole(info) {
      this.userRole = info || {}; // for null or undefined value
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
    paths: ['userInfo', 'token', 'userRole', 'sysAllDictItems'], // Which state properties to persist
  },
});