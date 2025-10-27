<template>
  <div class="masked-content-wrapper">
    <slot></slot>
    <div v-if="!isVerified" class="mask" @click="handleMaskClick">
      <div class="mask-text">详情查看请点击二次核验。</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/store/authStore';

const emit = defineEmits(['request-verification']);

const authStore = useAuthStore();
const isVerified = computed(() => authStore.isSecondarilyVerified);

const handleMaskClick = () => {
  emit('request-verification');
};
</script>

<style scoped lang="less">
.masked-content-wrapper {
  position: relative;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  z-index: 10;
}

.mask-text {
  font-size: 16px;
  font-weight: bold;
  color: #BC1A2C; // Using primary color from the project
  padding: 10px 20px;
  border: 1px solid #BC1A2C;
  border-radius: 4px;
}
</style>
