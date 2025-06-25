<template>
  <div class="scrolling-news-list-wrapper" ref="wrapperRef">
    <div
      class="news-items-sliding-container"
      ref="containerRef"
      :style="{
        width: `${containerWidthPercentage}%`,
        transform: `translateX(-${currentTranslateXPercentage}%)`,
        transition: useTransition ? `transform ${props.transitionDuration}ms ease-in-out` : 'none'
      }"
    >
      <div
        v-for="(pageItems, pageIndex) in paginatedItemSets"
        :key="`page-${pageIndex}`"
        class="news-page-item-group"
        :style="{ width: `${pageWidthPercentage}%` }"
      >
        <!--
          Using transition-group here means the whole block of items fades in/out
          when the page changes. If you wanted individual item transitions (e.g., items being added/removed
          within a page), you would place the transition-group directly around the `news-item-entry` divs.
          Given the page-based structure, fading the whole group is likely intended.
        -->
        <transition-group
          :name="itemTransitionName"
          tag="div"
          class="news-item-list-for-fade"
        >
          <div
            v-for="(item, index) in pageItems"
            :key="item.id || item.message || index"
            class="news-item-entry"
            @click="() => onItemClick(item)"
          >
            <span class="news-item-entry-text">{{ item.content || item.message }}</span>
            <span class="news-item-entry-date">{{ item.createTime ? formatDate(item.createTime) : '' }}</span>
          </div>
        </transition-group>
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination-dots-footer">
      <!-- Pagination dots should reflect the real page index (0 to totalPages - 1) -->
      <span
        v-for="pageDotIndex in totalPages"
        :key="pageDotIndex"
        :class="['dot-indicator', { 'dot--active': (pageDotIndex - 1) === (currentPageIndex % totalPages) }]"
        @click="goToPage(pageDotIndex - 1)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
// Ensure formatDate is correctly imported from your utils path
import {formatDate} from '@/utils';

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  itemsPerPage: {
    type: Number,
    default: 5,
  },
  autoCycleInterval: {
    type: Number,
    default: 4000, // Interval for auto-sliding
  },
  transitionDuration: { // For the slide of the container
    type: Number,
    default: 500,
  },
  itemFadeDuration: { // For fade of items within a page (can be shorter)
      type: Number,
      default: 300
  },
  loop: { // Whether to loop back to the start after the last page
      type: Boolean,
      default: true,
  }
});

const emit = defineEmits(['itemClick']);

const containerRef = ref(null);
const wrapperRef = ref(null);
// currentPageIndex tracks the index in the *paginatedItemSets* array (includes the duplicate if looping)
const currentPageIndex = ref(0);
let cycleTimer = null;
// useTransition controls whether the CSS transition is active for the container transform
const useTransition = ref(false);

// Prepare sets of items for each "page"
const paginatedItemSets = computed(() => {
  const pages = [];
  if (!props.items || props.items.length === 0) return pages;
  for (let i = 0; i < props.items.length; i += props.itemsPerPage) {
    pages.push(props.items.slice(i, i + props.itemsPerPage));
  }
  // For seamless looping, add the first page at the end IF there's more than one unique page
  if (props.loop && pages.length > 1) {
      pages.push([...pages[0]]); // Add a copy of the first page
  }
  return pages;
});

// The actual number of unique pages (used for pagination dots)
const totalPages = computed(() => {
  if (!props.items || props.items.length === 0) return 0;
  return Math.ceil(props.items.length / props.itemsPerPage);
});

// Total number of item sets including the potential duplicate for looping (used for layout calculations)
const totalSetsIncludingDuplicate = computed(() => paginatedItemSets.value.length);


const containerWidthPercentage = computed(() => {
    // The container needs to be wide enough to hold all sets side-by-side
    return totalSetsIncludingDuplicate.value > 0 ? totalSetsIncludingDuplicate.value * 100 : 0;
});
const pageWidthPercentage = computed(() => {
    // Each page/set takes up 100% of the wrapper width, but is a fraction of the container width
    return totalSetsIncludingDuplicate.value > 0 ? 100 / totalSetsIncludingDuplicate.value : 100; // Default to 100% if only one set or empty
});

// Controls the transform property to slide the container
const currentTranslateXPercentage = computed(() => {
    // Avoid division by zero if totalSetsIncludingDuplicate is 0
    if (totalSetsIncludingDuplicate.value === 0) return 0;
    return currentPageIndex.value * (100 / totalSetsIncludingDuplicate.value);
});

// Transition name for items fading within a page
const itemTransitionName = ref('fade-group');


// Advances to the next page set
const advancePage = () => {
  const totalSets = totalSetsIncludingDuplicate.value;
  // If there are 0 or 1 sets (no unique pages, or only 1 unique page), do nothing
  if (totalSets <= 1) return;

  const nextIndex = currentPageIndex.value + 1;

  // Check if we've reached the index *after* the last set (which is the duplicated first page's index if looping)
  if (nextIndex >= totalSets) {
      // If looping is enabled, slide to the duplicated page, then jump back
      if (props.loop) {
          // 1. Start the slide animation to the duplicated page
          useTransition.value = true;
          currentPageIndex.value = nextIndex; // Move to the index of the duplicated page

          // 2. After the slide animation finishes, instantly jump back to the first real page
          setTimeout(() => {
              useTransition.value = false; // Disable transition for the jump
              currentPageIndex.value = 0; // Jump back to the index of the real first page

              // Wait for the DOM update after the jump before re-enabling transition.
              // This ensures the state is settled before the next slide potentially starts.
              nextTick(() => {
                 // Re-enable transition for the *next* slide (0 -> 1)
                 // This must be true before the *next* interval tick calls advancePage again
                 useTransition.value = true;
              });

          }, props.transitionDuration);

      } else {
          // If not looping, and we reached the end of the unique pages, jump back to the first page instantly.
          // The auto-cycle will continue from page 0.
          useTransition.value = false; // Disable transition for the jump
          currentPageIndex.value = 0;
          // No need for nextTick/re-enabling transition here, as the next advancePage call
          // by the timer will handle setting useTransition for the slide from 0 to 1.
      }
  } else {
      // Normal slide to the next page (not the jump back case)
      useTransition.value = true; // Ensure transition is on
      currentPageIndex.value = nextIndex;
  }
};

// Goes to a specific unique page index (0-based index relative to totalPages)
const goToPage = (pageIndex) => {
  // Ensure the requested pageIndex is valid for unique pages (0 to totalPages - 1)
  if (pageIndex < 0 || pageIndex >= totalPages.value) {
      console.warn(`goToPage called with invalid index: ${pageIndex}. Total pages: ${totalPages.value}`);
      return;
  }

  // Get the current real page index, considering if we're on the duplicated page
  const currentRealPageIndex = currentPageIndex.value % totalPages.value;

  // If we are already on the target real page, do nothing unless we are currently
  // sitting on the duplicated last page (index == totalPages) and they clicked dot 0.
  // In that specific case (on duplicated page, click dot 0), we are visually there,
  // so just stop the timer and don't trigger a slide.
  if (pageIndex === currentRealPageIndex && currentPageIndex.value !== totalPages.value) {
      return;
  }

  stopCycle(); // Stop auto-cycling on manual navigation
  useTransition.value = true; // Ensure transition is enabled for manual slide
  currentPageIndex.value = pageIndex; // Set the index to the target unique page

  // Optional: restart auto-cycle after a delay following manual navigation
  // This can be disruptive, so it's often better to leave the cycle stopped
  // or only restart after a period of inactivity.
  // setTimeout(startCycle, props.autoCycleInterval * 1.5);
};

// Starts the auto-cycle timer
const startCycle = () => {
    // Only start if autoCycleInterval is positive AND there's more than one unique page.
    // Cycling a single page (even with loop=true) doesn't make sense.
    if (props.autoCycleInterval <= 0 || totalPages.value <= 1 ) {
        stopCycle(); // Ensure timer is stopped if conditions aren't met
        return;
    }

    stopCycle(); // Clear any existing timer
    // Set the interval to wait for the display duration + the transition duration
    // This ensures the next slide starts only after the current one finishes
    cycleTimer = setInterval(advancePage, props.autoCycleInterval + props.transitionDuration);
};

// Stops the auto-cycle timer
const stopCycle = () => {
  clearInterval(cycleTimer);
  cycleTimer = null;
};

const onItemClick = (item) => {
  emit('itemClick', item);
};

// --- Lifecycle Hooks and Watchers ---

onMounted(() => {
  // Ensure the DOM elements are available before attempting calculations or starting the cycle
  nextTick(() => {
    // Start auto-cycle only if there are multiple pages and interval is positive
    if (totalPages.value > 1 && props.autoCycleInterval > 0) {
      startCycle();
    }
    // Initial state: currentPageIndex is 0, useTransition is false.
    // This is correct. The first `advancePage` call from the timer will set useTransition to true for the first slide (0 -> 1).
  });
});

onBeforeUnmount(() => {
  stopCycle(); // Clean up timer when component is destroyed
});

// Watch for changes in the items array
watch(() => props.items, () => {
  // When items change, reset to the first page without animation
  useTransition.value = false;
  currentPageIndex.value = 0; // Reset index to the first real page
  // Allow DOM to update after reset
  nextTick(() => {
    // Restart or stop the cycle based on the new item list
    if (totalPages.value > 1 && props.autoCycleInterval > 0) {
      startCycle();
    } else {
      stopCycle();
    }
  });
}, { deep: true }); // Use deep watch if item properties inside array can change, otherwise shallow is fine

// Watch for changes in the autoCycleInterval prop
watch(() => props.autoCycleInterval, (newInterval) => {
    stopCycle(); // Stop current timer
    // Restart if the new interval is positive and conditions for cycling are met
    if (newInterval > 0 && totalPages.value > 1) {
        startCycle();
    }
});

// Watch for changes in the loop prop
// If loop changes, the paginatedItemSets computed property changes, which
// will trigger the items watcher above, causing a reset and cycle restart.
// So, a separate watcher for 'loop' might not be strictly necessary,
// but including one makes the intention explicit if loop could change independently.
watch(() => props.loop, () => {
     // When loop changes, the number of sets might change (adds/removes duplicate).
     // Resetting and restarting the cycle is the safest approach.
     useTransition.value = false;
     currentPageIndex.value = 0;
      nextTick(() => {
         if (totalPages.value > 1 && props.autoCycleInterval > 0) {
             startCycle();
         } else {
             stopCycle();
         }
     });
});

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less'; // Adjust path as needed

.scrolling-news-list-wrapper {
  border: 1px solid #EAEAEA;
  background-color: #fff;
  overflow: hidden;
  position: relative;
  width: 100%;
  // Calculate min-height based on itemsPerPage and item height/padding
  // Assuming item height + padding is approx (14px line-height + 2*10px padding) = 34px
  // 5 items * 34px + top/bottom padding (e.g., 16px*2) + border (4*1px) = 170 + 32 + 4 = 206px
  // The 222px seems reasonable, ensures space for 5 items.
  min-height: 222px;
}

.news-items-sliding-container {
  display: flex;
  height: 100%; // Ensure it takes up the wrapper's height
  // `width`, `transform`, and `transition` are applied via inline style
  // `transition` is conditionally applied based on `useTransition` ref
}

.news-page-item-group {
  padding: 16px 30px;
  flex-shrink: 0; // Each page group takes its allocated width
  box-sizing: border-box;
  height: 100%; // Take full height of container
  // width is set by inline style (pageWidthPercentage)
  // This div will contain 5 news items
}

.news-item-list-for-fade {
    // This div is rendered by transition-group.
    // It should also take full height to contain items vertically.
    height: 100%;
    display: flex;
    flex-direction: column; // Stack items vertically
    justify-content: space-around; // Distribute space evenly
}

.news-item-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dotted #E8E8E8;
  cursor: pointer;
  // flex-basis: 0; flex-grow: 1; // Consider making items flexible to fill height if needed
  min-height: 34px; // Ensure consistent height even if text is short

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    .news-item-entry-text {
      color: @primary-color;
    }
  }

  .news-item-entry-text {
    flex-grow: 1;
    color: #333333;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.2; // Use relative line-height
    // letter-spacing: 0%; // Often not needed unless specific design requires
    text-transform: uppercase;
    padding-right: @spacing-md;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block; // Ensure padding/margin work correctly
  }

  .news-item-entry-date {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.2; // Use relative line-height
    // letter-spacing: 0%;
    text-align: right;
    text-transform: uppercase;
    color: #333333;
    flex-shrink: 0; // Prevent date from shrinking
    margin-left: auto; // Push date to the right
  }
}

.pagination-dots-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px; // Add some space above dots
  margin-bottom: 10px;
  margin-right: 10px; // Align dots to the right, inside padding area maybe? Or let it be outside page padding? Current CSS puts it outside the 30px page padding. Keep it like this.
  gap: 8px;

  .dot-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #D9D9D9;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
    &:hover { background-color: darken(#D9D9D9, 20%); }
    &.dot--active { background-color: @primary-color; transform: scale(1.1); }
  }
}

// --- Transitions for items within a page when page changes ---
// Applies to the entire list of items inside .news-item-list-for-fade
.fade-group-enter-active,
.fade-group-leave-active {
  transition: opacity v-bind("`${props.itemFadeDuration}ms`") ease;
}
.fade-group-enter-from,
.fade-group-leave-to {
  opacity: 0;
}

// Optional: If you wanted individual items to transition when their position changes (move transition)
/*
.fade-group-move {
  transition: transform v-bind("`${props.itemFadeDuration}ms`") ease;
}
*/

</style>