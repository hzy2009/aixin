<template>
  <div class="user-filter-accordion">
    <div v-for="group in filterGroups" :key="group.id" class="filter-group">
      <div class="filter-row">
        <div class="filter-row__label">{{ group.label }}:</div>
        <div class="filter-row__options">
          <!-- “更多”之前可见的选项 -->
          <a-tag v-for="option in group.options.slice(0, group.maxVisibleWithoutMore || group.options.length)"
            :key="option.value"
            :class="['filter-tag', { 'filter-tag--active': selectedFilters[group.id]?.includes(option.value) }]"
            @click="toggleFilter(group.id, option.value)">
            {{ option.label }}
          </a-tag>
        </div>
        <!-- 如果选项总数超过了默认可见数，则显示“更多”/“收起”按钮 -->
        <div v-if="group.options.length > (group.maxVisibleWithoutMore || group.options.length)"
          class="filter-row__more">
          <a @click="toggleExpand(group.id)" class="more-less-trigger">
            {{ expandedGroups[group.id] ? '收起' : '更多' }}
            <DownOutlined :class="{ 'rotate-icon': expandedGroups[group.id] }" />
          </a>
        </div>
      </div>
      <!-- 折叠面板，用于展示“更多”之后的选项 -->
      <a-collapse :activeKey="expandedGroups[group.id] ? [group.id] : []" :bordered="false"
        class="filter-accordion-collapse">
        <a-collapse-panel :key="group.id" :showArrow="false" class="filter-accordion-panel">
          <div class="expanded-options">
            <!-- 折叠区域内的选项 -->
            <a-tag v-for="option in group.options.slice(group.maxVisibleWithoutMore || 0)" :key="option.value"
              :class="['filter-tag', { 'filter-tag--active': selectedFilters[group.id]?.includes(option.value) }]"
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

// 定义组件的 props
const props = defineProps({
  filterGroups: { type: Array, required: true, default: () => [] },
  initialFilters: { type: Object, default: () => ({}) }
});

// 定义组件向外触发的事件
const emit = defineEmits(['filtersChanged']);

// 内部状态，存储当前选中的筛选条件，格式为 { groupId: ['value1', 'value2'] }
// [""] 代表选中了“全部”
const selectedFilters = ref({});

// 追踪每个分组的“更多”区域是否展开
const expandedGroups = ref({});

/**
 * 初始化所有筛选器的状态
 */
const initializeFilters = () => {
  const newFilters = {};
  props.filterGroups.forEach(group => {
    // 检查 initialFilters 中是否有针对该组的设置
    if (props.initialFilters[`${group.id}_MultiString`]) {
      newFilters[group.id] = props.initialFilters[`${group.id}_MultiString`].split(',');
    } else {
      // 默认状态下，每个组都选中“全部”
      newFilters[group.id] = [""]; 
    }
    expandedGroups.value[group.id] = true;
  });
  selectedFilters.value = newFilters;
};

// 组件挂载时，初始化状态
onMounted(initializeFilters);

// 监听 initialFilters 的变化
// watch(() => props.initialFilters, initializeFilters, { deep: true });

/**
 * 切换筛选选项，并处理“全部”选项的特殊逻辑
 * @param {string} groupId - 筛选分组的 ID
 * @param {string|number} optionValue - 被点击的选项的值 ("" 代表“全部”)
 */
const toggleFilter = (groupId, optionValue) => {
  const currentSelections = selectedFilters.value[groupId] || [""];
  let newSelections;

  if (optionValue === "") {
    // 场景1：点击了“全部”按钮
    newSelections = [""];
  } else {
    // 场景2：点击了“全部”之外的其他选项
    newSelections = currentSelections.filter(v => v !== "");
    
    const index = newSelections.indexOf(optionValue);
    if (index > -1) {
      newSelections.splice(index, 1);
    } else {
      newSelections.push(optionValue);
    }
  }

  // 场景3：如果所有具体选项都被取消了，则自动切回“全部”
  if (newSelections.length === 0) {
    newSelections = [""];
  }

  selectedFilters.value[groupId] = newSelections;

  // 在触发事件前，对数据进行格式化处理
  const formattedFilters = {};
  for (const key in selectedFilters.value) {
    if (Object.hasOwnProperty.call(selectedFilters.value, key)) {
      const value = selectedFilters.value[key];
      const isAllSelected = value.length === 1 && value[0] === "";

      if (Array.isArray(value) && value.length > 0 && !isAllSelected) {
        const newKey = `${key}_MultiString`;
        const newValue = value.join(',');
        formattedFilters[newKey] = newValue;
      }
    }
  }
  
  emit('filtersChanged', formattedFilters);
};

/**
 * 切换“更多/收起”的展开状态
 */
const toggleExpand = (groupId) => {
  expandedGroups.value[groupId] = !expandedGroups.value[groupId];
};

/**
 * 重置所有筛选条件和展开状态
 */
const resetAllFilters = () => {
  const newFilters = {};
  props.filterGroups.forEach(group => {
    newFilters[group.id] = [""];
    expandedGroups.value[group.id] = false;
  });
  selectedFilters.value = newFilters;
  emit('filtersChanged', {});
};

// 将 resetAllFilters 方法暴露出去，允许父组件通过 ref 调用
defineExpose({ resetAllFilters });

</script>

<style scoped lang="less">
/* 样式部分无需修改 */
@import '@/assets/styles/_variables.less';

.user-filter-accordion {
  background-color: @background-color-base;
  padding: @spacing-xs @spacing-sm;
  border-radius: @border-radius-base;
}

.filter-group {
  border-bottom: 1px dotted @border-color-light;

  &:last-child {
    border-bottom: none;
  }
}

.filter-tag {
  cursor: pointer;
  padding: 3px 6px;
  border-radius: @border-radius-sm;
  background-color: transparent;
  color: @text-color-secondary;
  font-size: 14px;
  border: 1px solid transparent;

  &:hover {
    // color: @primary-color;
    // background: @primary-color;
    // color: #fff;
  }

  &--active {
    // color: @primary-color;
    background: @primary-color;
    color: #fff;
    font-weight: 500;
  }
}

.filter-row {
  display: flex;
  align-items: center;
  padding: @spacing-md 20px;

  &__label {
    width: 100px;
    font-size: 14px;
    color: @text-color-base;
    font-weight: 500;
    flex-shrink: 0;
    margin-right: @spacing-sm;
  }

  &__options {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 0px;
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
        font-size: 14px;
        transition: transform 0.2s;
      }

      .rotate-icon {
        transform: rotate(180deg);
      }
    }
  }
}

.filter-accordion-collapse {
  background-color: transparent;

  :deep(.ant-collapse-item) {
    border-bottom: none !important;
  }

  :deep(.ant-collapse-header) {
    display: none;
  }

  :deep(.ant-collapse-content) {
    padding: 0;
    background-color: transparent;
  }

  :deep(.ant-collapse-content-box) {
    padding: @spacing-sm 0 @spacing-md 178px
  }
}

.expanded-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  align-items: center;
}
</style>