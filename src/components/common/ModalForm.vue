<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :width="width"
    :destroyOnClose="true"
    :maskClosable="maskClosable"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-button key="cancel" @click="handleCancel">
        {{ cancelText }}
      </a-button>
      <a-button 
        key="ok" 
        type="primary" 
        :loading="confirmLoading" 
        @click="handleOk"
      >
        {{ okText }}
      </a-button>
    </template>
    
    <div class="modal-form-content">
      <EditableGrid
        ref="editableGridRef"
        v-bind="gridProps"
        @dataChange="handleDataChange"
        @update:data="handleDataUpdate"
      />
    </div>
  </a-modal>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { Modal as AModal, Button as AButton } from 'ant-design-vue';
import EditableGrid from './EditableGrid.vue';

const props = defineProps({
  /** 弹窗标题 */
  title: {
    type: String,
    default: '表单编辑'
  },
  /** 弹窗宽度 */
  width: {
    type: [String, Number],
    default: 800
  },
  /** 是否可见 */
  modelValue: {
    type: Boolean,
    default: false
  },
  /** 是否点击遮罩可关闭 */
  maskClosable: {
    type: Boolean,
    default: false
  },
  /** 确认按钮文字 */
  okText: {
    type: String,
    default: '确定'
  },
  /** 取消按钮文字 */
  cancelText: {
    type: String,
    default: '取消'
  },
  /** 确认按钮加载状态 */
  confirmLoading: {
    type: Boolean,
    default: false
  },
  /** 表格列配置 */
  columns: {
    type: Array,
    required: true
  },
  /** 表格数据 */
  data: {
    type: Array,
    default: () => []
  },
  /** 表格其他配置 */
  gridConfig: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits([
  'update:modelValue',
  'ok',
  'cancel',
  'dataChange',
  'update:data'
]);

const editableGridRef = ref(null);

// 弹窗显示状态
const visible = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
});

// 表格属性传递
const gridProps = computed(() => ({
  columns: props.columns,
  data: props.data,
  ...props.gridConfig
}));

/**
 * 确认事件处理
 */
const handleOk = async () => {
  try {
    // 获取表格数据
    const gridData = editableGridRef.value?.getTableData() || [];
    const updateRecords = editableGridRef.value?.getUpdateRecords() || [];
    
    emit('ok', {
      data: gridData,
      updateRecords,
      originalData: props.data
    });
  } catch (error) {
    console.error('Modal form ok error:', error);
  }
};

/**
 * 取消事件处理
 */
const handleCancel = () => {
  emit('cancel');
  visible.value = false;
};

/**
 * 表格数据变化处理
 */
const handleDataChange = (data) => {
  emit('dataChange', data);
};

/**
 * 数据更新处理（用于v-model支持）
 */
const handleDataUpdate = (data) => {
  emit('update:data', data);
};

/**
 * 获取表格实例方法
 */
const getGridRef = () => editableGridRef.value;

/**
 * 获取表格数据
 */
const getFormData = () => {
  return editableGridRef.value?.getTableData() || [];
};

/**
 * 获取变更记录
 */
const getUpdateRecords = () => {
  return editableGridRef.value?.getUpdateRecords() || [];
};

/**
 * 重置表格数据
 */
const resetData = () => {
  editableGridRef.value?.resetData?.();
};

/**
 * 验证表格数据
 */
const validate = () => {
  return editableGridRef.value?.validate?.() || true;
};

// 暴露组件方法
defineExpose({
  getGridRef,
  getFormData,
  getUpdateRecords,
  resetData,
  validate
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.modal-form-content {
  padding: @spacing-md 0;
  max-height: 60vh;
  overflow-y: auto;
  
  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    
    &:hover {
      background: #a1a1a1;
    }
  }
}

:deep(.ant-modal-header) {
  border-bottom: 1px solid #E5E6EB;
  padding: @spacing-md @spacing-lg;
  
  .ant-modal-title {
    font-weight: 600;
    color: @text-color-primary;
    font-size: 16px;
  }
}

:deep(.ant-modal-body) {
  padding: 0 @spacing-lg @spacing-md;
}

:deep(.ant-modal-footer) {
  border-top: 1px solid #E5E6EB;
  padding: @spacing-md @spacing-lg;
  text-align: right;
  
  .ant-btn {
    margin-left: @spacing-sm;
    
    &:first-child {
      margin-left: 0;
    }
  }
}
</style>