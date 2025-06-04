<template>
  <h3 class="section-title">
    <span class="decorator"></span>
    {{ title }}
    <slot></slot>
  </h3>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.section-title {
  font-size: 16px; // Design shows this around 16px
  font-weight: 600;
  color: @text-color-base;
  margin-top: @spacing-xl; // Space above section title
  margin-bottom: @spacing-md; // Space below section title before descriptions
  padding-left: @spacing-md; // Space for the decorator
  position: relative;
  display: flex;
  align-items: center;
  line-height: 1;

  .decorator {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 16px;
    background-color: @primary-color;
    border-radius: 1px;
  }
}
</style>