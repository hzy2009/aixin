<template>
  <div class="vxe-grid-wrapper">
    <vxe-grid
      ref="gridRef"
      :columns="processedColumns"
      :data="validData"
      :loading="loading"
      :edit-config="editConfig"
      border="full"
      height="400"
      align="center"
      header-align="center"
      class-name="custom-vxe-table"
      :row-config="{ isHover: true }"
      :column-config="{ resizable: true }"
      @cell-click="handleCellClick"
    >
      <!-- 自定义开关插槽 -->
      <template #switch="{ row }">
        <div class="switch-container">
          <span>否</span>
          <a-switch 
            v-model:checked="row.isWinner"
            checkedValue="1"
            unCheckedValue="0"
            @change="(checked) => onSwitchChange(checked, row)" 
          />
          <span>是</span>
        </div>
      </template>

      <!-- 自定义按钮插槽 -->
      <template #buttons="{ row }">
        <div class="button-group">
          <a-button
            v-for="button in validButtonConfig"
            :key="button.key"
            :type="button.type || 'primary'"
            :danger="button.danger"
            :disabled="getButtonDisabledState(button, row)"
            class="actionButton"
            size="small"
            @click="() => onButtonClick(button.key, row)"
          >
            {{ button.label }}
          </a-button>
        </div>
      </template>

      <!-- 透传父组件的自定义插槽（排除已定义的插槽） -->
      <!-- 支持 quantityEdit, priceEdit 等自定义编辑插槽 -->
      <template
        v-for="(slot, slotName) in filteredSlots"
        :key="slotName"
        #[slotName]="slotProps"
      >
        <slot :name="slotName" v-bind="slotProps || {}"></slot>
      </template>
    </vxe-grid>
  </div>
</template>

<script setup>
/**
 * VXE Grid 封装组件
 * 
 * 功能特性：
 * - 数据验证和处理
 * - 内置开关和按钮插槽
 * - 支持插槽透传，可自定义编辑组件（如 quantityEdit、priceEdit）
 * - 按钮禁用状态控制
 * - 完整的表格操作方法暴露
 */
import { ref, computed, useSlots } from 'vue';
import { Switch as ASwitch, Button as AButton } from 'ant-design-vue';

const props = defineProps({
  /** 表格列配置 */
  columns: { 
    type: Array, 
    required: true,
    validator: (value) => Array.isArray(value) && value.length > 0
  },
  /** 表格数据 */
  data: { 
    type: Array, 
    required: true,
    default: () => []
  },
  /** 加载状态 */
  loading: { 
    type: Boolean, 
    default: false 
  },
  /** 操作按钮配置 */
  buttonConfig: { 
    type: Array, 
    default: () => [] 
  },
  /** VXE表格编辑配置 */
  editConfig: {
    type: Object,
    default: () => ({
      trigger: 'click',
      mode: 'cell',
      showStatus: true,
    })
  }
});

const emit = defineEmits(['switchChange', 'buttonClick', 'cellClick']);

const gridRef = ref(null);
const slots = useSlots();

// 过滤掉已定义的插槽，避免冲突
const filteredSlots = computed(() => {
  const { switch: switchSlot, buttons: buttonsSlot, ...rest } = slots;
  return rest;
});

// 数据验证和处理
const validData = computed(() => {
  if (!Array.isArray(props.data)) {
    console.warn('VxeGridWrapper: data should be an array');
    return [];
  }
  return props.data.filter(item => item && typeof item === 'object');
});

const processedColumns = computed(() => {
  if (!Array.isArray(props.columns)) {
    console.warn('VxeGridWrapper: columns should be an array');
    return [];
  }
  return props.columns.map(col => ({
    ...col,
    // 确保所有列都有标题
    title: col.title || col.field || '未命名',
  }));
});

const validButtonConfig = computed(() => {
  if (!Array.isArray(props.buttonConfig)) {
    return [];
  }
  return props.buttonConfig.filter(btn => btn && btn.key && btn.label);
});

/**
 * 获取按钮禁用状态
 * @param {Object} button - 按钮配置
 * @param {Object} row - 行数据
 * @returns {boolean} 是否禁用
 */
const getButtonDisabledState = (button, row) => {
  if (button.disabled) return true;
  if (typeof button.getDisabledState === 'function') {
    try {
      return button.getDisabledState(row);
    } catch (error) {
      console.error('按钮禁用状态计算错误:', error);
      return false;
    }
  }
  return false;
};

/**
 * 开关状态改变处理
 * @param {boolean} checked - 开关状态
 * @param {Object} row - 行数据
 */
const onSwitchChange = (checked, row) => {
  if (!row) {
    console.warn('VxeGridWrapper: row data is required for switch change');
    return;
  }
  emit('switchChange', { checked, row });
};

/**
 * 按钮点击处理
 * @param {string} key - 按钮标识
 * @param {Object} row - 行数据
 */
const onButtonClick = (key, row) => {
  if (!key) {
    console.warn('VxeGridWrapper: button key is required');
    return;
  }
  if (!row) {
    console.warn('VxeGridWrapper: row data is required for button click');
    return;
  }
  emit('buttonClick', { key, row });
};

/**
 * 单元格点击处理
 * @param {Object} params - 点击参数
 */
const handleCellClick = (params) => {
  emit('cellClick', params);
};

// 暴露组件方法给父组件
defineExpose({
  /** 获取表格引用 */
  getGridRef: () => gridRef.value,
  /** 获取更新的记录 */
  getUpdateRecords: () => gridRef.value?.getUpdateRecords?.() || [],
  /** 获取选中的记录 */
  getCheckboxRecords: () => gridRef.value?.getCheckboxRecords?.() || [],
  /** 获取所有记录 */
  getTableData: () => gridRef.value?.getTableData?.() || [],
  /** 刷新表格 */
  refreshGrid: () => gridRef.value?.refresh?.(),
  /** 清空选择 */
  clearCheckboxRow: () => gridRef.value?.clearCheckboxRow?.(),
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.vxe-grid-wrapper {
  width: 100%;
  
  :deep(.custom-vxe-table) {
    // 表头样式
    .vxe-header--column {
      background-color: #FAFAFA !important;
      color: #31363F;
      font-weight: 500;
      font-size: 14px;
    }
    
    // 单元格样式
    .vxe-body--column {
      font-size: 14px;
      color: #646A73;
    }
    
    // 鼠标悬停行样式
    .vxe-body--row.row--hover {
      background-color: #f5f5f5;
    }
    
    // 边框样式
    &.vxe-grid--border-full .vxe-body--column,
    &.vxe-grid--border-full .vxe-header--column {
      border-right: 1px solid #E5E6EB;
      border-bottom: 1px solid #E5E6EB;
    }
    
    &.vxe-grid--border-full {
      border: 1px solid #E5E6EB;
    }

    // 可编辑单元格输入框样式
    .vxe-input--inner {
      height: 30px;
      border-radius: @border-radius-sm;
      border: 1px solid #DCDCDC;
      
      &:focus {
        border-color: @primary-color;
        box-shadow: 0 0 0 2px fade(@primary-color, 20%);
      }
    }
  }
}

.switch-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: @text-color-secondary;
  font-size: 12px;
}

.button-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;

  .actionButton {
    border-radius: 4px;
    font-size: 12px;
    min-width: 60px;
    
    &:hover:not(:disabled) {
      background-color: @primary-color !important;
      border-color: @primary-color !important;
      color: white !important;
      transform: translateY(-1px);
    }
    
    &:disabled {
      transform: none;
      opacity: 0.6;
    }
  }
}
</style>