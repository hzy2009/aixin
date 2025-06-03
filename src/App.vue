<template>
  <a-config-provider :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>

<script setup>
import { useAuthStore } from '@/store/authStore';
useAuthStore().getDictItems();

// import zhCN from 'ant-design-vue/es/locale/zh_CN';
</script>

<style lang="less"></style>