<template>
  <div class="filter-panel-wrapper">
    <div class="filter-panel">
      <!-- Filter Groups -->
      <div v-for="group in internalConfig" :key="group.id" class="filter-row">
        <div class="filter-row__label">{{ group.label }}:</div>
        <div class="filter-row__options">
          <a-tag
            v-for="option in group.visibleOptions"
            :key="option.value"
            :class="['filter-option', { 'filter-option--active': isSelected(group.id, option.value) }]"
            @click="toggleOption(group.id, option.value)"
          >
            {{ option.label }}
          </a-tag>
        </div>
        <div v-if="group.hasMoreOptions" class="filter-row__more">
          <a-collapse
            v-model:activeKey="group.activeCollapseKey"
            :bordered="false"
            class="more-options-collapse"
            @change="(keys) => handleCollapseChange(group.id, keys)"
          >
            <a-collapse-panel :key="group.id + '-more-panel'" :show-arrow="false" style="padding:0;">
              <template #header>
                <span class="more-trigger">
                  更多 <DownOutlined :class="{'rotate-icon': group.activeCollapseKey && group.activeCollapseKey.includes(group.id + '-more-panel') }" />
                </span>
              </template>
              <!-- The actual expanded options will be rendered below using a separate div -->
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>

      <!-- Expanded options panel (conditionally rendered outside the row for layout) -->
      <template v-for="group in internalConfig" :key="group.id + '-expanded'">
        <div
          v-if="group.hasMoreOptions && group.activeCollapseKey && group.activeCollapseKey.includes(group.id + '-more-panel')"
          class="expanded-options-panel"
        >
          <!-- This empty label div helps align the expanded options with the main options row -->
          <div class="filter-row__label" style="visibility: hidden;">{{ group.label }}:</div>
          <div class="expanded-options-content">
            <a-tag
              v-for="option in group.hiddenOptions"
              :key="option.value"
              :class="['filter-option', { 'filter-option--active': isSelected(group.id, option.value) }]"
              @click="toggleOption(group.id, option.value)"
            >
              {{ option.label }}
            </a-tag>
          </div>
        </div>
      </template>

      <!-- Search Row -->
      <div class="filter-row search-row">
        <div class="filter-row__label"><SearchOutlined /></div>
        <div class="filter-row__options search-input-container">
          <a-input
            v-model:value="internalSearchTerm"
            placeholder="请输入关键字"
            class="keyword-search-input"
            allow-clear
            @pressEnter="onSearchEnter"
            @change="onSearchInputChange"
          />
          <!-- Optional: Dedicated search button if not relying on Enter -->
          <!-- <a-button type="primary" @click="onSearchButtonClick" class="search-action-button">搜索</a-button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import { Tag as ATag, Input as AInput, Collapse as ACollapse, CollapsePanel as ACollapsePanel, Button as AButton } from 'ant-design-vue';
import { DownOutlined, SearchOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  filterConfig: { type: Array, required: true, default: () => [] },
  initialFilters: { type: Object, default: () => ({}) },
  initialSearchTerm: { type: String, default: '' }
});

const emit = defineEmits([
  'filtersUpdated', // Emitted when filter tags change (provides all filters and current search term)
  'searchTermApplied' // Emitted when search is explicitly triggered (e.g., Enter, provides search term and all filters)
]);

const selectedFilters = ref({});
const internalSearchTerm = ref('');
const internalConfig = ref([]);

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

onMounted(() => {
  selectedFilters.value = deepClone(props.initialFilters);
  internalSearchTerm.value = props.initialSearchTerm;
  initializeInternalConfig();
});

// Watch for prop changes to re-initialize if parent updates them
watch(() => props.initialFilters, (newVal) => {
  selectedFilters.value = deepClone(newVal);
}, { deep: true });

watch(() => props.initialSearchTerm, (newVal) => {
  internalSearchTerm.value = newVal;
});

watch(() => props.filterConfig, initializeInternalConfig, { deep: true });

function initializeInternalConfig() {
  internalConfig.value = props.filterConfig.map(group => {
    const hasMore = group.allowMore && group.options.length > (group.maxVisible || Infinity);
    return {
      ...group,
      visibleOptions: group.options.slice(0, group.allowMore ? group.maxVisible : group.options.length),
      hiddenOptions: hasMore ? group.options.slice(group.maxVisible) : [],
      hasMoreOptions: hasMore,
      activeCollapseKey: [] // Initialize as empty array; AntD Collapse uses array for activeKey
    };
  });
}

function handleCollapseChange(groupId, keys) {
  const group = internalConfig.value.find(g => g.id === groupId);
  if (group) {
    // `keys` is an array of active panel keys. If empty, it's closed.
    group.activeCollapseKey = Array.isArray(keys) ? keys : (keys ? [keys] : []);
  }
}

function toggleOption(groupId, optionValue) {
  if (selectedFilters.value[groupId] === optionValue) {
    delete selectedFilters.value[groupId]; // Deselect if already selected
  } else {
    selectedFilters.value[groupId] = optionValue; // Select new option
  }
  // When a filter tag is clicked, we consider both filters and current search term as "updated"
  emit('filtersUpdated', deepClone(selectedFilters.value), internalSearchTerm.value);
}

function isSelected(groupId, optionValue) {
  return selectedFilters.value[groupId] === optionValue;
}

function onSearchEnter() {
  // When search is explicitly triggered (Enter key)
  emit('searchTermApplied', internalSearchTerm.value, deepClone(selectedFilters.value));
}

function onSearchInputChange() {
  // If you want live updates as user types (can be noisy for API calls):
  // emit('filtersUpdated', deepClone(selectedFilters.value), internalSearchTerm.value);
  // For this setup, we'll only emit on explicit search (Enter)
}

// Optional: If you have a search button
// function onSearchButtonClick() {
//   emit('searchTermApplied', internalSearchTerm.value, deepClone(selectedFilters.value));
// }

const resetFiltersAndSearch = () => {
  selectedFilters.value = {};
  internalSearchTerm.value = '';
  internalConfig.value.forEach(group => {
      if (group.activeCollapseKey) { // Check if property exists
          group.activeCollapseKey = [];
      }
  });
  // After resetting, emit the cleared state
  nextTick(() => { // Ensure state updates are processed before emitting
    emit('filtersUpdated', {}, '');
  });
};

defineExpose({ resetFiltersAndSearch });
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.filter-panel-wrapper {
  background-color: @background-color-base;
  padding: @spacing-sm @spacing-lg @spacing-sm @spacing-lg; // Adjusted padding
  border-radius: @border-radius-base;
  margin-bottom: @spacing-lg;
}

.filter-panel {
  display: flex;
  flex-direction: column;
}

.filter-row {
  display: flex;
  align-items: center;
  padding: @spacing-md 0;
  border-bottom: 1px dotted @border-color-light;

  &:last-child { // Applies to search-row if it's the last one
    border-bottom: none;
  }

  &.search-row {
    // border-bottom: none; // Handled by :last-child now
    padding-bottom: @spacing-sm;
    padding-top: @spacing-lg;
  }

  &__label {
    width: 70px;
    font-size: 14px;
    color: @text-color-secondary;
    flex-shrink: 0;
    margin-right: @spacing-md; // Consistent margin after label
    display: flex;
    align-items: center;
    .anticon-search {
      font-size: 16px;
      color: @text-color-tertiary;
    }
  }

  &__options {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    gap: @spacing-sm @spacing-md; // row-gap column-gap
    align-items: center;

    &.search-input-container { // Specific for the search input's option area
      gap: @spacing-sm; // Reduce gap if there's a search button next to input
    }
  }

  .filter-option {
    cursor: pointer;
    padding: 4px 12px; // Slightly more padding
    border-radius: @border-radius-base; // Consistent rounding
    background-color: transparent;
    color: @text-color-base;
    font-size: 14px;
    border: 1px solid transparent; // Prepare for potential border on active/hover
    transition: color 0.2s, background-color 0.2s, border-color 0.2s;

    &:hover {
      color: @primary-color;
      // background-color: fade(@primary-color, 5%); // Optional subtle hover background
    }
    &--active {
      color: @primary-color;
      font-weight: 500;
      background-color: fade(@primary-color, 10%); // Light background for active
      border-color: fade(@primary-color, 30%); // Subtle border for active
    }
  }

  &__more {
    margin-left: auto;
    padding-left: @spacing-md;
    flex-shrink: 0;

    .more-options-collapse {
      background: transparent;
      border: none;
      :deep(.ant-collapse-item) {
        border-bottom: none !important;
      }
      :deep(.ant-collapse-header) {
        padding: 0 !important;
        line-height: normal;
      }
      :deep(.ant-collapse-content) { // Hide default panel content, we render it separately
        display: none;
      }
    }

    .more-trigger {
      font-size: 14px;
      color: @text-color-secondary;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      &:hover {
        color: @primary-color;
      }
      .anticon-down {
        margin-left: 3px;
        font-size: 12px;
        transition: transform 0.2s;
      }
      .rotate-icon {
        transform: rotate(180deg);
      }
    }
  }
}

.expanded-options-panel {
  display: flex;
  padding: @spacing-sm 0 @spacing-md 0;
  // background-color: #fdfdfd; // Optional different bg
  border-bottom: 1px dotted @border-color-light;
  // Indentation should match the label width + its margin from the .filter-row__options
  // This creates the visual effect of options appearing under the main row.
  // The empty label div within helps achieve this.
  .expanded-options-content {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    gap: @spacing-sm @spacing-md;
    align-items: center;
    padding-left: @spacing-md; // Indent the actual options slightly more if desired
    // .filter-option styles are inherited
  }
}

.keyword-search-input {
  width: 100%;
  border-radius: @border-radius-base;
  background-color: #f5f5f5;
  border: 1px solid transparent; // Start transparent
  font-size: 14px;
  box-shadow: none;
  transition: border-color 0.3s, background-color 0.3s;

  &:hover {
    border-color: darken(@border-color-light, 10%);
  }
  &:focus, :deep(&.ant-input-affix-wrapper-focused) { // Target wrapper for focus styles
    background-color: @background-color-base;
    border-color: @primary-color;
    box-shadow: 0 0 0 2px fade(@primary-color, 20%);
  }

  :deep(input.ant-input) {
    background-color: transparent !important; // Ensure AntD input itself is transparent
    border: none !important;
    box-shadow: none !important;
    padding-left: @spacing-sm; // Space for text if no prefix icon
    height: 34px; // Consistent height
    line-height: 34px;
  }
  :deep(.ant-input-prefix) { // Style if using prefix icon within a-input
    margin-right: @spacing-xs;
  }
  :deep(.ant-input-clear-icon) {
    font-size: 14px; // Make clear icon a bit bigger
  }
}

// .search-action-button { // If you add a search button
//   height: 36px; // Match input height
//   line-height: 34px;
// }
</style>