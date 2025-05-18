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
            <template #expandIcon="{ isActive }">
              <span class="more-trigger">
                更多 <DownOutlined :class="{'rotate-icon': isActive }" />
              </span>
            </template>
            <!-- Panel content will be handled via CSS to appear below the row -->
          </a-collapse>
        </div>
      </div>

      <!-- Expanded options panel (conditionally rendered outside the row for layout) -->
      <template v-for="group in internalConfig" :key="group.id + '-expanded'">
        <div
          v-if="group.hasMoreOptions && group.activeCollapseKey && group.activeCollapseKey.includes(group.id + '-more-panel')"
          class="expanded-options-panel"
        >
          <div class="filter-row__label" style="visibility: hidden;">{{ group.label }}:</div> <!-- For alignment -->
          <div class="filter-row__options expanded-options-content">
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
        <div class="filter-row__options">
          <a-input
            v-model:value="internalSearchTerm"
            placeholder="请输入关键字"
            class="keyword-search-input"
            @pressEnter="onSearchEnter"
          />
          <!-- Optional: Add a search button if 'enter-button' is not desired from a-input-search -->
          <!-- <a-button type="primary" @click="onSearchClick" class="search-action-button">搜索</a-button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Tag as ATag, Input as AInput, Collapse as ACollapse, Button as AButton } from 'ant-design-vue';
import { DownOutlined, SearchOutlined } from '@ant-design/icons-vue'; // Added SearchOutlined

const props = defineProps({
  filterConfig: { type: Array, required: true, default: () => [] },
  initialFilters: { type: Object, default: () => ({}) },
  initialSearchTerm: { type: String, default: '' }
});
const emit = defineEmits(['filterChange', 'search']);

const selectedFilters = ref({});
const internalSearchTerm = ref('');
const internalConfig = ref([]);

onMounted(() => {
  selectedFilters.value = JSON.parse(JSON.stringify(props.initialFilters));
  internalSearchTerm.value = props.initialSearchTerm;
  initializeInternalConfig();
});

watch(() => props.filterConfig, initializeInternalConfig, { deep: true });

function initializeInternalConfig() {
  internalConfig.value = props.filterConfig.map(group => {
    const hasMore = group.allowMore && group.options.length > group.maxVisible;
    return {
      ...group,
      visibleOptions: group.options.slice(0, group.allowMore ? group.maxVisible : group.options.length),
      hiddenOptions: hasMore ? group.options.slice(group.maxVisible) : [],
      hasMoreOptions: hasMore,
      activeCollapseKey: [] // Initialize as empty array
    };
  });
}

function handleCollapseChange(groupId, keys) {
  const group = internalConfig.value.find(g => g.id === groupId);
  if (group) {
    // AntD Collapse passes an array. If it's empty, collapse is closed.
    // If it contains the panel key, it's open.
    group.activeCollapseKey = Array.isArray(keys) ? keys : (keys ? [keys] : []);
  }
}

function toggleOption(groupId, optionValue) {
  if (selectedFilters.value[groupId] === optionValue) {
    delete selectedFilters.value[groupId];
  } else {
    selectedFilters.value[groupId] = optionValue;
  }
  emitFilterChange();
}

function isSelected(groupId, optionValue) {
  return selectedFilters.value[groupId] === optionValue;
}

function onSearchEnter() { // Trigger search on enter
  emit('search', internalSearchTerm.value);
}
// function onSearchClick() { // If using a dedicated search button
//   emit('search', internalSearchTerm.value);
// }

function emitFilterChange() {
  emit('filterChange', { ...selectedFilters.value }, internalSearchTerm.value);
}

const resetFilters = () => {
  selectedFilters.value = {};
  internalSearchTerm.value = '';
  internalConfig.value.forEach(group => group.activeCollapseKey = []);
  emitFilterChange();
};
defineExpose({ resetFilters });
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.filter-panel-wrapper {
  background-color: @background-color-base;
  padding: @spacing-sm @spacing-lg @spacing-md @spacing-lg; // Reduced top/bottom padding
  border-radius: @border-radius-base;
  // box-shadow: 0 1px 4px rgba(0,0,0,0.04); // Very subtle shadow
  margin-bottom: @spacing-lg;
}

.filter-panel {
  display: flex;
  flex-direction: column;
}

.filter-row {
  display: flex;
  align-items: center; // Align label, options, and "more" vertically
  padding: @spacing-md 0;
  border-bottom: 1px dotted @border-color-light; // Dotted line as per design

  &.search-row {
    border-bottom: none; // No border for the last search row
    padding-bottom: @spacing-sm; // Less padding below search
    padding-top: @spacing-lg; // More padding above search
  }

  &__label {
    width: 70px; // Fixed width for labels "分类:", "区域:"
    font-size: 14px;
    color: @text-color-secondary;
    flex-shrink: 0;
    margin-right: @spacing-sm; // Space after label
    display: flex; // For icon alignment in search row
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
    gap: @spacing-md; // Gap between option tags
    align-items: center;
  }

  .filter-option {
    cursor: pointer;
    padding: 3px 12px; // Adjust padding for a less "taggy" look if desired
    border-radius: @border-radius-sm;
    background-color: transparent; // No background for options
    color: @text-color-base;
    font-size: 14px;
    border: none; // No border by default

    &:hover {
      color: @primary-color;
    }
    &--active {
      color: @primary-color;
      font-weight: 500;
    }
  }

  &__more {
    margin-left: auto; // Pushes "更多" to the far right
    padding-left: @spacing-md; // Space before "更多"
    flex-shrink: 0;

    .more-options-collapse { // The AntD collapse component itself
        background: transparent;
        border: none;
        :deep(.ant-collapse-item) {
            border-bottom: none !important;
        }
        :deep(.ant-collapse-header) { // The clickable header area
            padding: 0 !important;
            line-height: normal;
            // display: flex; // This is important for custom expandIcon
            // align-items: center;
        }
        // Hide the actual panel content for the trigger row
        :deep(.ant-collapse-content) {
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
  display: flex; // Aligns with filter-row structure
  align-items: flex-start;
  padding: @spacing-sm 0 @spacing-md 0; // Padding for the expanded area
  background-color: #fdfdfd; // Slightly different background for expanded area
  border-bottom: 1px dotted @border-color-light;
  margin-left: 70px + @spacing-sm; // Indent to align with options area (label width + margin)
  padding-left: @spacing-md; // Internal padding for the content
  border-left: 1px dotted @border-color-light; // Optional left border for indent visual
  border-right: 1px dotted @border-color-light; // Optional right border

  .expanded-options-content {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    gap: @spacing-md;
    align-items: center;
    // .filter-option styles are inherited
  }
}


.keyword-search-input {
  width: 100%;
  border-radius: @border-radius-sm;
  background-color: #f5f5f5; // Light gray background for search input area
  border: none; // Remove default border
  padding: @spacing-sm @spacing-md; // Internal padding
  font-size: 14px;
  box-shadow: none;

  :deep(input.ant-input) {
    background-color: transparent; // Make AntD input transparent
    border: none;
    box-shadow: none !important;
    padding-left: 0; // Remove AntD's internal padding if icon is handled by label
    &:focus {
        border: none;
        box-shadow: none;
    }
  }
}

// .search-action-button {
//   margin-left: @spacing-sm;
// }
</style>