<template>
  <div class="section-header">
    <div class="section-header__title-group">
      <span class="section-header__title-decorator"></span>
      <h2 class="section-header__title-ch">{{ titleCh }}</h2>
      <span v-if="titleEn" class="section-header__title-en">| {{ titleEn.toUpperCase() }}</span>
    </div>
    <router-link v-if="moreLink" :to="moreLink" class="section-header__more-link">
      更多 <RightOutlined />
    </router-link>
  </div>
</template>

<script setup>
import { RightOutlined } from '@ant-design/icons-vue';

defineProps({
  titleCh: {
    type: String,
    required: true,
  },
  titleEn: {
    type: String,
    default: '',
  },
  moreLink: {
    type: [String, Object],
    default: null,
  },
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: @spacing-lg;
  // border-bottom: 1px solid @border-color-light; // Removed bottom border to match design
  padding-bottom: @spacing-sm;


  &__title-group {
    display: flex;
    align-items: center; // Align items vertically for decorator
  }

  &__title-decorator {
    display: inline-block;
    width: 4px;
    height: 20px; // Matches typical h2 font size height
    background-color: @primary-color;
    margin-right: @spacing-sm;
  }

  &__title-ch {
    font-size: 22px; // As per design, looks around this size
    font-weight: 600;
    color: @text-color-base;
    margin: 0;
    line-height: 1; // Ensure it aligns well with decorator
  }

  &__title-en {
    font-size: 14px; // Smaller for EN
    color: @text-color-tertiary; // Lighter gray
    margin-left: @spacing-xs;
    text-transform: uppercase;
    font-weight: 300; // Lighter weight
    line-height: 1;
  }

  &__more-link {
    font-size: 14px;
    color: @text-color-secondary;
    display: flex;
    align-items: center;

    &:hover {
      color: @primary-color;
    }

    .anticon-right {
      margin-left: @spacing-xs;
      font-size: 12px;
    }
  }
}
</style>