<template>
  <a-config-provider :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>

<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { useAuthStore } from '@/store/authStore';
useAuthStore().getDictItems();

</script>

<style lang="less"></style>