<template>
  <router-link :to="article.link" class="article-list-item">
    <div class="article-list-item__image-wrapper">
      <img :src="article.image" :alt="article.title" class="article-list-item__image" />
    </div>
    <div class="article-list-item__content">
      <h3 class="article-list-item__title">{{ article.title }}</h3>
      <p class="article-list-item__description">{{ article.description }}</p>
      <div class="article-list-item__footer">
        <span class="article-list-item__date">{{ article.date }}</span>
        <RightOutlined class="article-list-item__arrow" />
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { RightOutlined } from '@ant-design/icons-vue';

defineProps({
  article: {
    type: Object,
    required: true,
    // TODO: Define a more specific shape for the article object based on API response
    // default: () => ({
    //   id: null,
    //   title: 'Default Title',
    //   description: 'Default description text.',
    //   date: 'YYYY-MM-DD',
    //   image: '/path/to/default-image.jpg',
    //   link: '#'
    // })
  },
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less'; // Ensure PingFang SC is defined in @font-family-sans-serif or create a specific variable

.article-list-item {
  display: flex;
  width: 792px; // Fixed width for the item
  height: 214px; // Fixed height for the item
  background-color: @background-color-base;
  border-bottom: 1px solid @border-color-light; // Assuming this is the desired border
  // padding: @spacing-lg 0; // Remove padding if fixed height is strict
  text-decoration: none;
  transition: background-color 0.3s ease;
  box-sizing: border-box; // Ensure padding/border are included in width/height
  overflow: hidden; // Prevent content from spilling if fixed height is too restrictive

  &:hover {
    background-color: #f9f9f9;
    .article-list-item__title {
      color: @primary-color;
    }
  }

  &__image-wrapper {
    flex-shrink: 0;
    width: 282px;
    height: 175px;
    margin: ((214px - 175px) / 2); // Vertically center image within item height
    margin-right: @spacing-lg; // Space between image and text content
    overflow: hidden;
    border-radius: @border-radius-sm; // Optional: slightly rounded corners for image
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: ((214px - 175px) / 2) 0; // Match vertical padding of image wrapper for text alignment
    padding-right: @spacing-md; // Add some padding to the right of text
    overflow: hidden; // Important for text truncation
    box-sizing: border-box;
  }

  &__title {
    font-family: "PingFang SC", @font-family-sans-serif; // Use PingFang SC first
    font-weight: 400;
    font-size: 22px;
    line-height: 22px; // This line-height is very tight for 22px font-size, might cause descenders to be cut. Consider 1.2-1.4 * font-size
    color: @text-color-base;
    margin: 0 0 12px 0; // Adjust margin as needed
    transition: color 0.3s ease;

    // Text truncation for title (e.g., 2 lines - adjust -webkit-line-clamp)
    display: -webkit-box;
    -webkit-line-clamp: 2; // Max 2 lines for title
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    // Calculate max-height to enforce line clamp, line-height * number of lines
    max-height: calc(22px * 2); // 22px line-height * 2 lines
  }

  &__description {
    font-family: "PingFang SC", @font-family-sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%; // Default, can be omitted
    text-align: justify;
    color: @text-color-secondary;
    margin: 0 0 @spacing-md 0;
    flex-grow: 1; // Allow description to take available space before footer

    // Text truncation for description (adjust -webkit-line-clamp)
    display: -webkit-box;
    -webkit-line-clamp: 3; // Max 3 lines for description
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
     // Calculate max-height to enforce line clamp
    max-height: calc(22px * 3); // 22px line-height * 3 lines
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto; // Pushes footer to bottom
  }

  &__date {
    font-family: "PingFang SC", @font-family-sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%;
    text-align: justify; // This usually doesn't make sense for a single line of date text
    color: #9AA0A3; // Text color for date, not background
    // background: #9AA0A3; // This would be background color, not text color. Assuming it was a typo.
  }

  &__arrow {
    font-size: 16px; // Slightly larger arrow
    color: #9AA0A3;
  }
}
</style>