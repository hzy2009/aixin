<template>
  <div class="stat-item">
    <div class="stat-item__number-wrapper">
      <span class="stat-item__number-main">{{ mainNumber }}</span>
      <span class="stat-item__number-plus" v-if="plusSymbol">{{ plusSymbol }}</span>
    </div>
    <div class="stat-item__underline"></div>
    <h3 class="stat-item__title">{{ title }}</h3>
    <p class="stat-item__description preserve-newlines">{{ formattedDescription }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  number: {
    type: [String, Number],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

// Separate the main number from a potential '+' if it's part of the number prop
const mainNumber = computed(() => {
  const numStr = String(props.number);
  return numStr.replace('+', '');
});

const plusSymbol = computed(() => {
  const numStr = String(props.number);
  return numStr.includes('+') ? '+' : '';
});

// Allow line breaks in description if passed with <br> or \n
const formattedDescription = computed(() => {
  return props.description
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.stat-item {
  width: 100%; // Make it take the width of its parent in a grid
  height: 180px;
  background-color: @background-color-base;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  text-align: center; // General text-align for children


  transition: background-color 0.5s ease,
              box-shadow 0.5s ease,
              transform 0.5s ease; // Added transform for a slight lift effect

  &__number-wrapper {
    display: flex;
    align-items: flex-start; // Aligns baseline of number with top of plus
    justify-content: center;
    color: @primary-color;
    line-height: 1; // Crucial for tight vertical alignment
    margin-bottom: 6px; // Space between number and underline
  }

  &__number-main {
    font-family: Roboto;
    font-weight: 700;
    font-size: 60px;
    line-height: 1;
    letter-spacing: 0%;
    text-transform: uppercase;
  }

  &__number-plus {
    font-family: Roboto;
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    letter-spacing: 0%;
    text-transform: uppercase;
    margin-left: 2px; // Small gap
    position: relative;
    top: 2px; // Nudge it up slightly to align better with top of number
  }

  &__underline {
    width: 31.33px; // Adjust width as needed
    height: 0.78px; // Thickness of the underline
    background-color: @primary-color;
    margin-bottom: 10.17px; // Space between underline and title
    border-radius: 1px; // Slightly rounded ends if you prefer
  }

  &__title {
    font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0%;
    text-align: center;
    color: #272A30; // Your dark gray for title
    margin: 0 0 5px 0; // Margin: top right bottom left
  }

  &__description {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    letter-spacing: 0%;
    text-align: center;
    color: #9AA0A3; // Your lighter gray for description
    margin: 0;
    max-width: 200px; // Prevent description from becoming too wide
  }
  .preserve-newlines{
    white-space: pre-line;
  }
  &:hover {
    background-color: @primary-color;

    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.08); // Add a subtle shadow
    transform: translateY(-4px); // Optional: slight lift effect

    .stat-item__number-wrapper,.stat-item__description,.stat-item__title {
      color: #fff;
    }

    .stat-item__underline {
       background-color: #fff;
    }
  }
}
</style>