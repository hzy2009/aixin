<template>
    <div class="demand-detail-page">
        <div v-if="isLoading" class="loading-state"> <a-spin size="large" /> </div>
        <div v-else-if="error && !demandDetailData" class="error-state"> <a-alert type="error" :message="error"
                show-icon />
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
                    :is-edit-mode="isFormEditable || isManagerAdmin" :default-span="12" form-layout="vertical" />
            </section>

            <section v-if="isManagerAdmin && operationMode !== 'create'" class="info-section status-history-section">
                <div class="section-header">
                    <span class="decorator"></span>
                    <!-- <h3 class="section-title">{{ demandTypeDisplayName }}状态</h3> -->
                    <h3 class="section-title">历史状态</h3>
                </div>
                <a-table :columns="statusHistoryColumns" :data-source="demandDetailData.logList" :pagination="false"
                    row-key="seq" bordered size="small" />
            </section>

            <div class="page-actions">
                <a-button @click="goBack">{{ '返回' }}</a-button>
                <!-- "保存" 或 "提交" 按钮：仅在可编辑时显示 -->
                <a-button v-if="isFormEditable" type="primary" @click="save" :loading="isSubmitting"
                    style="margin-left: 8px;">
                    {{ '保存' }}
                </a-button>
                <a-button v-if="isFormEditable" type="primary" @click="handleSubmitForm" :loading="isSubmitting"
                    style="margin-left: 8px;">
                    {{ '提交' }}
                </a-button>
                <a-button v-if="isManagerAdmin" type="primary" @click="save" :loading="isSubmitting"
                    style="margin-left: 8px;">
                    {{ '审批' }}
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

const props = defineProps({
    demandIdProp: { type: String, default: null },
    mode: { type: String, default: 'view' }, // 'create', 'view'
    demandType: { type: String, default: 'domestic' }, // e.g., 'domestic', 'originalSourcing'
});

const router = useRouter();
console.log('DemandDetailPage props:', props.demandType);

const {
    demandDetail: demandDetailData,
    isLoading,
    error,
    operationMode, // 现在从 hook 中获取
    canEditThisDemand,
    isManagerAdmin,
    fetchDemandDetail,
    handleSave,
    handleSubmit,
} = useDemandDetail({
    demandIdProp: props.demandIdProp, mode: props.mode, demandTypeProp: props.demandType, url: {
        add: 'apm/apmSourcing/add',
        edit: 'apm/apmSourcing/edit',
        detail: 'apm/apmSourcing/queryById',
        submit: 'apm/apmSourcing/submit',
        delete: 'apm/apmSourcing/delete',
    },
    otherParams: {
        sourcingType: '原厂件寻源',
        // 其他参数
    },
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
const formConfigs = [
    { label: '寻源件类型', field: 'reqPartsType', fieldType: 'select', dictKey: 'req_parts_type', span: 24, disabled: isManagerAdmin.value },
    { label: '需求有效期', field: 'expireDate', fieldType: 'date', rules: [{ required: true, message: '必填!' }], span: 24, disabled: isManagerAdmin.value },
    {
        label: '寻源件状态', field: 'statusCode', detailField: 'statusName', fieldType: 'select', dictKey: 'sourcing_status', span: 24, disabled: !isManagerAdmin.value,
        onChange: ({ value, form, options }) => {
            form.statusName = options.find(opt => opt.value === value)?.label || '';
        }
    },
]

const currentFormConfig = computed(() => {
    const baseConfig = formConfigs || [];
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

const statusHistoryColumns = [
    { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center' },
    { title: '状态', dataIndex: 'operateCode', key: 'operateCode' },
    { title: '完成日期', dataIndex: 'createTime', key: 'createTime' },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
]

const save = async () => {
    try {
        await dynamicFormRef.value?.validate();
        const params = dynamicFormRef.value?.getAllData()
        isSubmitting.value = true;
        await handleSave(params);
    } catch (validationError) {
        console.log('表单校验失败:', validationError);
    } finally {
        isSubmitting.value = false;
    }
};

const handleSubmitForm = async () => {
    try {
        await dynamicFormRef.value?.validate();
        const params = dynamicFormRef.value?.getAllData()
        isSubmitting.value = true;
        await handleSubmit(params);
    } catch (validationError) {
        console.log('表单校验失败:', validationError);
    } finally {
        isSubmitting.value = false;
    }
};

const goBack = () => {
    router.go(-1); // 或 router.push({ name: 'MyDemandsList' })
};

// --- 面包屑和标题 ---
const demandTypeDisplayNameMap = {
    domestic: "国产替代寻源",
    originalSourcing: "原厂件寻源",
    // ...
};
const demandTypeDisplayName = computed(() => demandTypeDisplayNameMap[props.demandType] || "需求");

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
@import './styles/detail.less';
</style>