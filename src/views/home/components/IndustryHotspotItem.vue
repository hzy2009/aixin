<template>
  <a :href="`/industry-dynamics/${hotspot.id}` || '#'" target="_blank" class="hotspot-item" @click.prevent="onItemClick">
    <span class="hotspot-title">{{ hotspot.title }}</span>
    <span class="hotspot-date">{{ hotspot.createTime ? formatDate(hotspot.createTime) : '' }}</span>
  </a>
</template>

<script setup>
import { useRouter } from 'vue-router';
import {formatDate} from '@/utils';
const props = defineProps({
  hotspot: {
    type: Object,
    required: true,
    default: () => ({
    })
  }
});
const router = useRouter();

const onItemClick = () => {
  // if (props.hotspot.link && props.hotspot.link !== '#') {
    // If it's an external link, let the browser handle it (or use window.open)
    // If it's an internal route, use router.push
    // For this example, we assume it's a link to be opened.
    // If you have internal detail pages:
    // router.push({ paht: `/industry-dynamics/${hotspot.id}`});
  // }
    router.push({ path: `/industry-dynamics/${props.hotspot.id}`});

};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.hotspot-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0; // Vertical padding for each item to match image
  border-bottom: 1px dotted @border-color-light; // Dotted separator
  text-decoration: none; // Remove underline from <a>
  transition: background-color 0.2s ease;

  &:hover {
    // background-color: #fbfbfb; // Very subtle hover
    .hotspot-title {
      color: @primary-color; // Title color change on hover
    }
  }

  &:last-child {
    // border-bottom: none;
  }
}

.hotspot-title {
  flex-grow: 1;
  font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0%;
    text-align: justify;
    text-transform: uppercase;
    color: #333333;
//   color: @text-color-secondary; // Grayish text as per image
  padding-right: @spacing-lg; // Space before date
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.hotspot-date {
  font-size: 14px;
  color: @text-color-tertiary; // Lighter gray for date
  flex-shrink: 0;
  white-space: nowrap;
}
</style>