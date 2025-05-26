<template>
  <div class="user-filter-accordion">
    <div v-for="group in filterGroups" :key="group.id" class="filter-group">
      <div class="filter-row">
        <div class="filter-row__label">{{ group.label }}:</div>
        <div class="filter-row__options">
          <a-tag v-for="option in group.options.slice(0, group.maxVisibleWithoutMore || group.options.length)"
            :key="option.value"
            :class="['filter-tag', { 'filter-tag--active': selectedFilters[group.id] === option.value }]"
            @click="toggleFilter(group.id, option.value)">
            {{ option.label }}
          </a-tag>
        </div>
        <div v-if="group.options.length > (group.maxVisibleWithoutMore || group.options.length)"
          class="filter-row__more">
          <a @click="toggleExpand(group.id)" class="more-less-trigger">
            {{ expandedGroups[group.id] ? '收起' : '更多' }}
            <DownOutlined :class="{ 'rotate-icon': expandedGroups[group.id] }" />
          </a>
        </div>
      </div>
      <a-collapse :activeKey="expandedGroups[group.id] ? [group.id] : []" :bordered="false"
        class="filter-accordion-collapse">
        <a-collapse-panel :key="group.id" :showArrow="false" class="filter-accordion-panel">
          <div class="expanded-options">
            <a-tag v-for="option in group.options.slice(group.maxVisibleWithoutMore || 0)" :key="option.value"
              :class="['filter-tag', { 'filter-tag--active': selectedFilters[group.id] === option.value }]"
              @click="toggleFilter(group.id, option.value)">
              {{ option.label }}
            </a-tag>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Tag as ATag, Collapse as ACollapse, CollapsePanel as ACollapsePanel } from 'ant-design-vue';
import { DownOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  filterGroups: { type: Array, required: true, default: () => [] },
  // Example: [{ id: 'type', label: '分类', maxVisibleWithoutMore: 7, options: [{value: 'a', label: 'A'}] }]
  initialFilters: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['filtersChanged']);

const selectedFilters = ref({});
const expandedGroups = ref({}); // Tracks which group's "more" section is open { groupId: boolean }

onMounted(() => {
  selectedFilters.value = JSON.parse(JSON.stringify(props.initialFilters));
  // Initialize expandedGroups based on filterGroups
  props.filterGroups.forEach(group => {
    expandedGroups.value[group.id] = false;
  });
});

watch(() => props.initialFilters, (newVal) => {
  selectedFilters.value = JSON.parse(JSON.stringify(newVal));
}, { deep: true });


const toggleFilter = (groupId, optionValue) => {
  if (selectedFilters.value[groupId] === optionValue) {
    delete selectedFilters.value[groupId]; // Deselect
  } else {
    selectedFilters.value[groupId] = optionValue; // Select
  }
  emit('filtersChanged', { ...selectedFilters.value });
};

const toggleExpand = (groupId) => {
  expandedGroups.value[groupId] = !expandedGroups.value[groupId];
};

// Method to be called by parent to reset filters
const resetAllFilters = () => {
  selectedFilters.value = {};
  props.filterGroups.forEach(group => {
    expandedGroups.value[group.id] = false;
  });
  emit('filtersChanged', {});
};
defineExpose({ resetAllFilters });

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.user-filter-accordion {
  background-color: @background-color-base;
  padding: @spacing-xs @spacing-lg @spacing-md @spacing-lg; // Top padding reduced
  border-radius: @border-radius-base;
  // No shadow, just border on bottom of each row
}

.filter-group {
  border-bottom: 1px dotted @border-color-light;

  &:last-child {
    border-bottom: none;
  }
}

.filter-tag {
  cursor: pointer;
  padding: 3px 10px;
  border-radius: @border-radius-sm;
  background-color: transparent;
  color: @text-color-secondary; // Default tag color
  font-size: 14px;
  border: 1px solid transparent; // No border by default

  &:hover {
    color: @primary-color;
  }

  &--active {
    color: @primary-color;
    font-weight: 500;
  }
}

.filter-row {
  display: flex;
  align-items: center;
  padding: @spacing-md 0; // Vertical padding for the main row of options

  &__label {
    width: 80px; // Slightly wider label for "寻源状态:"
    font-size: 14px;
    color: @text-color-base; // Darker label text
    font-weight: 500;
    flex-shrink: 0;
    margin-right: @spacing-sm;
  }

  &__options {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    gap: @spacing-sm @spacing-md; // row-gap column-gap
    align-items: center;
  }



  &__more {
    margin-left: auto;
    padding-left: @spacing-md;
    flex-shrink: 0;

    .more-less-trigger {
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

.filter-accordion-collapse {
  background-color: transparent; // Make collapse background transparent

  :deep(.ant-collapse-item) {
    border-bottom: none !important; // No border on the collapse item itself
  }

  :deep(.ant-collapse-header) {
    display: none; // We use our own trigger
  }

  :deep(.ant-collapse-content) {
    padding: 0;
    background-color: transparent; // Background for the content box
  }

  :deep(.ant-collapse-content-box) {
    padding: @spacing-sm 0 @spacing-md (@spacing-sm + 80px); // Top/Bottom padding, Indent by label width + margin
  }
}

.expanded-options {
  display: flex;
  flex-wrap: wrap;
  gap: @spacing-sm @spacing-md;
  align-items: center;
  // background-color: #f9f9f9; // Optional slightly different background for expanded area
  // padding: @spacing-sm;
  // border-radius: @border-radius-sm;
  // margin-top: -@spacing-sm; // Pull up slightly to align with bottom of main row options
}
</style>