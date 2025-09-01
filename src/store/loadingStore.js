import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isRouteLoading: false,
    routeLoadingTimer: null
  }),

  getters: {
    isGlobalLoading: (state) => state.isRouteLoading
  },

  actions: {
    startRouteLoading() {
      // 添加轻微延迟，避免快速切换时的闪烁
      this.routeLoadingTimer = setTimeout(() => {
        this.isRouteLoading = true;
      }, 100);
    },

    finishRouteLoading() {
      if (this.routeLoadingTimer) {
        clearTimeout(this.routeLoadingTimer);
        this.routeLoadingTimer = null;
      }
      
      // 确保loading显示足够时间，避免闪烁
      if (this.isRouteLoading) {
        setTimeout(() => {
          this.isRouteLoading = false;
        }, 150);
      } else {
        this.isRouteLoading = false;
      }
    },

    // 立即停止loading（用于错误情况）
    stopRouteLoading() {
      if (this.routeLoadingTimer) {
        clearTimeout(this.routeLoadingTimer);
        this.routeLoadingTimer = null;
      }
      this.isRouteLoading = false;
    }
  }
});