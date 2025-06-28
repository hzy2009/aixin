<template>
  <section class="home-research-report-section section-padding">
    <div class="container">
      <SectionHeader title-ch="行研报告" title-en="SECTOR DEEP DIVE REPORT" more-link="/demands/IndustryReport" />
      <div class="report-grid">
        <div
          v-for="report in reports"
          :key="report.id"
          hoverable
          class="report-card"
        >
          <div >
            <router-link :to="`/demands/IndustryReportDetailPage/${report.id}`" class="report-card__cover-link">
              <img :alt="report.reportName" :src="report.imageUrl ? getFileAccessHttpUrl(report.imageUrl) : reportImg1" class="report-card__image" />
            </router-link>
          </div>

          <div class="report-card__content">
            <router-link :to="`/demands/IndustryReportDetailPage/${report.id}`" class="report-card__title-link">
              <h3 class="report-card__title">{{ report.reportName }}</h3>
            </router-link>
            <div class="report-card__description"><div v-html="report.description"></div></div>
            <p class="report-card__date">{{ report.date }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SectionHeader from '@/components/common/SectionHeader.vue';
import defHttp from '@/utils/http/axios'
import {getFileAccessHttpUrl} from '@/utils/index'
// Placeholder images
import reportImg1 from '@/assets/images/home/report-thumb-1.png';

const reports = ref([]);

const fetchrReportsItems = async () => {
  const res = await defHttp.get({ url: `/apm/apmResearchReport/list/front`, params: { page: 1, pageSize: 6 } });
  let items = [];
  if (res.success) {
    items = res.result.records
  }
  reports.value = items;
};
onMounted(() => {
  fetchrReportsItems();
});

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.section-padding {
  padding: 10px 0;
  background-color: #FAFAFA; // Light gray background for this section
}

.report-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); // 3 reports per row
  gap: 24px;

  @media (max-width: 991px) { // Tablet: 2 columns
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 575px) { // Mobile: 1 column
    grid-template-columns: 1fr;
  }
}

.report-card {
  background-color: #fff;
  // border: 1px solid @border-color-light;
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
    width: 384px;
    height: 100px; // Fixed height for the cover image
    object-fit: cover;
    display: block; // Remove any extra space below image
  }

  // This div will hold title and description, allowing date to be pushed to bottom by flex-grow
  &__content {
    flex-grow: 1; // This makes this section take up available space, pushing date down
    padding: 15px 20px; // Padding is handled by body-style and individual elements if needed
  }

  &__title-link {
    text-decoration: none;
  }

  &__title {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0%;
    text-transform: uppercase;
    color: #333333;
    margin: 0 0 @spacing-sm 0; // Margin bottom for space before description
    transition: color 0.3s ease;
    // Text truncation for title (2 lines)
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
    // min-height needed to reserve space if title is short, ensuring description alignment
    // min-height: calc(1.4em * 2); // 1.4em is line-height * 2 lines
  }

  &__description {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0%;
    text-align: justify;
    color: #656C74;
    // Text truncation for description (3 lines)
    display: -webkit-box;
    -webkit-line-clamp: 2; // Show 3 lines
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    // min-height to reserve space for 3 lines, helps with consistent date positioning
  }

  &__date {
    font-size: 14px;
    text-align: right;
    color: @text-color-tertiary; // Lighter gray for the date
    line-height: 1; // Single line for date
    margin: 0; // Remove any default paragraph margin
    padding-top: @spacing-sm; // Space above date if description is short
    margin-top: auto; // This is an alternative to flex-grow on content if padding is inside body-style
                       // With flex-grow on __content, this can be removed or set to 0
  }

  // The :body-style on <a-card> controls the padding of the content area below the cover.
  // We set it to display:flex, flexDirection:column, and flexGrow:1
  // so that the internal __content div can push the __date to the bottom.
}
</style>