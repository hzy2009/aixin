<template>
  <div class="horizontal-sliding-items-wrapper" ref="wrapperRef">
    <div
      class="sliding-container"
      ref="containerRef"
      :style="{
        width: `${containerWidthPercentage}%`,
        transform: `translateX(-${currentTranslateXPercentage}%)`,
        transition: useTransition ? `transform ${transitionDurationMs}ms ease-in-out` : 'none'
      }"
      @mouseenter="pauseCycle"
      @mouseleave="resumeCycle"
    >
      <div
        v-for="(pageItems, pageIndex) in itemPagesForDisplay"
        :key="`h-page-${pageIndex}`"
        class="item-page-group"
        :style="{ width: `${pageGroupWidthPercentage}%` }"
      >
        <div
          v-for="item in pageItems"
          :key="item.id"
          class="breakthrough-style-item"
          @click="() => onItemClick(item)"
        >
          <div class="item-icon-area">
              <img src="@/assets/images/home/rightIcon.png" alt="">
          </div>
          <div class="item-text-content">
            <div class="item-main-text">
              <div v-html="item.content"></div>
            </div>
          </div>
          <!-- Date is now a separate element before the action button's container -->
          <div class="item-date-column">
            <span class="item-date-text">{{ item.createTime ? formatDate(item.createTime) : '' }}</span>
          </div>
          <div class="item-action-column">
            <a-button type="link" class="action-link" @click.stop="() => onActionClick(item)">
              {{ item.actionText || '点击联系平台获取最新进展' }}
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="actualTotalPages > 1 && showPagination" class="pagination-dots-footer">
      <span
        v-for="dotIndex in actualTotalPages"
        :key="`dot-${dotIndex}`"
        :class="['dot-indicator', { 'dot--active': dotIndex - 1 === currentPageIndex }]"
        @click="goToPage(dotIndex - 1)"
      ></span>
    </div>
  </div>
</template>

<script setup>
// Script setup (props, emits, logic for sliding, pagination, etc.)
// REMAINS EXACTLY THE SAME as the previous HorizontallySlidingItems.vue version.
// No changes needed in the <script setup> block.
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { Button as AButton } from 'ant-design-vue';
import {formatDate} from '@/utils';
const props = defineProps({
  items: { type: Array, required: true, default: () => [] },
  itemsPerPage: { type: Number, default: 7 },
  autoCycleInterval: { type: Number, default: 5000 },
  transitionDurationMs: { type: Number, default: 500 },
  loop: { type: Boolean, default: true },
  showPagination: { type: Boolean, default: true }
});
const emit = defineEmits(['itemClick', 'actionClick']);
const wrapperRef = ref(null);
const containerRef = ref(null);
const currentPageIndex = ref(0);
let cycleTimer = null;
const useTransition = ref(false);
let isPausedByHover = false;
const itemPages = computed(() => { const p = []; if (!props.items || props.items.length === 0) return p; for (let i = 0; i < props.items.length; i += props.itemsPerPage) { p.push(props.items.slice(i, i + props.itemsPerPage)); } return p; });
const actualTotalPages = computed(() => itemPages.value.length);
const itemPagesForDisplay = computed(() => { if (props.loop && actualTotalPages.value > 1) { return [...itemPages.value, [...itemPages.value[0]]]; } return itemPages.value; });
const containerWidthPercentage = computed(() => itemPagesForDisplay.value.length * 100);
const pageGroupWidthPercentage = computed(() => { if (itemPagesForDisplay.value.length === 0) return 0; return 100 / itemPagesForDisplay.value.length; });
const currentTranslateXPercentage = computed(() => { if (itemPagesForDisplay.value.length === 0) return 0; return currentPageIndex.value * (100 / itemPagesForDisplay.value.length); });
const advancePage = () => { if (isPausedByHover) return; if (actualTotalPages.value <= 1 && !props.loop) return; useTransition.value = true; let nextPageIndex = currentPageIndex.value + 1; if (nextPageIndex >= itemPagesForDisplay.value.length) { if (props.loop && actualTotalPages.value > 1) { currentPageIndex.value = nextPageIndex; setTimeout(() => { if (isPausedByHover) return; useTransition.value = false; currentPageIndex.value = 0; }, props.transitionDurationMs); } else { currentPageIndex.value = 0; } } else { currentPageIndex.value = nextPageIndex; } };
const goToPage = (pageIndex) => { if (pageIndex < 0 || pageIndex >= actualTotalPages.value || pageIndex === currentPageIndex.value) return; stopCycle(); useTransition.value = true; currentPageIndex.value = pageIndex; if (props.autoCycleInterval > 0 && !isPausedByHover) { cycleTimer = setTimeout(startCycle, props.autoCycleInterval * 2); } };
const startCycle = () => { if (props.autoCycleInterval <= 0 || (actualTotalPages.value <= 1 && !props.loop)) return; stopCycle(); cycleTimer = setInterval(advancePage, props.autoCycleInterval + props.transitionDurationMs); };
const stopCycle = () => { clearInterval(cycleTimer); cycleTimer = null; };
const pauseCycle = () => { if (props.autoCycleInterval > 0) { isPausedByHover = true; stopCycle(); } };
const resumeCycle = () => { if (props.autoCycleInterval > 0) { isPausedByHover = false; setTimeout(() => { if (!isPausedByHover) startCycle(); }, 300); } };
const onItemClick = (item) => emit('itemClick', item);
const onActionClick = (item) => emit('actionClick', item);
onMounted(() => { nextTick(() => { if (actualTotalPages.value > 1 || (props.loop && actualTotalPages.value === 1) ) { startCycle(); } }); });
onBeforeUnmount(stopCycle);
watch(() => props.items, () => { useTransition.value = false; currentPageIndex.value = 0; nextTick(() => { if (actualTotalPages.value > 1 || props.loop) { startCycle(); } else { stopCycle(); } }); }, { deep: true });
watch(() => [props.autoCycleInterval, props.loop], () => { if (actualTotalPages.value > 1 || props.loop) { startCycle(); } else { stopCycle(); } });
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';
@min-list-height: (38px * 7) + @spacing-sm + 20px; // Approximate based on 7 items

.horizontal-sliding-items-wrapper {
  border: 1px solid #EAEAEA;
  overflow: hidden;
  position: relative;
  width: 100%;
  min-height: @min-list-height;
  background-color: @background-color-base;
  padding: 15px 20px; // Reduced overall vertical padding to match single list look
}

.sliding-container {
  display: flex;
  height: 100%;
}

.item-page-group {
  flex-shrink: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  // No internal padding for the group, item itself will have padding or achieve spacing
}

// --- Styles for BreakthroughItem (now directly part of this component) ---
.breakthrough-style-item {
  display: flex;
  align-items: center;
  // padding: 10px 0; // Reduced this, individual elements will control vertical spacing effectively
  padding-top: 10px;
  padding-bottom: 10px;
  margin: 0 @spacing-sm; // Horizontal margin for the item within its page group
  border-bottom: 1px dotted #E8E8E8;
  cursor: pointer;
  &:last-child {
    border-bottom: none;
  }
  // No hover on row as per image, only on action button
}

.item-icon-area {
  flex-shrink: 0;
  margin-right: @spacing-sm; // 8px
  display: flex;
  align-items: center;
  .img{
    height: 16px;
    width: 16px;
  }
}

.item-text-content {
  flex: 1.5; // Takes up available space between icon and date
  min-width: 0; // Essential for text-overflow to work in flex items
  padding-right: @spacing-md; // Space before date column
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  .item-main-text {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0%;
    text-transform: uppercase;

    color: #333;
    // color: #5A5A5A; // Dark gray text from image
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5; // Ensure single line height
    :deep(p){
      margin: 0;
      padding: 0;
    }
  }
}

.item-date-column {
  flex: 1; // Takes up available space between icon and date
  flex-shrink: 0;
  padding-right: @spacing-lg; // Space between date and action button
  .item-date-text {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0%;
    text-align: right;
    text-transform: uppercase;

    // color: #8C8C8C; // Light gray date text
    color: #333; // Light gray date text
    white-space: nowrap;
  }
}

.item-action-column {
  flex-shrink: 0;
  .action-link {
    font-size: 13px;
    color: @primary-color;
    background-color: #fff;
    border: 1px solid #EAEAEA;
    padding: 3px 12px; // Adjusted padding for button
    border-radius: 4px;
    white-space: nowrap;
    height: auto; // Let AntD button size itself
    line-height: 1.5;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s;

    &:hover {
      background-color: @primary-color;
      color: white;
      border-color: @primary-color;
    }
  }
}
// --- End of BreakthroughItem styles ---

.pagination-dots-footer {
  // Styles remain the same for dots
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  bottom: 6px;
  right: @spacing-sm; // Align with item's right margin
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

// No specific item fade transitions needed here for individual items if the whole page slides.
// The slide itself is the primary transition.
</style>