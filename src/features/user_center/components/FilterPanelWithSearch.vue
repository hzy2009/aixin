<template>
  <div class="filter-panel-wrapper">
    <div class="filter-panel-content">
      <!-- Filter Groups -->
      <div class="filter-groups">
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
            <a-collapse v-model:activeKey="group.activeCollapseKey" :bordered="false" class="more-options-collapse" @change="(keys) => handleCollapseChange(group.id, keys)">
              <a-collapse-panel :key="group.id + '-more-panel'" :show-arrow="false" style="padding:0;">
                <template #header>
                  <span class="more-trigger">更多 <DownOutlined :class="{'rotate-icon': group.activeCollapseKey && group.activeCollapseKey.includes(group.id + '-more-panel') }" /></span>
                </template>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </div>
         <!-- Expanded options panels -->
        <template v-for="group in internalConfig" :key="group.id + '-expanded'">
          <div v-if="group.hasMoreOptions && group.activeCollapseKey && group.activeCollapseKey.includes(group.id + '-more-panel')" class="expanded-options-panel">
            <div class="filter-row__label" style="visibility: hidden;">{{ group.label }}:</div>
            <div class="expanded-options-content">
              <a-tag v-for="option in group.hiddenOptions" :key="option.value" :class="['filter-option', { 'filter-option--active': isSelected(group.id, option.value) }]" @click="toggleOption(group.id, option.value)">
                {{ option.label }}
              </a-tag>
            </div>
          </div>
        </template>
      </div>

      <!-- Search and Action Area -->
      <div class="search-action-area">
        <a-input-search
          v-model:value="internalSearchTerm"
          placeholder="请输入关键字"
          enter-button="搜索"
          allow-clear
          class="keyword-search-input"
          @search="onSearchTriggered"
          @change="onSearchInputChange"
        />
        <a-button type="primary" @click="emitCreateAction" class="create-action-button">
          <PlusOutlined /> {{ createActionText }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
// ... (Keep most of the script from your FilterPanel.vue) ...
import { ref, watch, onMounted, nextTick } from 'vue';
import { Tag as ATag, InputSearch as AInputSearch, Collapse as ACollapse, CollapsePanel as ACollapsePanel, Button as AButton } from 'ant-design-vue';
import { DownOutlined, PlusOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  filterConfig: { type: Array, required: true, default: () => [] },
  initialFilters: { type: Object, default: () => ({}) },
  initialSearchTerm: { type: String, default: '' },
  createActionText: { type: String, default: '创建新条目' } // For the button
});

const emit = defineEmits([
  'filtersUpdated',     // Emitted when filter tags change OR search input changes (live)
  'searchApplied',      // Emitted when search button is clicked or Enter is pressed
  'createActionClicked' // Emitted when the create button is clicked
]);

const selectedFilters = ref({});
const internalSearchTerm = ref('');
const internalConfig = ref([]);

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

onMounted(() => {
  selectedFilters.value = deepClone(props.initialFilters);
  internalSearchTerm.value = props.initialSearchTerm;
  initializeInternalConfig();
});

watch(() => props.initialFilters, (newVal) => { selectedFilters.value = deepClone(newVal); }, { deep: true });
watch(() => props.initialSearchTerm, (newVal) => { internalSearchTerm.value = newVal; });
watch(() => props.filterConfig, initializeInternalConfig, { deep: true });

function initializeInternalConfig() { /* ... same as before ... */
  internalConfig.value = props.filterConfig.map(group => {
    const hasMore = group.allowMore && group.options.length > (group.maxVisible || Infinity);
    return {
      ...group,
      visibleOptions: group.options.slice(0, group.allowMore ? group.maxVisible : group.options.length),
      hiddenOptions: hasMore ? group.options.slice(group.maxVisible) : [],
      hasMoreOptions: hasMore,
      activeCollapseKey: []
    };
  });
}
function handleCollapseChange(groupId, keys) { /* ... same as before ... */
    const group = internalConfig.value.find(g => g.id === groupId);
    if (group) {
        group.activeCollapseKey = Array.isArray(keys) ? keys : (keys ? [keys] : []);
    }
}
function toggleOption(groupId, optionValue) { /* ... same as before, but emit filtersUpdated ... */
    if (selectedFilters.value[groupId] === optionValue) {
        delete selectedFilters.value[groupId];
    } else {
        selectedFilters.value[groupId] = optionValue;
    }
    emit('filtersUpdated', deepClone(selectedFilters.value), internalSearchTerm.value);
}
function isSelected(groupId, optionValue) { /* ... same as before ... */
    return selectedFilters.value[groupId] === optionValue;
}

function onSearchInputChange() {
  // Optionally emit live search term changes
  // emit('filtersUpdated', deepClone(selectedFilters.value), internalSearchTerm.value);
}

function onSearchTriggered(searchTermVal) { // From InputSearch's @search event
  // internalSearchTerm.value is already bound, searchTermVal is the value from input
  emit('searchApplied', internalSearchTerm.value, deepClone(selectedFilters.value));
}

function emitCreateAction() {
  emit('createActionClicked');
}

const resetFiltersAndSearch = () => { /* ... same as before ... */
    selectedFilters.value = {};
    internalSearchTerm.value = '';
    internalConfig.value.forEach(group => {
        if (group.activeCollapseKey) {
            group.activeCollapseKey = [];
        }
    });
    nextTick(() => {
        emit('filtersUpdated', {}, '');
    });
};
defineExpose({ resetFiltersAndSearch });
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.filter-panel-wrapper {
  background-color: @background-color-base;
  padding: @spacing-md @spacing-lg;
  border-radius: @border-radius-base;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  margin-bottom: @spacing-lg;
}

.filter-panel-content {
  // display: flex;
  // flex-direction: column;
}

.filter-groups {
  margin-bottom: @spacing-lg; // Space before search area
}

.filter-row {
  /* ... styles mostly same as before ... */
  display: flex;
  align-items: center;
  padding: @spacing-sm 0; // Reduced padding for rows
  border-bottom: 1px dotted @border-color-light;
  &:last-child { border-bottom: none; }

  &__label { width: 70px; font-size: 14px; color: @text-color-secondary; flex-shrink: 0; margin-right: @spacing-md;}
  &__options { flex-grow: 1; display: flex; flex-wrap: wrap; gap: @spacing-sm @spacing-md; align-items: center; }
  .filter-option { /* ... same as before ... */
    cursor: pointer; padding: 4px 12px; border-radius: @border-radius-base;
    background-color: transparent; color: @text-color-base; font-size: 14px;
    border: 1px solid transparent; transition: color 0.2s, background-color 0.2s, border-color 0.2s;
    &:hover { color: @primary-color; }
    &--active { color: @primary-color; font-weight: 500; background-color: fade(@primary-color, 10%); border-color: fade(@primary-color, 30%);}
  }
  &__more { /* ... same as before ... */
    margin-left: auto; padding-left: @spacing-md; flex-shrink: 0;
    .more-options-collapse { background: transparent; border: none; :deep(.ant-collapse-item) { border-bottom: none !important; } :deep(.ant-collapse-header) { padding: 0 !important; line-height: normal; } :deep(.ant-collapse-content) { display: none; }}
    .more-trigger { font-size: 14px; color: @text-color-secondary; cursor: pointer; display: inline-flex; align-items: center; &:hover { color: @primary-color; } .anticon-down { margin-left: 3px; font-size: 12px; transition: transform 0.2s; } .rotate-icon { transform: rotate(180deg); }}
  }
}
.expanded-options-panel { /* ... same as before ... */
  display: flex; padding: @spacing-sm 0 @spacing-md 0; border-bottom: 1px dotted @border-color-light;
  .expanded-options-content { flex-grow: 1; display: flex; flex-wrap: wrap; gap: @spacing-sm @spacing-md; align-items: center; padding-left: 70px + @spacing-md + @spacing-md; }
}


.search-action-area {
  display: flex;
  align-items: center;
  gap: @spacing-md;
  padding-top: @spacing-md; // Add some space above if filter-groups had a bottom border
}

.keyword-search-input {
  flex-grow: 1;
  max-width: 400px; // Or adjust as needed
  :deep(input.ant-input) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
     height: 36px;
  }
  :deep(button.ant-btn) {
    height: 36px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
.create-action-button {
    height: 36px;
}
</style>