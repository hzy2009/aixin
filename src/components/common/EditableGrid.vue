<template>
  <div class="editable-grid">
    <vxe-grid
      ref="gridRef"
      :columns="processedColumns"
      :data="internalData"
      :loading="loading"
      :edit-config="editConfig"
      border="full"
      :height="height"
      align="center"
      header-align="center"
      class-name="custom-editable-grid"
      :row-config="rowConfig"
      :column-config="columnConfig"
      @cell-click="handleCellClick"
      @edit-activated="handleEditActivated"
      @edit-closed="handleEditClosed"
    >
      <!-- 动态生成的输入控件插槽 -->
      <template 
        v-for="column in columnsWithFieldType" 
        :key="`${column.field}_${column.fieldType}`"
        #[`${column.field}_edit`]="{ row }"
      >
        <!-- input类型 -->
        <a-input
          v-if="column.fieldType === 'input'"
          v-model:value="row[column.field]"
          :placeholder="column.placeholder || `请输入${column.title}`"
          :disabled="!isFieldEditable(column, row)"
          size="small"
          @change="() => handleFieldChange(row, column.field)"
        />
        
        <!-- number类型 -->
        <a-input-number
          v-else-if="column.fieldType === 'number'"
          v-model:value="row[column.field]"
          :placeholder="column.placeholder || `请输入${column.title}`"
          :disabled="!isFieldEditable(column, row)"
          :precision="column.precision || 2"
          :min="column.min"
          :max="column.max"
          :step="column.step || 1"
          size="small"
          style="width: 100%"
          @change="() => handleFieldChange(row, column.field)"
        />
        
        <!-- positiveInteger类型 -->
        <a-input-number
          v-else-if="column.fieldType === 'positiveInteger'"
          v-model:value="row[column.field]"
          :placeholder="column.placeholder || `请输入${column.title}`"
          :disabled="!isFieldEditable(column, row)"
          :precision="0"
          :min="1"
          :max="column.max"
          :step="1"
          size="small"
          style="width: 100%"
          @change="() => handleFieldChange(row, column.field)"
        />
        
        <!-- select类型 -->
        <a-select
          v-else-if="column.fieldType === 'select'"
          v-model:value="row[column.field]"
          :placeholder="column.placeholder || `请选择${column.title}`"
          :disabled="!isFieldEditable(column, row)"
          size="small"
          style="width: 100%"
          :allow-clear="column.allowClear !== false"
          @change="() => handleFieldChange(row, column.field)"
        >
          <a-select-option
            v-for="option in getSelectOptions(column)"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </a-select-option>
        </a-select>
        
        <!-- date类型 -->
        <a-date-picker
          v-else-if="column.fieldType === 'date'"
          v-model:value="row[column.field]"
          :placeholder="column.placeholder || `请选择${column.title}`"
          :disabled="!isFieldEditable(column, row)"
          size="small"
          style="width: 100%"
          :format="column.dateFormat || 'YYYY-MM-DD'"
          :value-format="column.valueFormat || 'YYYY-MM-DD'"
          @change="() => handleFieldChange(row, column.field)"
        />
        
        <!-- datetime类型 -->
        <a-date-picker
          v-else-if="column.fieldType === 'datetime'"
          v-model:value="row[column.field]"
          :placeholder="column.placeholder || `请选择${column.title}`"
          :disabled="!isFieldEditable(column, row)"
          size="small"
          style="width: 100%"
          show-time
          :format="column.dateFormat || 'YYYY-MM-DD HH:mm:ss'"
          :value-format="column.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
          @change="() => handleFieldChange(row, column.field)"
        />
        
        <!-- upload类型 -->
        <div v-else-if="column.fieldType === 'upload'" class="upload-container">
          <a-upload
            :file-list="getFileList(row[column.field])"
            :before-upload="() => false"
            :disabled="!isFieldEditable(column, row)"
            @change="(info) => handleUploadChange(info, row, column.field)"
            :multiple="column.multiple || false"
            :accept="column.accept"
          >
            <a-button size="small" type="primary" :disabled="!isFieldEditable(column, row)">
              <UploadOutlined />
              选择文件
            </a-button>
          </a-upload>
        </div>
        
        <!-- textarea类型 -->
        <a-textarea
          v-else-if="column.fieldType === 'textarea'"
          v-model:value="row[column.field]"
          :placeholder="column.placeholder || `请输入${column.title}`"
          :disabled="!isFieldEditable(column, row)"
          :rows="column.rows || 2"
          size="small"
          @change="() => handleFieldChange(row, column.field)"
        />
        
        <!-- switch类型 -->
        <a-switch
          v-else-if="column.fieldType === 'switch'"
          v-model:checked="row[column.field]"
          :checked-children="column.checkedText || '是'"
          :un-checked-children="column.uncheckedText || '否'"
          :disabled="!isFieldEditable(column, row)"
          size="small"
          @change="() => handleFieldChange(row, column.field)"
        />
        
        <!-- password类型 -->
        <a-input-password
          v-else-if="column.fieldType === 'password'"
          v-model:value="row[column.field]"
          :placeholder="column.placeholder || `请输入${column.title}`"
          :disabled="!isFieldEditable(column, row)"
          size="small"
          @change="() => handleFieldChange(row, column.field)"
        />
        
        <!-- imageUpload类型 -->
        <div v-else-if="column.fieldType === 'imageUpload'" class="image-upload-container">
          <a-upload
            :file-list="getFileList(row[column.field])"
            :before-upload="() => false"
            :disabled="!isFieldEditable(column, row)"
            @change="(info) => handleUploadChange(info, row, column.field)"
            list-type="picture-card"
            :multiple="column.multiple || false"
            :accept="column.accept || 'image/*'"
            :max-count="column.maxCount || 1"
            class="image-uploader"
          >
            <div v-if="isFieldEditable(column, row) && (!getFileList(row[column.field]) || getFileList(row[column.field]).length < (column.maxCount || 1))">
              <PlusOutlined />
              <div style="margin-top: 8px; font-size: 12px;">上传图片</div>
            </div>
          </a-upload>
        </div>
        
        <!-- email类型 -->
        <a-input
          v-else-if="column.fieldType === 'email'"
          v-model:value="row[column.field]"
          :placeholder="column.placeholder || `请输入${column.title}`"
          :disabled="!isFieldEditable(column, row)"
          size="small"
          type="email"
          @change="() => handleFieldChange(row, column.field)"
        />
        
        <!-- url类型 -->
        <a-input
          v-else-if="column.fieldType === 'url'"
          v-model:value="row[column.field]"
          :placeholder="column.placeholder || `请输入${column.title}`"
          :disabled="!isFieldEditable(column, row)"
          size="small"
          type="url"
          @change="() => handleFieldChange(row, column.field)"
        />
        
        <!-- phone类型 -->
        <a-input
          v-else-if="column.fieldType === 'phone'"
          v-model:value="row[column.field]"
          :placeholder="column.placeholder || `请输入${column.title}`"
          :disabled="!isFieldEditable(column, row)"
          size="small"
          @change="() => handleFieldChange(row, column.field)"
        />
        
        <!-- 默认显示文本 -->
        <span v-else>{{ row[column.field] }}</span>
      </template>
      
      <!-- 透传父组件的自定义插槽 -->
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
import { ref, computed, useSlots, watch, nextTick, onUnmounted } from 'vue';
import { 
  Input as AInput,
  InputNumber as AInputNumber,
  Select as ASelect,
  SelectOption as ASelectOption,
  DatePicker as ADatePicker,
  Upload as AUpload,
  Button as AButton,
  Textarea as ATextarea,
  Switch as ASwitch,
  InputPassword as AInputPassword
} from 'ant-design-vue';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { selectOptions } from '@/utils/index';

const props = defineProps({
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
  /** 加载状态 */
  loading: {
    type: Boolean,
    default: false
  },
  /** 表格高度 */
  height: {
    type: [String, Number],
    default: 'auto'
  },
  /** VXE表格编辑配置 */
  editConfig: {
    type: Object,
    default: () => ({
      trigger: 'click',
      mode: 'cell',
      showStatus: true
    })
  },
  /** 行配置 */
  rowConfig: {
    type: Object,
    default: () => ({ isHover: true })
  },
  /** 列配置 */
  columnConfig: {
    type: Object,
    default: () => ({ resizable: true })
  },
  /** 字典映射 */
  dictionaries: {
    type: Object,
    default: () => ({})
  },
  /** 字段计算规则 */
  computedFields: {
    type: Object,
    default: () => ({})
  },
  /** 数据验证规则 */
  validationRules: {
    type: Object,
    default: () => ({})
  },
  /** 是否显示验证错误 */
  showValidationErrors: {
    type: Boolean,
    default: true
  },
  /** 数据变化防抖延迟 (ms) */
  debounceDelay: {
    type: Number,
    default: 100
  }
});

const emit = defineEmits(['dataChange', 'update:data', 'cellClick', 'editActivated', 'editClosed', 'validationError']);

const gridRef = ref(null);
const slots = useSlots();
const internalData = ref([...props.data]);
const validationErrors = ref({}); // 存储验证错误

// 过滤掉动态生成的编辑插槽，避免冲突
const filteredSlots = computed(() => {
  const dynamicSlots = columnsWithFieldType.value.map(col => `${col.field}_edit`);
  const filtered = {};
  Object.keys(slots).forEach(key => {
    if (!dynamicSlots.includes(key)) {
      filtered[key] = slots[key];
    }
  });
  return filtered;
});

// 获取有fieldType的列
const columnsWithFieldType = computed(() => {
  return props.columns.filter(col => col.fieldType);
});

// 处理列配置
const processedColumns = computed(() => {
  return props.columns.map(col => {
    const processedCol = { ...col };
    
    // 如果有fieldType，设置编辑插槽
    if (col.fieldType) {
      processedCol.editRender = {};
      processedCol.slots = { 
        edit: `${col.field}_edit` 
      };
    }
    
    return processedCol;
  });
});

// 缓存编辑权限结果，避免重复计算
const editableCache = new Map();

/**
 * 检查字段是否可编辑（带缓存优化）
 */
const isFieldEditable = (column, row) => {
  // 生成缓存键
  const cacheKey = `${column.field}_${row.id || row.key || JSON.stringify(row)}`;
  
  // 检查缓存
  if (editableCache.has(cacheKey)) {
    return editableCache.get(cacheKey);
  }
  
  let result = true;
  
  // 1. 检查列配置的 disabled 属性
  if (column.disabled === true) {
    result = false;
  }
  // 2. 检查列配置的 editable 属性（优先级高于 disabled）
  else if (column.editable === false) {
    result = false;
  }
  // 3. 检查动态编辑函数
  else if (typeof column.editable === 'function') {
    try {
      result = column.editable(row, column);
    } catch (error) {
      console.warn(`字段 ${column.field} 编辑权限检查出错:`, error);
      result = false;
    }
  }
  // 4. 检查基于其他字段的编辑控制
  else if (column.editableBy) {
    const controlField = column.editableBy.field;
    const controlValue = column.editableBy.value;
    const currentValue = row[controlField];
    
    if (Array.isArray(controlValue)) {
      result = controlValue.includes(currentValue);
    } else {
      result = currentValue === controlValue;
    }
  }
  // 5. 检查基于其他字段的禁用控制
  else if (column.disabledBy) {
    const controlField = column.disabledBy.field;
    const controlValue = column.disabledBy.value;
    const currentValue = row[controlField];
    
    if (Array.isArray(controlValue)) {
      result = !controlValue.includes(currentValue);
    } else {
      result = currentValue !== controlValue;
    }
  }
  
  // 缓存结果（限制缓存大小，避免内存泄漏）
  if (editableCache.size > 1000) {
    editableCache.clear();
  }
  editableCache.set(cacheKey, result);
  
  return result;
};

// 清除编辑权限缓存
const clearEditableCache = () => {
  editableCache.clear();
};

// 智能数据同步：仅在必要时更新，避免覆盖用户编辑
let isInternalUpdate = false; // 标记是否为内部更新，避免循环

watch(() => props.data, (newData, oldData) => {
  if (isInternalUpdate) {
    isInternalUpdate = false;
    return;
  }
  
  // 检查是否真的需要更新（避免不必要的覆盖）
  const needsUpdate = shouldUpdateInternalData(newData, internalData.value);
  
  if (needsUpdate) {
    console.log('外部数据变化，同步到内部数据');
    // 使用智能合并，保留用户编辑但同步结构变化
    internalData.value = smartMergeData(newData, internalData.value);
    clearEditableCache();
    
    // 重新计算所有计算字段
    recalculateComputedFields();
  }
}, { deep: true });

/**
 * 智能合并数据：保留用户编辑，同步结构变化
 */
const smartMergeData = (newData, currentData) => {
  if (!newData || newData.length === 0) {
    return [...newData];
  }
  
  if (!currentData || currentData.length === 0) {
    return [...newData];
  }
  
  // 如果长度变化，说明有新增或删除，直接使用新数据
  if (newData.length !== currentData.length) {
    console.log('数据长度变化，使用新数据结构');
    return [...newData];
  }
  
  // 长度相同时，尝试保留用户编辑的数据
  const mergedData = [];
  
  for (let i = 0; i < newData.length; i++) {
    const newRow = newData[i];
    const currentRow = currentData[i];
    
    // 如果行标识符相同，合并数据（保留用户编辑）
    const newRowId = newRow?.id || newRow?.key || i;
    const currentRowId = currentRow?.id || currentRow?.key || i;
    
    if (newRowId === currentRowId) {
      // 合并行数据，优先保留当前数据中的编辑内容
      const mergedRow = { ...newRow };
      
      // 遍历当前行的所有字段
      Object.keys(currentRow).forEach(key => {
        // 保留用户可能编辑过的字段，但不覆盖系统字段
        if (!['id', 'key', '_status', '_dirty'].includes(key)) {
          // 如果字段值不同且不是undefined/null，优先保留当前值
          if (currentRow[key] !== undefined && currentRow[key] !== null) {
            mergedRow[key] = currentRow[key];
          }
        }
      });
      
      mergedData.push(mergedRow);
    } else {
      // 行标识符不同，使用新数据
      mergedData.push({ ...newRow });
    }
  }
  
  return mergedData;
};

/**
 * 判断是否需要更新内部数据
 */
const shouldUpdateInternalData = (newData, currentData) => {
  // 长度变化时肯定需要更新（新增/删除行）
  if (!newData || !currentData || newData.length !== currentData.length) {
    return true;
  }
  
  // 检查每行的关键字段是否变化（但不检查可编辑字段）
  for (let i = 0; i < newData.length; i++) {
    const newRow = newData[i];
    const currentRow = currentData[i];
    
    // 如果行不存在，说明数据结构发生了变化
    if (!newRow || !currentRow) {
      return true;
    }
    
    // 检查行标识符变化（优先检查id，再检查key，最后检查索引位置）
    const newRowId = newRow.id || newRow.key || i;
    const currentRowId = currentRow.id || currentRow.key || i;
    
    if (newRowId !== currentRowId) {
      return true;
    }
    
    // 检查是否有新的字段被添加（这种情况需要同步）
    const newKeys = Object.keys(newRow);
    const currentKeys = Object.keys(currentRow);
    
    if (newKeys.length !== currentKeys.length) {
      return true;
    }
    
    // 检查是否有重要的非编辑字段发生变化
    for (const key of newKeys) {
      // 只检查系统级字段，避免覆盖用户编辑的数据
      if (['id', 'key', '_status', '_dirty'].includes(key)) {
        if (newRow[key] !== currentRow[key]) {
          return true;
        }
      }
    }
  }
  
  return false;
};

/**
 * 重新计算所有计算字段
 */
const recalculateComputedFields = () => {
  if (!props.computedFields || Object.keys(props.computedFields).length === 0) {
    return;
  }
  
  nextTick(() => {
    internalData.value.forEach(row => {
      Object.keys(props.computedFields).forEach(targetField => {
        const rule = props.computedFields[targetField];
        try {
          let result;
          if (typeof rule.compute === 'function') {
            result = rule.compute(row);
          } else if (typeof rule.compute === 'string') {
            result = evaluateExpression(rule.compute, row);
          }
          
          if (result !== undefined && result !== null) {
            if (rule.precision !== undefined) {
              result = Number(result).toFixed(rule.precision);
              result = parseFloat(result);
            }
            row[targetField] = result;
          }
        } catch (error) {
          console.warn(`计算字段 ${targetField} 初始化时出错:`, error);
        }
      });
    });
  });
};

// 使用防抖优化数据变化监听
let dataChangeTimer = null;
const debouncedEmitDataChange = () => {
  if (dataChangeTimer) {
    clearTimeout(dataChangeTimer);
  }
  dataChangeTimer = setTimeout(() => {
    // 发送数据变化事件给父组件
    emit('dataChange', internalData.value);
    
    // 确保父组件能够获取到最新数据
    emit('update:data', internalData.value);
    
    // 在下一个tick标记为内部更新，避免触发循环
    nextTick(() => {
      isInternalUpdate = true;
    });
  }, props.debounceDelay); // 可配置防抖延迟
};

watch(internalData, debouncedEmitDataChange, { deep: true });

// 清理定时器和缓存
onUnmounted(() => {
  if (dataChangeTimer) {
    clearTimeout(dataChangeTimer);
  }
  clearEditableCache();
});

/**
 * 获取下拉选项
 */
const getSelectOptions = (column) => {
  // 优先使用列配置中的options
  if (column.options && Array.isArray(column.options)) {
    return column.options;
  }
  
  // 使用传入的字典数据
  if (column.dictKey && props.dictionaries[column.dictKey]) {
    return props.dictionaries[column.dictKey];
  }
  
  // 使用系统字典 (selectOptions)
  if (column.dictKey) {
    return selectOptions(column.dictKey);
  }
  
  return [];
};

/**
 * 获取文件列表
 */
const getFileList = (value) => {
  if (!value) return [];
  
  // 如果是字符串，尝试解析
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) || [];
    } catch {
      return value ? [{ name: value, url: value }] : [];
    }
  }
  
  // 如果是数组，直接返回
  if (Array.isArray(value)) {
    return value;
  }
  
  return [];
};

/**
 * 处理上传文件变化
 */
const handleUploadChange = (info, row, field) => {
  const { fileList } = info;
  row[field] = fileList;
  handleFieldChange(row, field);
};

/**
 * 处理字段变化
 */
const handleFieldChange = (row, field) => {
  console.log(`字段变化: ${field}`, row[field]);
  
  // 清除相关缓存
  clearEditableCache();
  
  // 确保行数据在internalData中存在
  const rowIndex = internalData.value.findIndex(item => {
    const itemId = item.id || item.key;
    const rowId = row.id || row.key;
    return itemId ? itemId === rowId : item === row;
  });
  
  if (rowIndex === -1) {
    console.warn('行数据不在内部数据中，可能存在同步问题');
    return;
  }
  
  // 确保数据同步到internalData
  internalData.value[rowIndex][field] = row[field];
  
  // 验证字段值
  if (props.validationRules[field]) {
    const validationResult = validateField(field, row[field], row);
    const rowKey = row.id || row.key || rowIndex;
    
    if (!validationResult.valid) {
      // 存储验证错误
      if (!validationErrors.value[rowKey]) {
        validationErrors.value[rowKey] = {};
      }
      validationErrors.value[rowKey][field] = validationResult.errors;
      
      // 发送验证错误事件
      emit('validationError', {
        row,
        field,
        errors: validationResult.errors,
        rowIndex: rowIndex
      });
    } else {
      // 清除验证错误
      if (validationErrors.value[rowKey]?.[field]) {
        delete validationErrors.value[rowKey][field];
        if (Object.keys(validationErrors.value[rowKey]).length === 0) {
          delete validationErrors.value[rowKey];
        }
      }
    }
  }
  
  // 处理计算字段
  handleComputedFields(row, field);
  
  // 处理字段编辑权限变化
  handleEditableChange(row, field);
  
  // 立即触发一次数据变化事件，确保父组件能够获取到数据
  nextTick(() => {
    emit('dataChange', internalData.value);
  });
  
  // 使用防抖发送变化事件（用于高频更新）
  debouncedEmitDataChange();
};

/**
 * 处理编辑权限变化
 */
const handleEditableChange = (row, changedField) => {
  // 强制重新渲染相关的编辑控件
  // 这里通过触发响应式更新来实现
  nextTick(() => {
    // Vue的响应式系统会自动处理重新计算 isFieldEditable
  });
};

/**
 * 处理计算字段逻辑
 */
const handleComputedFields = (row, changedField) => {
  if (!props.computedFields || Object.keys(props.computedFields).length === 0) {
    return;
  }

  // 遍历所有计算字段规则
  Object.keys(props.computedFields).forEach(targetField => {
    const rule = props.computedFields[targetField];
    
    // 检查当前变化的字段是否影响目标字段
    if (rule.dependencies && rule.dependencies.includes(changedField)) {
      try {
        let result;
        
        if (typeof rule.compute === 'function') {
          // 使用自定义计算函数
          result = rule.compute(row);
        } else if (typeof rule.compute === 'string') {
          // 使用表达式计算（简单的乘法、加法等）
          result = evaluateExpression(rule.compute, row);
        }
        
        // 更新目标字段的值
        if (result !== undefined && result !== null) {
          // 根据规则配置决定是否保留小数
          if (rule.precision !== undefined) {
            result = Number(result).toFixed(rule.precision);
            result = parseFloat(result);
          }
          
          row[targetField] = result;
        }
      } catch (error) {
        console.warn(`计算字段 ${targetField} 时出错:`, error);
      }
    }
  });
};

/**
 * 简单表达式计算器
 */
const evaluateExpression = (expression, row) => {
  // 支持简单的数学表达式，如 "a * b", "a + b", "a - b", "a / b"
  try {
    // 将表达式中的字段名替换为实际值
    let processedExpression = expression;
    
    // 查找所有字段名（假设字段名只包含字母、数字、下划线）
    const fieldNames = expression.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
    
    fieldNames.forEach(fieldName => {
      const fieldValue = row[fieldName];
      const numericValue = parseFloat(fieldValue) || 0;
      processedExpression = processedExpression.replace(new RegExp(`\\b${fieldName}\\b`, 'g'), numericValue);
    });
    
    // 使用 Function 构造器安全地执行表达式（仅支持基本数学运算）
    if (/^[\d\s+\-*/().]+$/.test(processedExpression)) {
      return new Function('return ' + processedExpression)();
    }
  } catch (error) {
    console.warn('表达式计算错误:', error);
  }
  
  return 0;
};

/**
 * 验证字段值
 */
const validateField = (field, value, row) => {
  const rules = props.validationRules[field];
  if (!rules) return { valid: true };

  const errors = [];
  
  if (Array.isArray(rules)) {
    for (const rule of rules) {
      const result = validateSingleRule(field, value, rule, row);
      if (!result.valid) {
        errors.push(result.message);
      }
    }
  } else {
    const result = validateSingleRule(field, value, rules, row);
    if (!result.valid) {
      errors.push(result.message);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
};

/**
 * 验证单个规则
 */
const validateSingleRule = (field, value, rule, row) => {
  try {
    // 必填验证
    if (rule.required && (value === undefined || value === null || value === '')) {
      return { valid: false, message: rule.message || `${field}是必填项` };
    }
    
    // 最小长度
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      return { valid: false, message: rule.message || `${field}最少${rule.minLength}个字符` };
    }
    
    // 最大长度
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return { valid: false, message: rule.message || `${field}最多${rule.maxLength}个字符` };
    }
    
    // 最小值
    if (rule.min && typeof value === 'number' && value < rule.min) {
      return { valid: false, message: rule.message || `${field}不能小于${rule.min}` };
    }
    
    // 最大值
    if (rule.max && typeof value === 'number' && value > rule.max) {
      return { valid: false, message: rule.message || `${field}不能大于${rule.max}` };
    }
    
    // 正则表达式验证
    if (rule.pattern && !rule.pattern.test(String(value))) {
      return { valid: false, message: rule.message || `${field}格式不正确` };
    }
    
    // 自定义验证函数
    if (typeof rule.validator === 'function') {
      const result = rule.validator(value, row);
      if (result !== true) {
        return { valid: false, message: typeof result === 'string' ? result : (rule.message || `${field}验证失败`) };
      }
    }
    
    return { valid: true };
  } catch (error) {
    console.warn(`字段 ${field} 验证规则执行出错:`, error);
    return { valid: false, message: `${field}验证规则出错` };
  }
};

/**
 * 单元格点击处理
 */
const handleCellClick = (params) => {
  emit('cellClick', params);
};

/**
 * 编辑激活处理
 */
const handleEditActivated = (params) => {
  emit('editActivated', params);
};

/**
 * 编辑关闭处理
 */
const handleEditClosed = (params) => {
  emit('editClosed', params);
};

/**
 * 获取表格数据
 */
const getTableData = () => {
  return internalData.value;
};

/**
 * 获取更新记录
 */
const getUpdateRecords = () => {
  return gridRef.value?.getUpdateRecords?.() || [];
};

/**
 * 获取表格引用
 */
const getGridRef = () => {
  return gridRef.value;
};

/**
 * 重置数据
 */
const resetData = () => {
  internalData.value = [...props.data];
};

/**
 * 验证数据
 */
const validate = () => {
  let isValid = true;
  const allErrors = {};
  
  // 验证所有行的所有字段
  internalData.value.forEach((row, rowIndex) => {
    const rowKey = row.id || row.key || rowIndex;
    
    Object.keys(props.validationRules).forEach(field => {
      const validationResult = validateField(field, row[field], row);
      if (!validationResult.valid) {
        isValid = false;
        if (!allErrors[rowKey]) {
          allErrors[rowKey] = {};
        }
        allErrors[rowKey][field] = validationResult.errors;
      }
    });
  });
  
  // 更新验证错误状态
  validationErrors.value = allErrors;
  
  if (!isValid && props.showValidationErrors) {
    console.warn('表格验证失败:', allErrors);
  }
  
  return {
    valid: isValid,
    errors: allErrors
  };
};

/**
 * 获取验证错误
 */
const getValidationErrors = () => {
  return validationErrors.value;
};

/**
 * 清除验证错误
 */
const clearValidationErrors = () => {
  validationErrors.value = {};
};

/**
 * 刷新表格
 */
const refreshGrid = () => {
  gridRef.value?.refresh?.();
};

// 暴露组件方法
defineExpose({
  getTableData,
  getUpdateRecords,
  getGridRef,
  resetData,
  validate,
  refreshGrid,
  getValidationErrors,
  clearValidationErrors,
  clearEditableCache
});
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.editable-grid {
  width: 100%;
  
  :deep(.custom-editable-grid) {
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
    
    // 编辑状态单元格
    .vxe-body--column.col--edit {
      background-color: #fff7e6;
      border: 1px solid @primary-color;
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
  }
}

.upload-container {
  width: 100%;
  
  :deep(.ant-upload) {
    width: 100%;
  }
  
  :deep(.ant-upload-list) {
    max-height: 100px;
    overflow-y: auto;
    margin-top: 4px;
  }
}

.image-upload-container {
  width: 100%;
  
  .image-uploader {
    :deep(.ant-upload-select) {
      width: 80px;
      height: 80px;
      margin-right: 8px;
      margin-bottom: 8px;
    }
    
    :deep(.ant-upload-list-picture-card-container) {
      width: 80px;
      height: 80px;
      margin-right: 8px;
      margin-bottom: 8px;
    }
    
    :deep(.ant-upload-list-picture-card .ant-upload-list-item) {
      width: 80px;
      height: 80px;
    }
    
    :deep(.ant-upload-list-picture-card .ant-upload-list-item-info) {
      height: 80px;
    }
    
    :deep(.ant-upload-list-picture-card .ant-upload-list-item-actions) {
      .ant-upload-list-item-action {
        opacity: 0.7;
      }
    }
  }
}

// 输入控件通用样式
:deep(.ant-input),
:deep(.ant-input-number),
:deep(.ant-select-selector),
:deep(.ant-picker) {
  border-radius: @border-radius-sm;
  
  &:focus,
  &:focus-within {
    border-color: @primary-color;
    box-shadow: 0 0 0 2px fade(@primary-color, 20%);
  }
}

:deep(.ant-input-number) {
  width: 100%;
}

:deep(.ant-select) {
  width: 100%;
}

:deep(.ant-textarea) {
  border-radius: @border-radius-sm;
  resize: vertical;
  
  &:focus {
    border-color: @primary-color;
    box-shadow: 0 0 0 2px fade(@primary-color, 20%);
  }
}

:deep(.ant-switch) {
  &.ant-switch-checked {
    background-color: @primary-color;
  }
}
</style>