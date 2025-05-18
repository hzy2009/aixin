<template>
  <section class="home-research-report-section section-padding">
    <div class="container">
      <SectionHeader title-ch="行研报告" title-en="INDUSTRY RESEARCH REPORT" more-link="/reports" />
      <div class="report-grid">
        <a-card
          v-for="report in reports"
          :key="report.id"
          hoverable
          class="report-card"
          :body-style="{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }"
        >
          <template #cover>
            <router-link :to="`/reports/${report.id}`" class="report-card__cover-link">
              <img :alt="report.title" :src="report.image" class="report-card__image" />
            </router-link>
          </template>

          <div class="report-card__content">
            <router-link :to="`/reports/${report.id}`" class="report-card__title-link">
              <h3 class="report-card__title">{{ report.title }}</h3>
            </router-link>
            <p class="report-card__description">{{ report.description }}</p>
          </div>

          <p class="report-card__date">{{ report.date }}</p>
        </a-card>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { Card as ACard } from 'ant-design-vue'; // CardMeta not used directly in this layout
import SectionHeader from '@/components/common/SectionHeader.vue';

// Placeholder images
import reportImg1 from '@/assets/images/home/report-thumb-1.png';
import reportImg2 from '@/assets/images/home/report-thumb-2.png';
import reportImg3 from '@/assets/images/home/report-thumb-3.png';

const reports = ref([
  { id: 1, title: '中国半导体行业协会2025年环境、安全与健康发展趋势深度剖析报告', image: reportImg1, description: '近年来，集成电路产业在成为国家重点鼓励、扶持的战略性新兴产业的同时，也日益面临着更为严峻的环境和安全问题，国内外多项法规标准相继出台，对企业提出了更高要求。', date: '2025-04-22' },
  { id: 2, title: '先进封装技术发展趋势与市场前景展望报告：Chiplet异构集成引领未来', image: reportImg2, description: '随着芯片集成度的不断提高，先进封装技术在提升性能、降低成本方面扮演着越来越重要的角色。本报告深入分析了Fan-Out, 2.5D/3D, Chiplet等关键技术...', date: '2025-04-10' },
  { id: 3, title: '第三代半导体材料碳化硅(SiC)与氮化镓(GaN)产业研究及国产化进程', image: reportImg3, description: '碳化硅与氮化镓作为第三代半导体的代表材料，凭借其优异的物理特性，在新能源汽车、光伏发电、5G通信、快速充电等领域展现出巨大潜力，市场空间广阔。', date: '2025-03-28' },
]);
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.section-padding {
  padding: @spacing-xxl 0;
  background-color: @background-color-section-alt; // Light gray background for this section
}

.report-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); // 3 reports per row
  gap: @spacing-lg;

  @media (max-width: 991px) { // Tablet: 2 columns
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 575px) { // Mobile: 1 column
    grid-template-columns: 1fr;
  }
}

.report-card {
  background-color: @background-color-base;
  border: 1px solid @border-color-light;
  border-radius: @border-radius-base;
  overflow: hidden;
  display: flex; // Important for flex-grow in body-style to work
  flex-direction: column; // Ensure card itself is a column flex container
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    .report-card__title {
      color: @primary-color; // Title turns red on hover
    }
  }

  &__cover-link {
    display: block; // Ensure link takes up space
  }

  &__image {
    width: 100%;
    height: 190px; // Fixed height for the cover image
    object-fit: cover;
    display: block; // Remove any extra space below image
  }

  // This div will hold title and description, allowing date to be pushed to bottom by flex-grow
  &__content {
    flex-grow: 1; // This makes this section take up available space, pushing date down
    padding: 0; // Padding is handled by body-style and individual elements if needed
  }

  &__title-link {
    text-decoration: none;
  }

  &__title {
    font-size: 17px; // Prominent title
    font-weight: 600;
    color: @text-color-base;
    line-height: 1.4;
    margin: 0 0 @spacing-sm 0; // Margin bottom for space before description
    transition: color 0.3s ease;

    // Text truncation for title (2 lines)
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    // min-height needed to reserve space if title is short, ensuring description alignment
    min-height: calc(1.4em * 2); // 1.4em is line-height * 2 lines
  }

  &__description {
    font-size: 13px;
    color: @text-color-secondary;
    line-height: 1.6;
    margin-bottom: @spacing-md; // Space before the date

    // Text truncation for description (3 lines)
    display: -webkit-box;
    -webkit-line-clamp: 3; // Show 3 lines
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    // min-height to reserve space for 3 lines, helps with consistent date positioning
    min-height: calc(1.6em * 3); // 1.6em is line-height * 3 lines
  }

  &__date {
    font-size: 12px;
    color: @text-color-tertiary; // Lighter gray for the date
    line-height: 1; // Single line for date
    margin: 0; // Remove any default paragraph margin
    padding-top: @spacing-sm; // Space above date if description is short
    border-top: 1px solid @border-color-light; // Separator line above date, as per some designs
    margin-top: auto; // This is an alternative to flex-grow on content if padding is inside body-style
                       // With flex-grow on __content, this can be removed or set to 0
  }

  // The :body-style on <a-card> controls the padding of the content area below the cover.
  // We set it to display:flex, flexDirection:column, and flexGrow:1
  // so that the internal __content div can push the __date to the bottom.
}
</style>