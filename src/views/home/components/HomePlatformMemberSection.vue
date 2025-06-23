<template>
  <section class="home-platform-member-section section-padding">
    <div class="container">
      <SectionHeader title-ch="会员名录" title-en="MEMBERSHIP" more-link="/members" />
      <div v-if="isLoading && pages.length === 0" class="loading-placeholder">
        <a-spin />
      </div>
      <div v-else-if="members.length === 0 && !isLoading" class="empty-placeholder">
        <a-empty description="暂无会员信息" :image-style="{ height: '60px' }" />
      </div>
      <div v-else class="paged-logo-wall-wrapper" ref="wallWrapperRef" @mouseenter="pauseAutoScroll" @mouseleave="resumeAutoScroll">
        <div
          class="logo-pages-container"
          ref="pagesContainerRef"
          :style="{
            width: `${containerTotalWidthPercentage}%`,
            transform: `translateX(-${currentTranslateXPercentage}%)`,
            transition: useCssTransition ? `transform ${transitionDurationMs}ms ease-in-out` : 'none'
          }"
        >
          <!-- Each 'page' contains two rows of logos -->
          <div
            v-for="(page, pageIndex) in pagesForDisplay"
            :key="`logo-page-${pageIndex}`"
            class="logo-page"
            :style="{ width: `${pageWidthPercentage}%` }"
          >
            <div class="logo-row">
              <a
                v-for="member in page.row1"
                :key="`p${pageIndex}-r1-${member.uniqueInstanceId}`"
                target="_blank"
                rel="noopener noreferrer"
                class="logo-item-link"
              >
                <img
                  :src="member.companyLogo ? getFileAccessHttpUrl(member.companyLogo) : defaultFallbackLogo"
                  :alt="member.companyName"
                  class="logo-image"
                />
              </a>
            </div>
            <div class="logo-row">
              <a
                v-for="member in page.row2"
                :key="`p${pageIndex}-r2-${member.uniqueInstanceId}`"
                :href="member.companyUrl || '#'"
                target="_blank"
                rel="noopener noreferrer"
                class="logo-item-link"
              >
                <img
                  :src="member.companyLogo ? getFileAccessHttpUrl(member.companyLogo) : defaultFallbackLogo"
                  :alt="member.companyName"
                  class="logo-image"
                />
              </a>
            </div>
          </div>
        </div>
        <!-- Optional: Pagination Dots (can be hidden if not desired for auto-scroll only) -->
        <!--
        <div v-if="actualTotalPages > 1" class="pagination-dots">
          <span
            v-for="dot in actualTotalPages"
            :key="`dot-${dot}`"
            :class="['dot', { active: dot - 1 === currentPageIndex }]"
            @click="goToPage(dot - 1)"
          ></span>
        </div>
        -->
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { Spin as ASpin, Empty as AEmpty } from 'ant-design-vue';
import SectionHeader from '@/components/common/SectionHeader.vue';
import defaultFallbackLogo from '@/assets/images/home/dosilicon-logo.png'; // Fallback logo
import defHttp from '@/utils/http/axios';
import { getFileAccessHttpUrl } from '@/utils/index';

const props = defineProps({
  autoScrollInterval: { type: Number, default: 4000 }, // Time each page is visible
  transitionDurationMs: { type: Number, default: 700 }, // Slide animation duration
  loopScroll: { type: Boolean, default: true },
  logosPerRow: { type: Number, default: 10 },
});

const members = ref([]);
const isLoading = ref(false);
const wallWrapperRef = ref(null);
const pagesContainerRef = ref(null);

const currentPageIndex = ref(0); // Current actual page index (0 to totalPages - 1)
const displayPageIndex = ref(0); // Index for transform, includes duplicated page for loop
let autoScrollTimer = null;
const useCssTransition = ref(false); // Control when CSS transition is active
let isPausedByHover = false;

const ITEMS_PER_PAGE = computed(() => props.logosPerRow * 2); // 2 rows * 10 logos/row = 20

// 1. Paginate the fetched members into pages, each page having row1 and row2
const pages = computed(() => {
  const p = [];
  if (!members.value || members.value.length === 0) return p;
  for (let i = 0; i < members.value.length; i += ITEMS_PER_PAGE.value) {
    const pageSlice = members.value.slice(i, i + ITEMS_PER_PAGE.value);
    p.push({
      row1: pageSlice.slice(0, props.logosPerRow).map((m, idx) => ({ ...m, uniqueInstanceId: `${m.id}-p${p.length}-r1-${idx}` })),
      row2: pageSlice.slice(props.logosPerRow, ITEMS_PER_PAGE.value).map((m, idx) => ({ ...m, uniqueInstanceId: `${m.id}-p${p.length}-r2-${idx}` })),
    });
  }
  return p;
});

const actualTotalPages = computed(() => pages.value.length);

const pagesForDisplay = computed(() => {
  if (props.loopScroll && actualTotalPages.value > 1) {
    // Duplicate the first page and add it to the end for seamless looping
    return [...pages.value, { ...pages.value[0], isDuplicate: true }];
  }
  return pages.value;
});

const containerTotalWidthPercentage = computed(() => {
  return pagesForDisplay.value.length * 100; // Each page takes 100% of wrapper width
});

const pageWidthPercentage = computed(() => {
  if (pagesForDisplay.value.length === 0) return 0;
  return 100 / pagesForDisplay.value.length;
});

const currentTranslateXPercentage = computed(() => {
  if (pagesForDisplay.value.length === 0) return 0;
  return displayPageIndex.value * pageWidthPercentage.value;
});

const canScroll = computed(() => members.value.length > ITEMS_PER_PAGE.value);

const advancePage = () => {
  if (!canScroll.value || isPausedByHover) return;

  useCssTransition.value = true; // Enable smooth slide transition
  displayPageIndex.value++;

  if (displayPageIndex.value >= pagesForDisplay.value.length) { // Reached the end (duplicate page)
    if (props.loopScroll) {
      // After the slide animation to the duplicate page completes...
      setTimeout(() => {
        if (isPausedByHover) return; // Check again in case user hovered during timeout
        useCssTransition.value = false; // Disable transition for the instant jump
        displayPageIndex.value = 0;    // Jump back to the actual first page
        currentPageIndex.value = 0;    // Sync actual page index
      }, props.transitionDurationMs);
    } else {
      // If not looping, and reached end, reset to first page (or stop)
      displayPageIndex.value = 0;
      currentPageIndex.value = 0;
    }
  } else {
    // Update current actual page index (for dots, if used)
    currentPageIndex.value = displayPageIndex.value % actualTotalPages.value;
  }
};

const goToPage = (pageIdx) => { // pageIdx is 0-based for actual pages
  if (!canScroll.value || pageIdx === currentPageIndex.value || pageIdx < 0 || pageIdx >= actualTotalPages.value) return;
  stopAutoScroll();
  useCssTransition.value = true;
  currentPageIndex.value = pageIdx;
  displayPageIndex.value = pageIdx; // Directly go to the actual page
  // Optionally restart auto-scroll after a delay
  if (props.autoScrollInterval > 0 && !isPausedByHover) {
    autoScrollTimer = setTimeout(startAutoScroll, props.autoScrollInterval * 1.5);
  }
};

const startAutoScroll = () => {
  if (!canScroll.value || props.autoScrollInterval <= 0) return;
  stopAutoScroll();
  autoScrollTimer = setInterval(advancePage, props.autoScrollInterval + props.transitionDurationMs);
};

const stopAutoScroll = () => {
  clearInterval(autoScrollTimer);
  autoScrollTimer = null;
};
const pauseAutoScroll = () => { if (canScroll.value) { isPausedByHover = true; stopAutoScroll(); }};
const resumeAutoScroll = () => { if (canScroll.value) { isPausedByHover = false; setTimeout(() => { if(!isPausedByHover) startAutoScroll(); }, 300); }};


const fetchMembers = async () => {
  isLoading.value = true;
  try {
    const res = await defHttp.get({ url: `/apm/sys/tenant/list/front`, params: { page: 1, pageSize: 60 } }); // Fetch enough for a few pages
    if (res.success) {
      members.value = (res.result || []).map(m => ({
        id: m.id || `tenant-${Math.random().toString(36).substr(2, 9)}`,
        companyName: m.companyName || m.name || '未知公司',
        companyLogo: m.companyLogo,
        companyUrl: m.companyUrl || '#',
      }));
      await nextTick(); // Ensure DOM updates before starting scroll
      if (canScroll.value) {
        startAutoScroll();
      }
    } else { members.value = []; }
  } catch (error) { console.error("Failed to fetch members:", error); members.value = []; }
  finally { isLoading.value = false; }
};

onMounted(() => {
  fetchMembers();
});
onBeforeUnmount(stopAutoScroll);

watch(() => props.items, () => { // If items prop were used directly
    useCssTransition.value = false;
    currentPageIndex.value = 0;
    displayPageIndex.value = 0;
    nextTick(() => { if (canScroll.value) startAutoScroll(); else stopAutoScroll(); });
}, { deep: true });

watch([() => props.autoScrollInterval, () => props.loopScroll], () => {
    if (canScroll.value) startAutoScroll(); else stopAutoScroll();
});

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.section-padding {
  padding: 10px;
  background-color: #FAFAFA;
}
.loading-placeholder, .empty-placeholder { /* ... as before ... */ }

.paged-logo-wall-wrapper {
  padding: 10px 5px;
  background-color: #fff;
  width: 100%;
  overflow: hidden; // This is crucial for the sliding effect
  position: relative; // For absolute positioned elements like dots (if any)
  // Calculate min-height based on 2 rows of logos
  min-height: (40px * 2) + 10px; // (logo-height * 2) + gap-between-rows
}

.logo-pages-container {
  display: flex;
  height: 100%; // Or ((40px * 2) + 10px) if wrapper has fixed height
  // `width`, `transform`, `transition` are applied via inline style
}

.logo-page {
  flex-shrink: 0; // Prevent pages from shrinking
  box-sizing: border-box;
  // `width` is set by inline style (pageWidthPercentage)
  display: flex;
  flex-direction: column;
  justify-content: flex-start; // Align rows to the top of the page
  gap: 10px; // Space between the two logo rows within a page
  padding: 0 @spacing-xs; // Small horizontal padding for the page itself if needed
}

.logo-row {
  display: flex;
  // flex-wrap: nowrap; // Logos should not wrap within their row, container slides
  align-items: center;
  // width: 100%; // Row takes full width of its page column
  // The number of items per row is controlled by slice in `pages` computed
}

.logo-item-link {
  display: flex; // To center image within the link
  align-items: center;
  justify-content: center;
  width: 110px;
  height: 40px;
  box-sizing: border-box;
  background-color: @background-color-base; // White background for each logo item
  transition: border-color 0.2s, box-shadow 0.2s;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    // border-color: darken(#E5E6EB, 10%); // Optional: Slightly darker border on hover
    // box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    .logo-image {
      filter: grayscale(0%);
      opacity: 1;
    }
  }
}

.logo-image {
  max-width: 100%;
  max-height: 100%;
  min-height: 40px;
  min-width: 110px;
  width: 110px;
  height: 40px;
  object-fit: contain;
  // filter: grayscale(100%);
  // opacity: 0.65; // Slightly less opaque than before to match image
  // transition: filter 0.3s ease, opacity 0.3s ease;
}

// Optional Pagination Dots (if you decide to show them)
.pagination-dots {
  position: absolute;
  bottom: -15px; // Below the logo area
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  padding-top: @spacing-sm;

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #D9D9D9; // Inactive dot
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover { background-color: darken(#D9D9D9, 15%);}
    &.active { background-color: @primary-color; } // Active dot
  }
}
</style>