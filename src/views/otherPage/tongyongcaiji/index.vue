<template>
  <div class="platform-members-page-wrapper">
    <div class="container content-container">
      <div class="page-title-section">
        <h1 class="page-title">通用件集采</h1>
      </div>
      <div class="members-logo-grid">
        <!-- <div
          v-for="(member, index) in members"
          :key="member.id || `member-${index}`"
          class="member-logo-item-wrapper"
        >
          <a :href="member.companyUrl || '#'" target="_blank" rel="noopener noreferrer" class="logo-link">
            <img
              :src="member.companyLogo ? getFileAccessHttpUrl(member.companyLogo) : defaultFallbackLogo"
              :alt="member.companyName || '通用件集采'"
              class="member-logo-image"
              @error="handleImageError"
            />
          </a>
        </div> -->
        <div class="member-logo-item-wrapper" @click="xxx">
            <img src="@/assets/images/home/PromoCard1.png" alt="通用件集采" class="member-logo-image" />
        </div>
          <div class="member-logo-item-wrapper" @click="xxx">
            <img src="@/assets/images/home/PromoCard2.png" alt="通用件集采" class="member-logo-image" />
        </div>
      </div>
      <!-- <div v-if="isLoading && members.length === 0" class="loading-placeholder">
        <a-spin size="large" />
      </div>
      <div v-else-if="members.length > 0" class="members-logo-grid">
        <div
          v-for="(member, index) in members"
          :key="member.id || `member-${index}`"
          class="member-logo-item-wrapper"
        >
          <a :href="member.companyUrl || '#'" target="_blank" rel="noopener noreferrer" class="logo-link">
            <img
              :src="member.companyLogo ? getFileAccessHttpUrl(member.companyLogo) : defaultFallbackLogo"
              :alt="member.companyName || '通用件集采'"
              class="member-logo-image"
              @error="handleImageError"
            />
          </a>
        </div>
      </div>
      <div v-else class="empty-placeholder">
        <a-empty description="暂无通用件集采信息" />
      </div> -->
       <!-- Optional: Pagination if pageSize is not 999 -->
       <!-- <div v-if="!isLoading && totalMembers > pageSize" class="pagination-container">
        <a-pagination
          v-model:current="currentPage"
          :total="totalMembers"
          :page-size="pageSize"
          @change="handlePageChange"
          show-less-items
        />
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Spin as ASpin, Empty as AEmpty, Pagination as APagination, message } from 'ant-design-vue';
import defHttp from '@/utils/http/axios'; // Your Axios instance
import { getFileAccessHttpUrl } from '@/utils/index'; // Your utility for image URLs
import defaultFallbackLogo from '@/assets/images/home/dosilicon-logo.png'; // Fallback logo

const members = ref([]);
const isLoading = ref(false);
// For pagination, if not fetching all at once
// const currentPage = ref(1);
// const pageSize = ref(32); // e.g., 8 rows * 4 columns
// const totalMembers = ref(0);

const fetchMembers = async (/*page = 1*/) => {
  isLoading.value = true;
  try {
    const res = await defHttp.get({
      url: `/apm/sys/tenant/list/front`,
      params: {
        page: 1, // currentPage.value,
        pageSize: 999, // pageSize.value - Fetch all as per your API call
        // Add other necessary params like status: 'approved' etc.
      }
    });
    if (res.success) {
      // Ensure each member has a unique key for v-for, even if ID is missing
      members.value = (res.result?.records || res.result || []).map((m, index) => ({
        id: m.id || `member-placeholder-${index}`, // Use actual ID or generate one
        companyLogo: m.companyLogo,
        companyName: m.companyName || m.name || `会员 ${index + 1}`, // For alt text
        companyUrl: m.companySite || '#', // Link to company website if available
      }));
      // totalMembers.value = res.result?.total || 0; // If API returns total for pagination
    } else {
      members.value = [];
      // totalMembers.value = 0;
    }
  } catch (error) {
    console.error("Failed to fetch platform members:", error);
    members.value = [];
    // totalMembers.value = 0;
  } finally {
    isLoading.value = false;
  }
};

// const handlePageChange = (page) => {
//   currentPage.value = page;
//   fetchMembers(page);
// };

const handleImageError = (event) => {
    // Fallback to placeholder if the primary logo fails to load
    event.target.src = defaultFallbackLogo;
};
const xxx = () => {
    message.info('网站建设中,敬请期待');
}


onMounted(() => {
  fetchMembers();
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.platform-members-page-wrapper {
 background-color: @background-color-base; // Assuming a white page background
  padding: 20px 26px; // Generous top and bottom padding for the page
  min-height: 580px; // Attempt to fill space
}

.content-container {
  // .container handles max-width and centering
}

.page-title-section {
  margin-bottom: 20px; // ~32px space below title section
  padding-bottom: @spacing-sm; // Space for the red underline
  border-bottom: 1px solid @border-color-light; // Full-width light gray line
  position: relative; // For the red accent line

  .page-title {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 24px;
    letter-spacing: 0%;
    color: #656C74;
    margin: 0;
    display: inline-block;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -@spacing-sm - 1px;
      width: 100%;
      height: 2px;
      background-color: @primary-color;
    }
  }
}

.loading-placeholder, .empty-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: @spacing-xl;
}

.members-logo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); // 4 columns as per image
  // Gap between items - calculated based on image (items are close)
  gap: 50px; // row-gap column-gap (e.g., 16px vertical, 24px horizontal)
                              // From image, vertical gap is larger than horizontal. Let's try:
                              // gap: 24px 16px; // row-gap (vertical) column-gap (horizontal)

  // More precise gap control to match image:
  // row-gap: 28px; // Vertical space between rows of logos
  column-gap: 30px; // Horizontal space between logos in a row

  @media (max-width: 992px) { // Tablet: 3 columns
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) { // Small Tablet/Large Mobile: 2 columns
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) { // Mobile: 1 or 2 columns based on preference
    grid-template-columns: repeat(2, 1fr); // Sticking to 2 for very small seems okay
    // Or grid-template-columns: 1fr; for single column
  }
}

.member-logo-item-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 110px; // Fixed height for the logo container to align rows
  // width: 250px;
  background-color: transparent; // No background per item, just image on page bg
  // border: 1px solid @border-color-light; // Image does not show individual borders
  // padding: @spacing-sm; // Padding inside the item wrapper
  box-sizing: border-box;
  overflow: hidden; // Ensure image doesn't overflow its container

  .logo-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%; // Link takes full space of the item wrapper
      height: 100%;
  }

  .member-logo-image {
    max-width: 100%; // Max width relative to its container (1/4 of grid width - gap)
    // max-height: 110px; // Max height for the logo image itself (as per prev examples)
    object-fit: contain; // Scale down to fit, maintain aspect ratio
    // filter: grayscale(100%); // Grayscale as per image
    // opacity: 0.7; // Slightly faded
    transition: filter 0.3s ease, opacity 0.3s ease, transform 0.2s ease;

    &:hover {
      filter: grayscale(0%);
      opacity: 1;
      transform: scale(1.05); // Slight zoom on hover
    }
  }
}
.pagination-container {
    margin-top: @spacing-xl;
    text-align: center;
}
</style>