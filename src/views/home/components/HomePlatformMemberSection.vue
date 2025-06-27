<template>
  <section class="home-platform-member-section section-padding">
    <div class="container">
      <SectionHeader title-ch="会员名录" title-en="MEMBERSHIP" more-link="/other/platformMember" />
      <div v-if="isLoading && members.length === 0" class="loading-placeholder">
        <a-spin />
      </div>
      <div v-else-if="members.length === 0 && !isLoading" class="empty-placeholder">
        <a-empty description="暂无会员信息" :image-style="{ height: '60px' }" />
      </div>
      <!-- Two-row Marquee-style Logo Wall -->  
      <div v-else class="marquee-wrapper-container">
        <div
          class="marquee-wrapper"
          @mouseenter="isPaused = true"
          @mouseleave="isPaused = false"
        >
          <div
            class="marquee-track"
            :class="{ 'is-scrolling': canScroll }"
            :style="trackStyle"
          >
            <!-- Render the columns of logos once -->
            <div
              v-for="column in logoColumns"
              :key="`col1-${column.top.id}`"
              class="logo-column"
            >
              <!-- Top Row Logo -->
              <a
                :href="column.top.companyUrl || '#'"
                target="_blank"
                rel="noopener noreferrer"
                class="logo-item-link"
              >
                <img
                  :src="column.top.companyLogo ? getFileAccessHttpUrl(column.top.companyLogo) : defaultFallbackLogo"
                  :alt="column.top.companyName"
                  class="logo-image"
                />
              </a>
              <!-- Bottom Row Logo (only if it exists) -->
              <a
                v-if="column.bottom"
                :href="column.bottom.companyUrl || '#'"
                target="_blank"
                rel="noopener noreferrer"
                class="logo-item-link"
              >
                <img
                  :src="column.bottom.companyLogo ? getFileAccessHttpUrl(column.bottom.companyLogo) : defaultFallbackLogo"
                  :alt="column.bottom.companyName"
                  class="logo-image"
                />
              </a>
              <!-- Placeholder for alignment if bottom logo doesn't exist -->
              <div v-else class="logo-item-placeholder"></div>
            </div>

            <!-- Render the same columns again ONLY if scrolling, for the seamless loop -->
            <template v-if="canScroll">
              <div
                v-for="column in logoColumns"
                :key="`col2-${column.top.id}`"
                class="logo-column"
                aria-hidden="true"
              >
                <!-- Top Row Logo -->
                <a
                  :href="column.top.companyUrl || '#'"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="logo-item-link"
                >
                  <img
                    :src="column.top.companyLogo ? getFileAccessHttpUrl(column.top.companyLogo) : defaultFallbackLogo"
                    :alt="column.top.companyName"
                    class="logo-image"
                  />
                </a>
                <!-- Bottom Row Logo (only if it exists) -->
                <a
                  v-if="column.bottom"
                  :href="column.bottom.companyUrl || '#'"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="logo-item-link"
                >
                  <img
                    :src="column.bottom.companyLogo ? getFileAccessHttpUrl(column.bottom.companyLogo) : defaultFallbackLogo"
                    :alt="column.bottom.companyName"
                    class="logo-image"
                  />
                </a>
                <!-- Placeholder for alignment -->
                <div v-else class="logo-item-placeholder"></div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Spin as ASpin, Empty as AEmpty } from 'ant-design-vue';
import SectionHeader from '@/components/common/SectionHeader.vue';
import defaultFallbackLogo from '@/assets/images/home/dosilicon-logo.png';
import defHttp from '@/utils/http/axios';
import { getFileAccessHttpUrl } from '@/utils/index';

const props = defineProps({
  // Total number of items required to start the scrolling animation
  scrollThreshold: { type: Number, default: 20 },
  // Adjust this to control speed. Higher value = slower scroll.
  // This now represents seconds per COLUMN.
  secondsPerColumn: { type: Number, default: 2.5 },
});

const members = ref([]);
const isLoading = ref(false);
const isPaused = ref(false);

// Determines if the number of members is enough to start the scroll animation
const canScroll = computed(() => members.value.length > props.scrollThreshold);

// NEW: Transform the flat member list into a list of columns for two-row display
const logoColumns = computed(() => {
  const columns = [];
  const source = members.value;
  if (!source || source.length === 0) return [];

  for (let i = 0; i < source.length; i += 2) {
    columns.push({
      top: source[i],
      bottom: source[i + 1] || null, // Handle odd number of members
    });
  }
  return columns;
});

// Dynamically computes the style for the track element
const trackStyle = computed(() => {
  if (!canScroll.value) return {};

  // Calculate duration based on the number of COLUMNS
  const duration = logoColumns.value.length * props.secondsPerColumn;

  return {
    '--scroll-duration': `${duration}s`,
    'animation-play-state': isPaused.value ? 'paused' : 'running',
  };
});

const fetchMembers = async () => {
  isLoading.value = true;
  try {
    const res = await defHttp.get({ url: `/apm/sys/tenant/list/front`, params: { page: 1, pageSize: 60 } });
    if (res.success) {
      members.value = (res.result || []).map(m => ({
        id: m.id || `tenant-${Math.random().toString(36).substr(2, 9)}`,
        companyName: m.companyName || m.name || '未知公司',
        companyLogo: m.companyLogo,
        companyUrl: m.companyUrl || '#',
      }));
    } else {
      members.value = [];
    }
  } catch (error) {
    console.error("Failed to fetch members:", error);
    members.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchMembers();
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

// Animation definition remains the same
@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.section-padding { 
  margin-top: 20px;
  margin-bottom: 20px;
}
.loading-placeholder, .empty-placeholder {
  min-height: 120px; /* Adjusted for two rows */
  display: flex;
  align-items: center;
  justify-content: center;
}

.marquee-wrapper {
  width: 100%;
  overflow: hidden;

  padding: 10px 0;
  // min-height: 110px; // (logo_height * 2) + vertical_gap
  @media (prefers-reduced-motion: reduce) {
    .marquee-track {
      animation: none !important;
      // If no animation, allow columns to wrap to next line
      flex-wrap: wrap;
      justify-content: center;
    }
  }
}

.marquee-track {
  display: flex;
  width: fit-content;

  &.is-scrolling {
    animation: marquee-scroll var(--scroll-duration, 60s) linear infinite;
  }
}

// NEW: Style for the vertical column container
.logo-column {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px; // Vertical gap between the two logos
  margin-right: 20px; // Horizontal gap between columns
  flex-shrink: 0;
}

.logo-item-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110px;
  height: 40px;
  box-sizing: border-box;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
}

// NEW: A placeholder to maintain alignment when a column has only one logo
.logo-item-placeholder {
  width: 110px;
  height: 40px;
}

.logo-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.marquee-wrapper-container{
  padding: 0 15px;
  background-color: #fff;
  border: 1px solid #EAEAEA;
}
</style>