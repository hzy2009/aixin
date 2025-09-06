<template>
  <div class="modal-form-example">
    <h3>ModalForm 和 EditableGrid 组件使用示例</h3>
    
    <a-button type="primary" @click="showModal">
      打开表单弹窗
    </a-button>
    
    <ModalForm
      v-model="modalVisible"
      title="编辑用户信息"
      :width="900"
      :columns="tableColumns"
      :data="tableData"
      :grid-config="gridConfig"
      :confirm-loading="loading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
      @dataChange="handleDataChange"
    />
    
    <div class="computed-fields-info">
      <h4>功能演示说明：</h4>
      <p><strong>📊 计算字段：</strong></p>
      <p>• 修改 <strong>数量</strong> 或 <strong>单价</strong>，<strong>总金额</strong> 会自动计算更新</p>
      
      <p><strong>🔒 编辑权限控制：</strong></p>
      <p>• <strong>拒绝原因</strong>：只有状态为"已拒绝"时才能编辑</p>
      <p>• <strong>审批人</strong>：状态为"草稿"时不能编辑</p>
      <p>• <strong>优先级</strong>：只有"草稿"或"待审核"状态时才能编辑</p>
      <p>• <strong>总金额</strong>：计算字段，始终只读</p>
      
      <p><strong>💡 使用提示：</strong>修改状态字段，观察其他字段的编辑权限变化</p>
    </div>
    
    <div class="example-data" v-if="resultData.length > 0">
      <h4>提交的数据：</h4>
      <pre>{{ JSON.stringify(resultData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Button as AButton, message } from 'ant-design-vue';
import ModalForm from './ModalForm.vue';

const modalVisible = ref(false);
const loading = ref(false);
const resultData = ref([]);

// 表格列配置示例
const tableColumns = ref([
  {
    field: 'name',
    title: '姓名',
    width: 120,
    fieldType: 'input',
    placeholder: '请输入姓名'
  },
  {
    field: 'age',
    title: '年龄',
    width: 100,
    fieldType: 'positiveInteger',
    placeholder: '请输入年龄',
    max: 120
  },
  {
    field: 'salary',
    title: '薪资',
    width: 120,
    fieldType: 'number',
    placeholder: '请输入薪资',
    min: 0,
    precision: 2
  },
  {
    field: 'department',
    title: '部门',
    width: 150,
    fieldType: 'select',
    placeholder: '请选择部门',
    options: [
      { label: '技术部', value: 'tech' },
      { label: '产品部', value: 'product' },
      { label: '设计部', value: 'design' },
      { label: '市场部', value: 'marketing' }
    ]
  },
  {
    field: 'category',
    title: '分类',
    width: 120,
    fieldType: 'select',
    placeholder: '请选择分类',
    dictKey: 'category_type' // 使用字典
  },
  {
    field: 'email',
    title: '邮箱',
    width: 180,
    fieldType: 'email',
    placeholder: '请输入邮箱地址'
  },
  {
    field: 'phone',
    title: '手机号',
    width: 150,
    fieldType: 'phone',
    placeholder: '请输入手机号'
  },
  {
    field: 'password',
    title: '密码',
    width: 150,
    fieldType: 'password',
    placeholder: '请输入密码'
  },
  {
    field: 'joinDate',
    title: '入职日期',
    width: 150,
    fieldType: 'date',
    placeholder: '请选择入职日期'
  },
  {
    field: 'lastLoginTime',
    title: '最后登录时间',
    width: 180,
    fieldType: 'datetime',
    placeholder: '请选择时间'
  },
  {
    field: 'isActive',
    title: '是否激活',
    width: 100,
    fieldType: 'switch',
    checkedText: '是',
    uncheckedText: '否'
  },
  {
    field: 'remark',
    title: '备注',
    width: 200,
    fieldType: 'textarea',
    placeholder: '请输入备注',
    rows: 3
  },
  {
    field: 'avatar',
    title: '头像',
    width: 150,
    fieldType: 'imageUpload',
    accept: 'image/*',
    multiple: false,
    maxCount: 1
  },
  {
    field: 'attachments',
    title: '附件',
    width: 150,
    fieldType: 'upload',
    accept: '.pdf,.doc,.docx',
    multiple: true
  },
  {
    field: 'quantity',
    title: '数量',
    width: 100,
    fieldType: 'positiveInteger',
    placeholder: '请输入数量'
  },
  {
    field: 'price',
    title: '单价',
    width: 120,
    fieldType: 'number',
    placeholder: '请输入单价',
    min: 0,
    precision: 2
  },
  {
    field: 'totalAmount',
    title: '总金额',
    width: 120,
    fieldType: 'number',
    placeholder: '自动计算',
    disabled: true // 计算字段通常设为只读
  },
  {
    field: 'status',
    title: '状态',
    width: 120,
    fieldType: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '草稿', value: 'draft' },
      { label: '待审核', value: 'pending' },
      { label: '已审核', value: 'approved' },
      { label: '已拒绝', value: 'rejected' }
    ]
  },
  {
    field: 'reason',
    title: '拒绝原因',
    width: 200,
    fieldType: 'textarea',
    placeholder: '请输入拒绝原因',
    rows: 2,
    // 只有当状态为"已拒绝"时才能编辑
    editableBy: {
      field: 'status',
      value: 'rejected'
    }
  },
  {
    field: 'approver',
    title: '审批人',
    width: 120,
    fieldType: 'input',
    placeholder: '请输入审批人',
    // 当状态为"草稿"时不能编辑
    disabledBy: {
      field: 'status',
      value: 'draft'
    }
  },
  {
    field: 'priority',
    title: '优先级',
    width: 100,
    fieldType: 'select',
    placeholder: '请选择优先级',
    options: [
      { label: '低', value: 'low' },
      { label: '中', value: 'medium' },
      { label: '高', value: 'high' },
      { label: '紧急', value: 'urgent' }
    ],
    // 使用自定义函数控制编辑权限
    editable: (row) => {
      // 只有状态为"草稿"或"待审核"时才能编辑优先级
      return ['draft', 'pending'].includes(row.status);
    }
  }
]);

// 表格数据示例
const tableData = ref([
  {
    id: 1,
    name: '张三',
    age: 28,
    salary: 8000.50,
    department: 'tech',
    category: 'A',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    password: '',
    joinDate: '2023-01-15',
    lastLoginTime: '2024-01-15 14:30:00',
    isActive: true,
    remark: '技术骨干，工作认真负责',
    avatar: [],
    attachments: [],
    quantity: 10,
    price: 299.99,
    totalAmount: 2999.90,
    status: 'draft',
    reason: '',
    approver: '',
    priority: 'medium'
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    salary: 12000.00,
    department: 'product',
    category: 'B',
    email: 'lisi@example.com',
    phone: '13800138002',
    password: '',
    joinDate: '2022-06-20',
    lastLoginTime: '2024-01-15 16:45:00',
    isActive: false,
    remark: '产品经理，经验丰富',
    avatar: [],
    attachments: [],
    quantity: 5,
    price: 1580.50,
    totalAmount: 7902.50,
    status: 'rejected',
    reason: '价格过高，需要重新评估',
    approver: '张经理',
    priority: 'high'
  },
  {
    id: 3,
    name: '王五',
    age: 26,
    salary: 6500.75,
    department: 'design',
    category: 'A',
    email: 'wangwu@example.com',
    phone: '13800138003',
    password: '',
    joinDate: '2023-09-10',
    lastLoginTime: '2024-01-14 09:15:00',
    isActive: true,
    remark: 'UI设计师，创意十足',
    avatar: [],
    attachments: [],
    quantity: 8,
    price: 699.00,
    totalAmount: 5592.00,
    status: 'approved',
    reason: '',
    approver: '李总监',
    priority: 'low'
  }
]);

// 计算字段配置
const computedFields = reactive({
  // totalAmount = quantity * price
  totalAmount: {
    dependencies: ['quantity', 'price'], // 依赖的字段
    compute: 'quantity * price',         // 计算表达式
    precision: 2                         // 保留2位小数
  }
});

// 表格配置
const gridConfig = reactive({
  height: 400,
  editConfig: {
    trigger: 'click',
    mode: 'cell',
    showStatus: true
  },
  rowConfig: {
    isHover: true,
    keyField: 'id'
  },
  computedFields: computedFields
});

/**
 * 显示弹窗
 */
const showModal = () => {
  modalVisible.value = true;
};

/**
 * 弹窗确认
 */
const handleModalOk = async (result) => {
  loading.value = true;
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    resultData.value = result.data;
    modalVisible.value = false;
    
    message.success('数据提交成功！');
  } catch (error) {
    message.error('提交失败，请重试！');
  } finally {
    loading.value = false;
  }
};

/**
 * 弹窗取消
 */
const handleModalCancel = () => {
  console.log('用户取消了操作');
};

/**
 * 数据变化处理
 */
const handleDataChange = (data) => {
  console.log('表格数据变化：', data);
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.modal-form-example {
  padding: @spacing-lg;
  
  h3 {
    color: @text-color-primary;
    margin-bottom: @spacing-lg;
    font-size: 18px;
    font-weight: 600;
  }
  
  .computed-fields-info {
    margin-top: @spacing-lg;
    padding: @spacing-md;
    background: #e6f7ff;
    border-radius: @border-radius-base;
    border: 1px solid #91d5ff;
    
    h4 {
      color: @text-color-primary;
      margin-bottom: @spacing-sm;
      font-size: 14px;
      font-weight: 600;
    }
    
    p {
      margin: @spacing-xs 0;
      color: @text-color-secondary;
      font-size: 13px;
      line-height: 1.5;
      
      strong {
        color: @primary-color;
        font-weight: 500;
      }
    }
  }
  
  .example-data {
    margin-top: @spacing-lg;
    padding: @spacing-md;
    background: #f8f9fa;
    border-radius: @border-radius-base;
    border: 1px solid #e9ecef;
    
    h4 {
      color: @text-color-primary;
      margin-bottom: @spacing-sm;
      font-size: 14px;
      font-weight: 500;
    }
    
    pre {
      background: #ffffff;
      border: 1px solid #dee2e6;
      border-radius: @border-radius-sm;
      padding: @spacing-sm;
      font-size: 12px;
      line-height: 1.4;
      overflow-x: auto;
      margin: 0;
    }
  }
}
</style>