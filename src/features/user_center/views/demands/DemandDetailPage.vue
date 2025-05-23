<template>
  <div class="demand-detail-page">
    <div class="page-header">
      <h2 class="page-title">国产替代寻源详情</h2>
      <span class="demand-id">ID: {{ demandId }}</span>
      <a-button @click="goBack" class="back-button">
        <LeftOutlined /> 返回
      </a-button>
    </div>

    <div v-if="isLoading" class="loading-state">
      <a-spin size="large" />
    </div>
    <div v-else-if="error" class="error-state">
      <a-alert type="error" :message="error" show-icon />
    </div>
    <div v-else-if="demandDetailData" class="content-wrapper">
      <!-- Section: 国产寻源基本信息 -->
      <section class="info-section">
        <div class="section-header">
          <span class="decorator"></span>
          <h3 class="section-title">国产寻源基本信息</h3>
        </div>
        <DynamicForm
          ref="basicInfoFormRef"
          :form-config="basicInfoFormConfig"
          :initial-model="formModel"
          :is-edit-mode="isEditMode"
          :default-span="12"
          form-layout="vertical"
          @submit="handleFormSubmit"
        />
      </section>

      <!-- Section: 国产寻源代寻源状态 -->
      <section class="info-section status-history-section">
        <div class="section-header">
          <span class="decorator"></span>
          <h3 class="section-title">国产寻源代寻源状态</h3>
        </div>
        <a-table
          :columns="statusHistoryColumns"
          :data-source="demandDetailData.statusHistory"
          :pagination="false"
          row-key="seq"
          bordered
          size="small"
        >
        </a-table>
      </section>

      <div class="page-actions">
        <template v-if="isEditMode">
          <a-button @click="cancelEdit">取消</a-button>
          <a-button type="primary" @click="submitForm" :loading="isSaving" style="margin-left: 8px;">保存</a-button>
        </template>
        <template v-else>
          <a-button type="primary" @click="() => toggleEditMode(true)">编辑</a-button>
        </template>
      </div>

    </div>
    <div v-else class="no-data-state">
      <a-empty description="未找到需求详情" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button as AButton, Spin as ASpin, Alert as AAlert, Empty as AEmpty, Table as ATable } from 'ant-design-vue';
import { LeftOutlined } from '@ant-design/icons-vue';
import DynamicForm from '../../components/DynamicForm.vue';
import { useDemandDetail } from '../../composables/useDemandDetail.js';

const route = useRoute();
const router = useRouter();

const demandId = computed(() => route.params.demandId || 'A00092347'); // Get ID from route or default for mock
const demandType = computed(() => route.query.type || 'alternativeSourcing'); // Example type from query

const {
  demandDetail: demandDetailData, // Renamed to avoid conflict with component's demandDetail
  isLoading,
  isEditMode,
  error,
  fetchDemandDetail,
  saveDemandDetail,
  toggleEditMode,
} = useDemandDetail(demandId.value, demandType.value);

const basicInfoFormRef = ref(null); // Ref for DynamicForm component
const isSaving = ref(false); // For save button loading state

// Reactive form model for DynamicForm, initialized from fetched detail
const formModel = ref({});

watch(demandDetailData, (newDetail) => {
  if (newDetail) {
    // Map fetched data to the form model structure
    formModel.value = {
      sourcingType: newDetail.sourcingType,
      validUntil: newDetail.validUntil, // Ensure date format matches DatePicker if needed
      status: newDetail.status,
      remarks: newDetail.remarks,
      // ... map other fields from newDetail to formModel
    };
  } else {
    formModel.value = {}; // Reset if detail is null
  }
}, { deep: true, immediate: true });


// Configuration for the "国产寻源基本信息" form
const basicInfoFormConfig = computed(() => [
  {
    label: '寻源件类型', field: 'sourcingType', fieldType: 'select',
    options: [ // TODO: These options might come from an API or constants file
      { value: 'pump', label: 'Pump' }, { value: 'mfc', label: 'MFC' },
      { value: 'sensor', label: 'Sensor' }, { value: 'valve', label: 'Valve' }
    ],
    rules: [{ required: true, message: '请选择寻源件类型!' }],
    span: 12
  },
  {
    label: '需求有效期', field: 'validUntil', fieldType: 'date',
    rules: [{ required: true, message: '请选择需求有效期!' }],
    span: 12
  },
  {
    label: '寻源件状态', field: 'status', fieldType: 'select', // Changed to select for consistency
    options: [ // TODO: These options might come from an API or constants file
      { value: 'published', label: '寻源发布' }, { value: 'sourcing', label: '寻源中' },
      { value: 'matched', label: '已匹配' }, { value: 'closed', label: '已关闭' }
    ],
    rules: [{ required: true, message: '请选择寻源状态!' }],
    span: 12
  },
   {
    label: '备注信息', field: 'remarks', fieldType: 'textarea', rows: 3,
    span: 24,
    placeholder: '请输入备注信息 (最多200字)',
    rules: [{ max: 200, message: '备注信息不能超过200字' }]
  },
  // Add more fields like '项目预算(万元)', '期望交付时间', '技术要求概述' etc.
  // Example for a disabled display field from the design (like registration time)
  // {
  //   label: '发布时间', field: 'publishDate', fieldType: 'input', disabled: true,
  //   displayFormatter: (val) => val || '-', // Shows value or '-' if undefined
  //   span: 12
  // },
]);

// Columns for the "国产寻源代寻源状态" table
const statusHistoryColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '完成日期', dataIndex: 'date', key: 'date' },
  { title: '单号', dataIndex: 'orderNo', key: 'orderNo' },
  { title: '时间', dataIndex: 'time', key: 'time' },
  { title: '备注', dataIndex: 'note', key: 'note' },
];

const submitForm = async () => {
  try {
    await basicInfoFormRef.value?.validate(); // Validate the DynamicForm
    isSaving.value = true;
    // The formModel is already reactive and bound to DynamicForm's internal model
    await saveDemandDetail(formModel.value);
  } catch (validationError) {
    console.log('Form validation failed:', validationError);
    // AntD form validation errors are usually shown on fields directly
  } finally {
    isSaving.value = false;
  }
};

const handleFormSubmit = (formData) => { // This is called by DynamicForm on its internal finish
    // This can be used if DynamicForm has its own submit button,
    // but here we are controlling submission from the parent.
    console.log("DynamicForm submitted, but parent handles save:", formData);
    // submitForm(); // Call parent's submit logic
};

const cancelEdit = () => {
  toggleEditMode(false);
  // Reset form to original fetched data
  if (demandDetailData.value) {
    formModel.value = {
      sourcingType: demandDetailData.value.sourcingType,
      validUntil: demandDetailData.value.validUntil,
      status: demandDetailData.value.status,
      remarks: demandDetailData.value.remarks,
    };
    // If DynamicForm exposes resetFields, and you want to clear validation states:
    basicInfoFormRef.value?.resetFields(); // This resets to initialModel passed to DynamicForm
    basicInfoFormRef.value?.clearValidate();
  }
};

const goBack = () => {
  router.go(-1); // Or router.push({ name: 'MyDemands' });
};

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.demand-detail-page {
  background-color: @background-color-base; // Assuming content area is white
  // padding: @spacing-lg; // Padding is handled by UserCenterLayout's content area
  // border-radius: @border-radius-base;
  // box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: @spacing-xl;
  padding-bottom: @spacing-lg;
  border-bottom: 1px solid @border-color-light;

  .page-title {
    font-size: 20px;
    font-weight: 600;
    color: @text-color-base;
    margin: 0;
  }
  .demand-id {
    margin-left: @spacing-md;
    font-size: 14px;
    color: @text-color-secondary;
    background-color: #f0f2f5;
    padding: 2px 8px;
    border-radius: @border-radius-sm;
  }
  .back-button {
    margin-left: auto; // Pushes button to the right
    color: @text-color-secondary;
    border-color: @border-color-base;
    &:hover {
        color: @primary-color;
        border-color: @primary-color;
    }
    .anticon {
        margin-right: 4px;
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
  text-align: right; // Align buttons to the right
  margin-top: @spacing-xl;
  padding-top: @spacing-lg;
  border-top: 1px solid @border-color-light;
}

.loading-state, .error-state, .no-data-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: @spacing-xl;
}
</style>