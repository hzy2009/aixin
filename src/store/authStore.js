// src/store/authStore.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    // Example role getters - adjust based on your user object structure
    isMember: (state) => state.user && state.user.role === 'member',
    isAdmin: (state) => state.user && state.user.role === 'admin',
  },
  actions: {
    login(userData, token) {
      this.user = userData;
      this.token = token;
    },
    logout() {
      this.user = null;
      this.token = null;
      // Optionally, clear other stores or redirect
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