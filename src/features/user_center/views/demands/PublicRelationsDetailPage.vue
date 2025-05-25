<template>
  <div class="demand-detail-page">
    <div v-if="isLoading" class="loading-state"> <a-spin size="large" /> </div>
    <div v-else-if="error && !demandDetailData" class="error-state"> <a-alert type="error" :message="error" show-icon />
    </div>
    <div v-else-if="demandDetailData" class="content-wrapper">
      <div class="detail-header-info">
        <h2 class="main-title">{{ pageTitle }}</h2>
        <span v-if="operationMode !== 'create'" class="demand-id-display">ID: {{ demandDetailData.id }}</span>
      </div>

      <section class="info-section">
        <div class="section-header">
          <span class="decorator"></span>
          <h3 class="section-title">基本信息</h3>
        </div>
        <DynamicForm ref="dynamicFormRef" :form-config="currentFormConfig" :initial-model="formModel"
          :is-edit-mode="isFormEditable" :default-span="12" form-layout="vertical" />
      </section>

      <section v-if="canViewStatusHistoryTable && operationMode !== 'create'"
        class="info-section status-history-section">
        <div class="section-header">
          <span class="decorator"></span>
          <h3 class="section-title">{{ demandTypeDisplayName }}状态</h3>
        </div>
        <a-table :columns="statusHistoryColumns" :data-source="demandDetailData.statusHistory" :pagination="false"
          row-key="seq" bordered size="small" />
      </section>

      <div class="page-actions">
        <!-- "取消" 按钮：新建时是“重置”，编辑查看时是“返回”或“取消编辑” -->
        <a-button @click="handleCancelAction">{{ cancelActionText }}</a-button>
        <!-- "保存" 或 "提交" 按钮：仅在可编辑时显示 -->
        <a-button v-if="isFormEditable" type="primary" @click="handleSubmitForm" :loading="isSubmitting"
          style="margin-left: 8px;">
          {{ operationMode === 'create' ? '提交创建' : '保存修改' }}
        </a-button>
      </div>

    </div>
    <div v-else class="no-data-state"> <a-empty description="未找到需求详情或无法创建" /> </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button as AButton, Spin as ASpin, Alert as AAlert, Empty as AEmpty, Table as ATable, Breadcrumb as ABreadcrumb, BreadcrumbItem as ABreadcrumbItem, message } from 'ant-design-vue';
import DynamicForm from '../../components/DynamicForm.vue';
import { useDemandDetail } from './hooks/useDemandDetail.js';
import { useAuthStore } from '@/store/authStore';

const props = defineProps({
  demandIdProp: { type: String, default: null },
  mode: { type: String, default: 'view' }, // 'create', 'view'
  demandType: { type: String, default: 'rndCollaboration' }, // e.g., 'domestic', 'originalSourcing'
  business_type: { type: String, default: 'rndCollaboration' }, // 业务类型
});

const router = useRouter();

const {
  demandDetail: demandDetailData,
  isLoading,
  error,
  operationMode, // 现在从 hook 中获取
  canEditThisDemand,
  canViewStatusHistoryTable,
  fetchDemandDetail,
  submitDemand,
} = useDemandDetail({
  demandIdProp: props.demandIdProp, mode: props.mode, business_type: props.business_type, url: {
    add: 'apm/apmInspection/add',
    edit: 'apm/apmInspection/edit',
    detail: 'apm/apmInspection/queryById',
    submit: 'apm/apmInspection/submit',
    delete: 'apm/apmInspection/delete',
  }
});
const dynamicFormRef = ref(null);
const isSubmitting = ref(false); // 用于提交按钮的 loading 状态
const formModel = ref({});


// 监听从 hook 获取的原始数据，用于初始化/更新表单模型
watch(demandDetailData, (newDetail) => {
  if (newDetail) {
    formModel.value = JSON.parse(JSON.stringify(newDetail)); // 深拷贝以编辑
  } else if (operationMode.value === 'create') {
    // 如果是新建模式且 newDetail 为 null（例如 hook 初始化时），确保 formModel 有基础结构
    formModel.value = { // 根据 demandType 设置默认值
      expireDate: null,
      // ... 其他类型需要的默认字段 ...
    };
  } else {
    formModel.value = {};
  }
}, { deep: true, immediate: true });


// 表单是否真的可编辑：取决于操作模式和权限
const isFormEditable = computed(() => {
  if (operationMode.value === 'create') return true; // 新建模式下表单总是可编辑
  return canEditThisDemand.value; // 查看模式下，取决于权限
});


// --- 表单配置 ---
// TODO: 为每种 demandType 定义具体的表单配置
const formConfigs = {
  base: [
    // , rules: [{ required: true, message: '必填!' }]
    { label: '研发公关方向', field: 'rdType', fieldType: 'select', dictKey: 'rnd_pr_strategic_goals', span: 24 },
    { label: '研发公关需求', field: 'sourceDesc', fieldType: 'input', span: 24, },
    { label: '研发公关最新需求状态', field: 'statusCode', fieldType: 'select', dictKey: 'rd_breakthrough_status', span: 24, disabled: true },
    { label: '需求有效期', field: 'expireDate', fieldType: 'date', rules: [{ required: true, message: '必填!' }], span: 24, },
  ],
  originalSourcing: [
    { label: '品牌', field: 'manufacturer', fieldType: 'select', options: [{ value: 'ti', label: 'TI' }], rules: [{ required: true, message: '必填!' }], span: 24 },
    { label: '器件分类', field: 'partCategory', fieldType: 'select', options: [{ value: 'mcu', label: 'MCU' }], rules: [{ required: true, message: '必填!' }], span: 24 },
    { label: '需求有效期', field: 'expireDate', fieldType: 'date', rules: [{ required: true, message: '必填!' }], span: 24 },
    { label: '供货状态', field: 'availability', fieldType: 'select', options: [{ value: 'inStock', label: '现货' }], rules: [{ required: true, message: '必填!' }], span: 24 },
    { label: '详细描述', field: 'description', fieldType: 'textarea', rows: 3, span: 24 },
    // ... 其他 "原厂件" 字段 ...
  ],
  // ... 为 rndCollaboration, testingValidation 等也定义配置 ...
};

const currentFormConfig = computed(() => {
  const baseConfig = formConfigs.base || [];
  // 根据 isFormEditable 动态调整规则的 required 状态
  return baseConfig.map(field => ({
    ...field,
    rules: field.rules ? field.rules.map(rule => ({
      ...rule,
      // 只有在表单可编辑时，required 才真正生效
      required: isFormEditable.value ? rule.required : false
    })) : []
  }));
});

const statusHistoryColumns = [{ title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center' }, { title: '状态', dataIndex: 'status', key: 'status' }, { title: '完成日期', dataIndex: 'date', key: 'date' }, { title: '单号', dataIndex: 'orderNo', key: 'orderNo' }, { title: '时间', dataIndex: 'time', key: 'time' }, { title: '备注', dataIndex: 'note', key: 'note' },];

const handleSubmitForm = async () => {
  try {
    await dynamicFormRef.value?.validate();
    const params = dynamicFormRef.value?.getAllData()
    isSubmitting.value = true;
    const success = await submitDemand(params);
    if (success && operationMode.value !== 'create') { // 编辑成功
      // 此时 hook 内部的 operationMode 可能已变回 'view'，或者 demandDetailData 已更新
      // isFormEditable 会自动更新
    } else if (success && operationMode.value === 'create') {
      // 新建成功，hook内部已处理跳转和状态更新
      router.go(-1); // 或者跳转到列表页
    }
  } catch (validationError) {
    console.log('表单校验失败:', validationError);
  } finally {
    isSubmitting.value = false;
  }
};

const cancelActionText = computed(() => {
  if (operationMode.value === 'create') return '重置表单';
  if (isFormEditable.value) return '放弃修改'; // 如果是从查看模式点击编辑按钮后
  return '关闭'; // 默认查看模式下，取消按钮可能是关闭/返回
});

const handleCancelAction = () => {
  if (operationMode.value === 'create') {
    // 重置表单到初始/默认状态
    if (dynamicFormRef.value) dynamicFormRef.value.resetFields(); // AntD form reset
    // 手动重置 formModel 到创建时的初始状态
    formModel.value = JSON.parse(JSON.stringify(demandDetailData.value || { // 使用hook中的初始值
      expireDate: null,
    }));
    message.info('表单已重置');
  } else { // 查看或编辑模式
    // 如果当前是可编辑状态（意味着用户可能修改了数据），则恢复到原始数据
    if (isFormEditable.value && demandDetailData.value) {
      formModel.value = JSON.parse(JSON.stringify(demandDetailData.value));
      if (dynamicFormRef.value) dynamicFormRef.value.clearValidate();
      message.info('修改已取消');
      // 注意：这里不改变 operationMode，因为 "放弃修改" 后用户应仍在查看页面。
      // 如果你的逻辑是 "放弃修改" = "返回上一页"，则调用 goBack()
    } else {
      // 如果是查看模式，"取消" 按钮等同于 "返回"
      goBack();
    }
  }
};


const goBack = () => {
  router.go(-1); // 或 router.push({ name: 'MyDemandsList' })
};

const demandTypeDisplayName = ref('研发攻关')
const pageTitle = computed(() => {
  if (operationMode.value === 'create') {
    return `新建${demandTypeDisplayName.value}`;
  }
  return `${demandTypeDisplayName.value}详情`;
});


// 当路由参数（尤其是 demandIdProp）实际发生变化时，重新加载数据
// 这主要用于：用户在详情页A，通过某种方式（非浏览器前进后退）直接导航到详情页B
watch(() => props.demandIdProp, (newId) => {
  if (newId && operationMode.value !== 'create') { // 仅在非新建模式下，ID变化才触发重新加载
    // 更新 hook 内部的 ID (如果 hook 设计为可重用实例，否则 hook 会在路由切换时重新创建)
    // useDemandDetail 每次路由组件渲染时都会重新执行，所以这里主要是确保 props 更新后 hook 能拿到新ID
    fetchDemandDetail();
  } else if (!newId && operationMode.value !== 'create') {
    // 如果从有ID的路由变到没有ID的路由（理论上不应直接发生，应走/new），则清空
    demandDetailData.value = null;
  }
});

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.demand-detail-page {
  background-color: @background-color-base; // Assuming content area is white
  // padding: @spacing-lg; // Padding is handled by UserCenterLayout's content area
  // border-radius: @border-radius-base;
  // box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.page-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: @spacing-md;
  margin-bottom: @spacing-lg;
  border-bottom: 1px solid @border-color-light;
}

.page-breadcrumb {
  font-size: 14px;
  // No margin needed if it's part of flex
}

.detail-header-info {
  margin-bottom: @spacing-xl;
  display: flex;
  align-items: baseline; // Align title and ID nicely

  .main-title {
    font-size: 20px;
    font-weight: 600;
    color: @text-color-base;
    margin: 0;
  }

  .demand-id-display {
    margin-left: @spacing-md;
    font-size: 14px;
    color: @text-color-secondary;
    background-color: #f0f2f5;
    padding: 3px 10px;
    border-radius: @border-radius-sm;
  }
}

.info-section {
  margin-bottom: @spacing-xxl;

  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: @spacing-lg;

    .decorator {
      width: 4px;
      height: 16px; // Slightly shorter decorator
      background-color: @primary-color;
      margin-right: @spacing-sm;
      // No border-radius needed to match design
    }

    .section-title {
      font-size: 16px;
      font-weight: 500; // Less bold section title
      color: @text-color-base;
      margin: 0;
    }
  }
}


.info-section {
  margin-bottom: @spacing-xxl;

  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: @spacing-lg;

    .decorator {
      width: 4px;
      height: 18px;
      background-color: @primary-color;
      margin-right: @spacing-sm;
      border-radius: 2px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: @text-color-base;
      margin: 0;
    }
  }
}

.status-history-section {
  :deep(.ant-table-thead > tr > th) {
    background-color: #fafafa;
    font-weight: 500;
  }

  :deep(.ant-table-tbody > tr > td) {
    font-size: 13px;
  }
}


.page-actions {
  text-align: left; // Buttons are left-aligned in this design screenshot
  margin-top: @spacing-xl;
  padding-top: @spacing-lg;
  border-top: 1px solid @border-color-light;

  .ant-btn {
    min-width: 80px; // Ensure buttons have some width
  }
}

.loading-state,
.error-state,
.no-data-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: @spacing-xl;
}
</style>