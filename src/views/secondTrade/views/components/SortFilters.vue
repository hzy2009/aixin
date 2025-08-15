<template>
  <div class="sort-filters-container">
    <div
      v-for="filter in filters"
      :key="filter.key"
      :class="['filter-item', { active: activeKey === filter.key }]"
      @click="handleClick(filter)"
    >
      <template v-if="filter.type === 'dropdown'">
        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link" @click.prevent>
            {{ getDropdownLabel(filter) }} <DownOutlined />
          </a>
          <template #overlay>
            <a-menu @click="(e) => handleDropdownChange(filter, e.key)">
              <a-menu-item v-for="option in filter.options" :key="option.value">
                {{ option.label }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
      <template v-else>
        {{ filter.label }}
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Dropdown as ADropdown, Menu as AMenu, MenuItem as AMenuItem } from 'ant-design-vue';
import { DownOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  // 筛选配置数组，例如：
  // [
  //   { key: 'default', label: '默认排序' },
  //   { key: 'price', label: '价格排序', type: 'dropdown', options: [{label: '从高到低', value: 'desc'}, {label: '从低到高', value: 'asc'}] },
  //   { key: 'time', label: '时间排序' }
  // ]
  filters: {
    type: Array,
    required: true,
  },
  // 外部可以通过 v-model:value 来绑定当前选中的排序值
  value: {
    type: Object, // { key: 'price', order: 'desc' }
    default: () => ({}),
  },
});

const emit = defineEmits(['update:value', 'change']);

const activeKey = ref(props.value?.key || props.filters[0]?.key);
const selectedDropdownValue = ref(props.value?.order);

const getDropdownLabel = (filter) => {
    if (activeKey.value === filter.key && selectedDropdownValue.value) {
        const selectedOption = filter.options.find(opt => opt.value === selectedDropdownValue.value);
        return selectedOption ? selectedOption.label : filter.label;
    }
    return filter.label;
};

const handleClick = (filter) => {
  if (filter.type !== 'dropdown') {
    if (activeKey.value !== filter.key) {
      activeKey.value = filter.key;
      selectedDropdownValue.value = undefined; // 清除非下拉框的 order
      const newValue = { key: filter.key };
      emit('update:value', newValue);
      emit('change', newValue);
    }
  }
  // 对于下拉框，点击本身不改变激活状态，只有选择选项后才改变
};

const handleDropdownChange = (filter, value) => {
  activeKey.value = filter.key;
  selectedDropdownValue.value = value;
  const newValue = { key: filter.key, order: value };
  emit('update:value', newValue);
  emit('change', newValue);
};

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.sort-filters-container {
  display: flex;
  align-items: center;
  gap: 10px; // 按钮之间的间距
  margin-bottom: @spacing-md; // 与下方卡片列表的间距
}

.filter-item {
  padding: 6px 16px;
  font-size: 14px;
  color: @text-color-base;
  background-color: #F2F3F5; // 未选中时的背景色
  border: 1px solid transparent; // 预留边框
  border-radius: @border-radius-base; // 4px 圆角
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;

  &:hover {
    color: @primary-color;
  }

  &.active {
    background-color: @background-color-base; // 选中时白色背景
    color: @primary-color; // 选中时红色文字
    border-color: @primary-color; // 选中时红色边框
  }

  .ant-dropdown-link {
    color: inherit; // 继承 .filter-item 的颜色
    .anticon {
        margin-left: 4px;
        font-size: 10px;
    }
  }
}
</style>