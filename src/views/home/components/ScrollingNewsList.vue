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
        <transition-group
          :name="itemTransitionName"
          tag="div"
          class="news-item-list-for-fade"
        >
          <div
            v-for="item in pageItems"
            :key="item.id"
            class="news-item-entry"
            @click="() => onItemClick(item)"
          >
            <span class="news-item-entry-text">{{ item.text }}</span>
            <span class="news-item-entry-date">{{ item.date }}</span>
          </div>
        </transition-group>
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination-dots-footer">
      <span
        v-for="pageDotIndex in totalPages"
        :key="pageDotIndex"
        :class="['dot-indicator', { 'dot--active': pageDotIndex - 1 === currentPageIndex }]"
        @click="goToPage(pageDotIndex - 1)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

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
const currentPageIndex = ref(0);
let cycleTimer = null;
const useTransition = ref(false); // Control when to use CSS transition for sliding

// Prepare sets of items for each "page"
const paginatedItemSets = computed(() => {
  const pages = [];
  if (!props.items || props.items.length === 0) return pages;
  for (let i = 0; i < props.items.length; i += props.itemsPerPage) {
    pages.push(props.items.slice(i, i + props.itemsPerPage));
  }
  // For seamless looping, add the first page at the end if looping is enabled
  if (props.loop && pages.length > 1) {
      pages.push([...pages[0]]);
  }
  return pages;
});

const totalPages = computed(() => { // Actual number of unique pages
  if (!props.items || props.items.length === 0) return 0;
  return Math.ceil(props.items.length / props.itemsPerPage);
});

const containerWidthPercentage = computed(() => {
    return paginatedItemSets.value.length * 100; // Each page is 100% of wrapper width
});
const pageWidthPercentage = computed(() => {
    return 100 / paginatedItemSets.value.length;
});
const currentTranslateXPercentage = computed(() => {
    return currentPageIndex.value * (100 / paginatedItemSets.value.length);
});


const itemTransitionName = ref('fade-group'); // For items fading in/out


const advancePage = async () => {
  if (totalPages.value <= 1 && !props.loop) return; // No need to advance if only one page and no loop

  useTransition.value = true; // Enable transition for sliding
  currentPageIndex.value++;

  if (currentPageIndex.value >= paginatedItemSets.value.length) { // Reached the duplicated first page (if looping)
    if (props.loop) {
        // After slide animation to duplicated page completes:
        setTimeout(() => {
            useTransition.value = false; // Disable transition for instant jump
            currentPageIndex.value = 0; // Jump back to the actual first page
            // Force reflow if needed before re-enabling transition
            // if (containerRef.value) void containerRef.value.offsetWidth;
        }, props.transitionDuration);
    } else {
        currentPageIndex.value = 0; // Or stop, or go to first page without duplication logic
    }
  }
};

const goToPage = (pageIndex) => {
  if (pageIndex === currentPageIndex.value || pageIndex < 0 || pageIndex >= totalPages.value) return;
  stopCycle();
  useTransition.value = true;
  currentPageIndex.value = pageIndex;
  if (props.autoCycleInterval > 0) {
    // Optional: restart auto-cycle after manual navigation
    // cycleTimer = setTimeout(startCycle, props.autoCycleInterval * 1.5);
  }
};

const startCycle = () => {
  if (props.autoCycleInterval <= 0 || (totalPages.value <= 1 && !props.loop) ) return;
  stopCycle();
  cycleTimer = setInterval(advancePage, props.autoCycleInterval + props.transitionDuration);
};

const stopCycle = () => {
  clearInterval(cycleTimer);
  cycleTimer = null;
};

const onItemClick = (item) => {
  emit('itemClick', item);
};

onMounted(() => {
  nextTick(() => { // Ensure DOM is ready
    if (totalPages.value > 1 || props.loop) {
      startCycle();
    }
  });
});

onBeforeUnmount(() => {
  stopCycle();
});

watch(() => props.items, () => {
  useTransition.value = false; // Disable transition during reset
  currentPageIndex.value = 0;
  nextTick(() => {
    if (totalPages.value > 1 || props.loop) {
      startCycle();
    } else {
      stopCycle();
    }
  });
}, { deep: true });

watch(() => props.autoCycleInterval, () => {
    if (totalPages.value > 1 || props.loop) {
        startCycle();
    } else {
        stopCycle();
    }
});

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.scrolling-news-list-wrapper {
    background-color: #fff;
  // width: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
  // min-height: ... (as before, calculate based on 5 items)
  min-height: 222px;

}

.news-items-sliding-container {
  display: flex;
  height: 100%; // Ensure it takes up the wrapper's height
  // `transform` and `transition` are applied via inline style from script
}

.news-page-item-group {
  padding: 16px 30px;
  flex-shrink: 0; // Each page group takes its allocated width
  box-sizing: border-box;
  // width is set by inline style (pageWidthPercentage)
  // This div will contain 5 news items
  // For fade effect, items within this might transition opacity
}

.news-item-list-for-fade {
    // This div is rendered by transition-group
}

.news-item-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0; // Adjusted padding to match image more closely
  border-bottom: 1px dotted #E8E8E8;
  cursor: pointer;

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
    line-height: 14px;
    letter-spacing: 0%;
    text-transform: uppercase;
    padding-right: @spacing-md;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .news-item-entry-date {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0%;
    text-align: right;
    text-transform: uppercase;
    color: #333333;
    flex-shrink: 0;
  }
}

.pagination-dots-footer {
  // Styles remain the same as your previous correctly styled version
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
  margin-right: 10px;
//   padding-top: @spacing-sm + 2px;
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
// This fade is for the items list as a whole block if the key of the page changes.
// For individual item fade-in/out, transition-group is used.
.fade-group-enter-active,
.fade-group-leave-active {
  transition: opacity v-bind("`${props.itemFadeDuration}ms`") ease;
}
.fade-group-enter-from,
.fade-group-leave-to {
  opacity: 0;
}

// If you wanted items to slide-fade individually within the page (more complex):
.item-slide-fade-enter-active,
.item-slide-fade-leave-active {
  transition: all v-bind("`${props.itemFadeDuration}ms`") ease;
}
.item-slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.item-slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.item-slide-fade-leave-active { // For elements being removed from list
  position: absolute; // Avoids jumpy behavior in flex/grid
  width: calc(v-bind(pageWidthPercentage) - @spacing-md); // Approximate width
}

</style>