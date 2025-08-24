<template>
  <div class="user-filter-accordion">
    <div v-for="group in filterGroups" :key="group.id" class="filter-group">
      <div class="filter-row" :class="{ 'filter-row--expanded': expandedGroups[group.id] && group.options.length > (group.maxVisibleWithoutMore || group.options.length) }">
        <div class="filter-row__label">{{ group.label }}:</div>
        <div class="filter-row__options">
          <!-- “更多”之前可见的选项 -->
          <a-tag v-for="option in group.options.slice(0, group.maxVisibleWithoutMore || group.options.length)"
            :key="option.value"
            :class="['filter-tag', { 'filter-tag--active': selectedFilters[group.id]?.includes(option.value) }]"
            @click="handleOptionClick(group, option)">
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
        v-if="group.options.length > (group.maxVisibleWithoutMore || group.options.length)"
        class="filter-accordion-collapse">
        <a-collapse-panel :key="group.id" :showArrow="false" class="filter-accordion-panel">
          <div class="expanded-options">
            <!-- 折叠区域内的选项 -->
            <a-tag v-for="option in group.options.slice(group.maxVisibleWithoutMore || 0)" :key="option.value"
              :class="['filter-tag', { 'filter-tag--active': selectedFilters[group.id]?.includes(option.value) }]"
              @click="handleOptionClick(group, option)">
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

/**
 * 筛选组件 Props 定义
 * 
 * filterGroups 数据结构：
 * [
 *   {
 *     id: 'category', // 分组ID
 *     label: '分类', // 分组显示名称
 *     selectionType: 'single' | 'multiple', // 选择类型，默认为'multiple'
 *     maxVisibleWithoutMore: 5, // 默认显示的选项数量
 *     options: [
 *       {
 *         value: '', // 选项值，空字符串代表"全部"
 *         label: '全部', // 选项显示名称
 *         onClick: (group, option, helpers) => { ... } // 可选的自定义点击处理函数
 *       },
 *       {
 *         value: 'electronics',
 *         label: '电子产品',
 *         onClick: (group, option, helpers) => {
 *           // 自定义点击逻辑
 *           // helpers 包含：
 *           // - currentSelections: 当前选中的值数组
 *           // - toggleFilter: (value) => void 默认切换函数
 *           // - setGroupSelection: (selections) => void 设置分组选择
 *         }
 *       }
 *     ]
 *   }
 * ]
 */
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
 * 处理选项点击事件，支持自定义点击方法和单选/多选模式
 * @param {Object} group - 筛选分组对象
 * @param {Object} option - 被点击的选项对象
 */
const handleOptionClick = (group, option) => {
  // 如果选项有自定义的点击方法，优先调用自定义方法
  if (typeof option.onClick === 'function') {
    option.onClick(group, option, {
      currentSelections: selectedFilters.value[group.id] || [""],
      toggleFilter: (value) => toggleFilter(group.id, value, false), // 不自动触发事件
      setGroupSelection: (selections) => setGroupSelection(group.id, selections, false), // 不自动触发事件
      emitFiltersChanged: () => emitFiltersChanged(), // 手动触发事件的方法
    });
    return;
  }
  
  // 使用默认的切换逻辑
  toggleFilter(group.id, option.value);
};

/**
 * 设置分组的选中值
 * @param {string} groupId - 筛选分组的 ID
 * @param {Array} selections - 选中的值数组
 * @param {boolean} shouldEmit - 是否触发事件，默认为true
 */
const setGroupSelection = (groupId, selections, shouldEmit = true) => {
  selectedFilters.value[groupId] = selections;
  if (shouldEmit) {
    emitFiltersChanged();
  }
};

/**
 * 触发筛选条件变化事件
 */
const emitFiltersChanged = () => {
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
 * 切换筛选选项，支持单选和多选模式
 * @param {string} groupId - 筛选分组的 ID
 * @param {string|number} optionValue - 被点击的选项的值 ("" 代表"全部")
 * @param {boolean} shouldEmit - 是否触发事件，默认为true
 */
const toggleFilter = (groupId, optionValue, shouldEmit = true) => {
  const group = props.filterGroups.find(g => g.id === groupId);
  const selectionType = group?.selectionType || 'multiple'; // 默认为多选
  const currentSelections = selectedFilters.value[groupId] || [""];
  let newSelections;

  if (optionValue === "") {
    // 场景1：点击了"全部"按钮
    newSelections = [""];
  } else if (selectionType === 'single') {
    // 单选模式：只允许选择一个选项
    const isCurrentlySelected = currentSelections.includes(optionValue) && currentSelections.length === 1;
    if (isCurrentlySelected) {
      // 如果当前选项已被选中，则切换到"全部"
      newSelections = [""];
    } else {
      // 否则选择当前选项
      newSelections = [optionValue];
    }
  } else {
    // 多选模式：原有的逻辑
    newSelections = currentSelections.filter(v => v !== "");
    
    const index = newSelections.indexOf(optionValue);
    if (index > -1) {
      newSelections.splice(index, 1);
    } else {
      newSelections.push(optionValue);
    }
  }

  // 场景3：如果所有具体选项都被取消了，则自动切回"全部"
  if (newSelections.length === 0) {
    newSelections = [""];
  }

  selectedFilters.value[groupId] = newSelections;
  if (shouldEmit) {
    emitFiltersChanged();
  }
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
  emitFiltersChanged();
};

// 将 resetAllFilters 方法暴露出去，允许父组件通过 ref 调用
defineExpose({ resetAllFilters });

/**
 * 使用示例：
 * 
 * <template>
 *   <UserFilterAccordion 
 *     :filterGroups="filterGroups" 
 *     :initialFilters="initialFilters"
 *     @filtersChanged="handleFiltersChanged" 
 *   />
 * </template>
 * 
 * <script setup>
 * const filterGroups = [
 *   {
 *     id: 'category',
 *     label: '产品分类',
 *     selectionType: 'single', // 单选模式
 *     maxVisibleWithoutMore: 4,
 *     options: [
 *       { value: '', label: '全部' },
 *       { value: 'ic', label: '集成电路' },
 *       { value: 'pcb', label: 'PCB电路板' },
 *       { value: 'components', label: '电子元器件' }
 *     ]
 *   },
 *   {
 *     id: 'status',
 *     label: '状态',
 *     selectionType: 'multiple', // 多选模式（默认）
 *     options: [
 *       { value: '', label: '全部' },
 *       { 
 *         value: 'active', 
 *         label: '活跃',
 *         onClick: (group, option, helpers) => {
 *           // 自定义点击逻辑
 *           console.log('点击了活跃状态', helpers.currentSelections);
 *           helpers.toggleFilter(option.value); // 执行默认切换
 *         }
 *       },
 *       { value: 'inactive', label: '非活跃' }
 *     ]
 *   }
 * ];
 * 
 * const handleFiltersChanged = (filters) => {
 *   console.log('筛选条件变化:', filters);
 *   // 例如: { category_MultiString: 'ic', status_MultiString: 'active,inactive' }
 * };
 */

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
  padding: 3px 5px;
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
.filter-row--expanded{
  padding-bottom: 0px;
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
    padding: @spacing-sm 0 0 178px
  }
}

.expanded-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  align-items: center;
}
</style>