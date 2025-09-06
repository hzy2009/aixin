# ModalForm 和 EditableGrid 组件

## 概述

这两个组件提供了一个完整的弹窗表单解决方案：
- `ModalForm.vue` - 弹窗容器组件
- `EditableGrid.vue` - 可编辑表格组件

## 功能特性

### ModalForm 弹窗组件
- 基于Ant Design Vue的Modal组件
- 支持自定义标题、宽度等属性
- 内置表格组件，支持数据双向绑定
- 提供确认、取消事件回调
- 支持确认按钮加载状态

### EditableGrid 表格组件
- 基于VXE Grid表格组件
- 支持多种字段类型的动态编辑控件
- 保持VXE Grid原有的插槽透传功能
- 支持字典数据和自定义选项
- **支持字段联动计算**：当某个字段值改变时，自动计算其他字段的值
- **支持字段级编辑控制**：精确控制每个字段的编辑权限，支持动态权限控制

## 支持的字段类型

| 字段类型 | 描述 | 对应控件 | 特殊属性 |
|---------|------|---------|---------|
| `input` | 文本输入 | a-input | placeholder |
| `number` | 数字输入 | a-input-number | min, max, step, precision |
| `positiveInteger` | 正整数 | a-input-number | 自动设置min=1, precision=0 |
| `select` | 下拉选择 | a-select | options, dictKey, allowClear |
| `date` | 日期选择 | a-date-picker | dateFormat, valueFormat |
| `datetime` | 日期时间选择 | a-date-picker | dateFormat, valueFormat, show-time |
| `upload` | 文件上传 | a-upload | accept, multiple |
| `imageUpload` | 图片上传 | a-upload | accept, multiple, maxCount |
| `textarea` | 多行文本 | a-textarea | rows |
| `switch` | 开关 | a-switch | checkedText, uncheckedText |
| `password` | 密码输入 | a-input-password | placeholder |
| `email` | 邮箱输入 | a-input | placeholder, type="email" |
| `url` | 网址输入 | a-input | placeholder, type="url" |
| `phone` | 手机号输入 | a-input | placeholder |

## 使用示例

### 基础用法

```vue
<template>
  <div>
    <a-button @click="showModal">打开表单</a-button>
    
    <ModalForm
      v-model="visible"
      title="编辑信息"
      :columns="columns"
      :data="formData"
      @ok="handleOk"
    />
  </div>
</template>

<script setup>
import ModalForm from '@/components/common/ModalForm.vue';

const visible = ref(false);

const columns = [
  {
    field: 'name',
    title: '姓名',
    fieldType: 'input',
    placeholder: '请输入姓名'
  },
  {
    field: 'age',
    title: '年龄',
    fieldType: 'positiveInteger'
  },
  {
    field: 'department',
    title: '部门',
    fieldType: 'select',
    options: [
      { label: '技术部', value: 'tech' },
      { label: '产品部', value: 'product' }
    ]
  }
];

const formData = ref([
  { name: '张三', age: 28, department: 'tech' }
]);
</script>
```

### 高级配置

```javascript
// 列配置示例
const columns = [
  {
    field: 'price',
    title: '价格',
    fieldType: 'number',
    min: 0,
    precision: 2,
    step: 0.01
  },
  {
    field: 'category',
    title: '分类',
    fieldType: 'select',
    dictKey: 'category_dict', // 使用字典
    allowClear: true
  },
  {
    field: 'publishDate',
    title: '发布日期',
    fieldType: 'datetime',
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    valueFormat: 'YYYY-MM-DD HH:mm:ss'
  },
  {
    field: 'attachment',
    title: '附件',
    fieldType: 'upload',
    accept: '.pdf,.doc,.docx',
    multiple: true
  }
];
```

### 字典数据配置

```vue
<!-- 方式1：使用系统字典 (推荐) -->
<EditableGrid
  :columns="columns"
  :data="tableData"
/>

<!-- columns 配置中使用 dictKey -->
const columns = [
  {
    field: 'category',
    title: '分类',
    fieldType: 'select',
    dictKey: 'category_type' // 直接使用系统字典键
  }
];

<!-- 方式2：传入自定义字典数据 -->
<EditableGrid
  :columns="columns"
  :data="tableData"
  :dictionaries="{
    category_dict: [
      { label: '电子', value: 'electronics' },
      { label: '服装', value: 'clothing' }
    ]
  }"
/>

<!-- 方式3：直接在列配置中提供选项 -->
const columns = [
  {
    field: 'department',
    title: '部门',
    fieldType: 'select',
    options: [
      { label: '技术部', value: 'tech' },
      { label: '产品部', value: 'product' }
    ]
  }
];
```

## 字段联动计算

支持字段之间的自动计算，当依赖字段值改变时，目标字段会自动更新。

### 基础用法

```vue
<EditableGrid
  :columns="columns"
  :data="tableData"
  :computed-fields="computedFields"
/>
```

### 计算字段配置

```javascript
// 计算字段规则配置
const computedFields = {
  // 目标字段名
  totalAmount: {
    dependencies: ['quantity', 'price'], // 依赖的字段列表
    compute: 'quantity * price',         // 计算表达式或函数
    precision: 2                         // 可选：保留小数位数
  },
  
  // 支持更复杂的表达式
  discountAmount: {
    dependencies: ['totalAmount', 'discountRate'],
    compute: 'totalAmount * discountRate / 100',
    precision: 2
  },
  
  // 使用自定义函数
  finalAmount: {
    dependencies: ['totalAmount', 'discountAmount'],
    compute: (row) => {
      const total = parseFloat(row.totalAmount) || 0;
      const discount = parseFloat(row.discountAmount) || 0;
      return Math.max(0, total - discount); // 确保不为负数
    },
    precision: 2
  }
};
```

### 表达式计算

支持的运算符：
- 加法：`a + b`
- 减法：`a - b`
- 乘法：`a * b`
- 除法：`a / b`
- 括号：`(a + b) * c`

示例表达式：
```javascript
// 简单乘法
compute: 'quantity * price'

// 复杂表达式
compute: '(price * quantity) * (1 - discount / 100)'

// 多个字段参与
compute: 'baseAmount + taxAmount - discountAmount'
```

### 完整示例

```vue
<template>
  <EditableGrid
    :columns="columns"
    :data="tableData"
    :computed-fields="computedFields"
  />
</template>

<script setup>
const columns = [
  { field: 'quantity', title: '数量', fieldType: 'positiveInteger' },
  { field: 'price', title: '单价', fieldType: 'number', precision: 2 },
  { field: 'totalAmount', title: '总金额', fieldType: 'number', disabled: true }
];

const computedFields = {
  totalAmount: {
    dependencies: ['quantity', 'price'],
    compute: 'quantity * price',
    precision: 2
  }
};
</script>
```

## 字段编辑权限控制

支持多种方式控制字段的编辑权限，提供灵活的权限控制机制。

### 基础编辑控制

```javascript
const columns = [
  // 1. 固定禁用字段
  {
    field: 'id',
    title: 'ID',
    fieldType: 'input',
    disabled: true  // 始终不可编辑
  },
  
  // 2. 固定启用编辑
  {
    field: 'name',
    title: '姓名',
    fieldType: 'input',
    editable: true  // 始终可编辑（默认值）
  },
  
  // 3. 固定禁用编辑
  {
    field: 'code',
    title: '编码',
    fieldType: 'input',
    editable: false  // 始终不可编辑
  }
];
```

### 基于其他字段的权限控制

```javascript
const columns = [
  // 控制字段
  {
    field: 'status',
    title: '状态',
    fieldType: 'select',
    options: [
      { label: '草稿', value: 'draft' },
      { label: '已提交', value: 'submitted' },
      { label: '已审核', value: 'approved' }
    ]
  },
  
  // 1. editableBy：只有当指定字段为某值时才可编辑
  {
    field: 'reason',
    title: '原因',
    fieldType: 'textarea',
    editableBy: {
      field: 'status',      // 依赖字段
      value: 'submitted'    // 只有状态为"已提交"时才可编辑
    }
  },
  
  // 2. disabledBy：当指定字段为某值时禁用编辑
  {
    field: 'content',
    title: '内容',
    fieldType: 'textarea',
    disabledBy: {
      field: 'status',    // 依赖字段
      value: 'approved'   // 状态为"已审核"时不可编辑
    }
  },
  
  // 3. 支持多个值的数组
  {
    field: 'priority',
    title: '优先级',
    fieldType: 'select',
    editableBy: {
      field: 'status',
      value: ['draft', 'submitted']  // 多个状态时可编辑
    }
  }
];
```

### 自定义函数控制

```javascript
const columns = [
  {
    field: 'amount',
    title: '金额',
    fieldType: 'number',
    // 使用自定义函数进行复杂的权限判断
    editable: (row, column) => {
      // 自定义逻辑：只有当状态为草稿且用户有权限时才可编辑
      return row.status === 'draft' && row.userRole === 'admin';
    }
  },
  
  {
    field: 'remarks',
    title: '备注',
    fieldType: 'textarea',
    // 基于多个条件的复合判断
    editable: (row) => {
      const canEdit = ['draft', 'pending'].includes(row.status);
      const isOwner = row.createdBy === getCurrentUserId();
      return canEdit && isOwner;
    }
  }
];
```

### 权限控制优先级

权限检查的优先级顺序（从高到低）：

1. **`disabled: true`** - 强制禁用，不可覆盖
2. **`editable: false`** - 明确禁用编辑
3. **`editable: function`** - 自定义函数控制
4. **`editableBy`** - 基于其他字段的启用条件
5. **`disabledBy`** - 基于其他字段的禁用条件
6. **默认可编辑** - 如果以上都不匹配，默认可编辑

### 完整示例

```vue
<template>
  <EditableGrid
    :columns="columns"
    :data="tableData"
  />
</template>

<script setup>
const columns = [
  { field: 'name', title: '姓名', fieldType: 'input' },
  
  // 状态控制字段
  {
    field: 'status',
    title: '状态',
    fieldType: 'select',
    options: [
      { label: '草稿', value: 'draft' },
      { label: '待审核', value: 'pending' },
      { label: '已审核', value: 'approved' },
      { label: '已拒绝', value: 'rejected' }
    ]
  },
  
  // 只有被拒绝时才能填写拒绝原因
  {
    field: 'rejectReason',
    title: '拒绝原因',
    fieldType: 'textarea',
    editableBy: { field: 'status', value: 'rejected' }
  },
  
  // 已审核后不能修改金额
  {
    field: 'amount',
    title: '金额',
    fieldType: 'number',
    disabledBy: { field: 'status', value: 'approved' }
  },
  
  // 复杂权限控制
  {
    field: 'priority',
    title: '优先级',
    fieldType: 'select',
    options: [
      { label: '低', value: 'low' },
      { label: '中', value: 'medium' },
      { label: '高', value: 'high' }
    ],
    editable: (row) => ['draft', 'pending'].includes(row.status)
  }
];
</script>
```

## API 文档

### ModalForm Props

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| modelValue | Boolean | false | 弹窗显示状态 |
| title | String | '表单编辑' | 弹窗标题 |
| width | String/Number | 800 | 弹窗宽度 |
| okText | String | '确定' | 确认按钮文字 |
| cancelText | String | '取消' | 取消按钮文字 |
| confirmLoading | Boolean | false | 确认按钮加载状态 |
| columns | Array | [] | 表格列配置 |
| data | Array | [] | 表格数据 |
| gridConfig | Object | {} | 表格其他配置 |

### ModalForm Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| ok | { data, updateRecords, originalData } | 确认事件 |
| cancel | - | 取消事件 |
| dataChange | data | 数据变化事件 |

### EditableGrid Props

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| columns | Array | [] | 列配置 |
| data | Array | [] | 表格数据 |
| loading | Boolean | false | 加载状态 |
| height | String/Number | 'auto' | 表格高度 |
| dictionaries | Object | {} | 字典数据 |
| computedFields | Object | {} | 计算字段配置 |

### EditableGrid Methods

| 方法名 | 说明 | 返回值 |
|--------|------|--------|
| getTableData() | 获取表格数据 | Array |
| getUpdateRecords() | 获取变更记录 | Array |
| resetData() | 重置数据 | - |
| validate() | 验证数据 | Boolean |

## 注意事项

1. 确保项目中已安装并配置了VXE Table
2. 字段类型区分大小写，请按照文档使用正确的类型名称
3. 上传类型的字段值会被转换为文件列表数组
4. 日期类型需要配置正确的格式化字符串
5. 组件支持VXE Grid的所有原生插槽透传功能
6. **字典数据优先级**：列配置中的 `options` > 传入的 `dictionaries` > 系统字典 `selectOptions(dictKey)`
7. 系统字典功能需要确保用户已登录且字典数据已加载
8. `imageUpload` 和 `upload` 的区别：前者使用卡片式布局，适合图片；后者使用列表式布局，适合文档文件
9. **计算字段建议设为只读**：通常计算得出的字段应该设置 `disabled: true` 避免用户手动修改
10. 计算表达式仅支持基本数学运算，复杂逻辑请使用自定义函数
11. 依赖字段值为空或非数字时，会被转换为 0 参与计算
12. **编辑权限实时响应**：当控制字段的值改变时，相关字段的编辑权限会立即更新
13. **权限控制优先级**：`disabled` > `editable` > `editableBy` > `disabledBy` > 默认可编辑
14. 自定义 `editable` 函数如果抛出异常，该字段将被设为不可编辑

## 完整示例

参考 `ModalFormExample.vue` 文件查看完整的使用示例。