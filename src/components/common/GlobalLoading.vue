<template>
  <div v-if="loading" class="global-loading-overlay">
    <div class="loading-content">
      <a-spin size="large" />
      <div class="loading-text">页面加载中...</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import progressBar from '@/utils/progressBar';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();

// 监听路由变化状态
const loading = computed(() => props.loading);
</script>

<style scoped lang="less">
.global-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(250, 250, 250, 0.9);
  backdrop-filter: blur(2px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  
  // 动画效果
  animation: fadeIn 0.2s ease-out;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.loading-text {
  color: #666;
  font-size: 14px;
  white-space: nowrap;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

// 响应式适配
@media (max-width: 768px) {
  .loading-content {
    margin: 0 16px;
    padding: 24px;
  }
}
</style>