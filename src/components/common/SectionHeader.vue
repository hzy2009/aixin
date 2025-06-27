<template>
  <div class="section-header">
    <div class="section-header__title-group">
      <span class="section-header__title-decorator"></span>
      <h2 class="section-header__title-ch">{{ titleCh }}</h2>
      <span v-if="titleEn" class="section-header__title-en">{{ titleEn.toUpperCase() }}</span>
    </div>
    <router-link v-if="moreLink" :to="moreLink" class="section-header__more-link">
      更多 
      <!-- <RightOutlined /> -->
    </router-link>
    <!-- <div v-if="moreLink" class="section-header__more-link" @click="handleToMore">
      更多 
    </div> -->
  </div>
</template>

<script setup>
import { RightOutlined } from '@ant-design/icons-vue';
// import { useAuthStore } from '@/store/authStore';
// import { useModalStore } from '@/store/modalStore'; 
// const authStore = useAuthStore();
// authStore.getDictItems();

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

const handleToMore =  () => {
  
}
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  // border-bottom: 1px solid @border-color-light; // Removed bottom border to match design
  // padding-bottom: @spacing-sm;


  &__title-group {
    display: flex;
    align-items: center; // Align items vertically for decorator
  }

  &__title-decorator {
    display: inline-block;
    width: 4px;
    height: 30px; // Matches typical h2 font size height
    background-color: @primary-color;
    margin-right:10px;
  }

  &__title-ch {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 20px;
    line-height: 100%;
    letter-spacing: 0%;
    text-transform: uppercase;

    color: @primary-color;
    margin: 0;
    margin-right:10px;
  }

  &__title-en {
    font-family: PingFang SC;
    font-weight: 300;
    font-size: 20px;
    line-height: 100%;
    letter-spacing: 0%;
    text-transform: uppercase;
    color: @text-color-tertiary; // Lighter gray
    // line-height: 1;
  }

  &__more-link {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0%;
    color: @text-color-secondary;
    display: flex;
    align-items: center;

    &:hover {
      color: @primary-color;
    }

    .anticon-right {
      margin-left: @spacing-xs;
      font-size: 14px;
    }
  }
}
</style>