<template>
    <div class="edit-page">
		<a-spin :spinning="isLoading">
            <div v-if="isCreating">
                <!-- 1. Page Title -->
                <h1 class="page-main-title">{{ pageTitle }}</h1>

                <!-- 2. Form Section -->
                <div class="form-section-container">
                    <div class="form-section-title-wrapper">
                        <h2 class="form-section-title">基本信息</h2>
                    </div>
                    <DynamicForm ref="dynamicFormRef" :form-config="currentFormConfig" :initial-model="formModel"
                        :default-span="12" />
                </div>
                <!-- 3. Action Buttons -->
                <div class="page-actions-footer">
                    <a-button @click="goBack" class="action-button cancel-button">取消</a-button>
                    <a-button type="primary" danger @click="handleSubmitForm" :loading="isSubmitting"
                        class="action-button submit-button">
                        一键敲门
                    </a-button>
                </div>
                <p class="action-submit-note">一键敲门后，客服人员将在<span class="text">30分钟内</span>与您联系</p>
            </div>
            <div v-else>
                <operationResultPage :pageData="resultPageData" @primaryAction="handleToDetail"
                    @secondaryAction="handleToList" />
            </div>
		</a-spin>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { Button as AButton, Spin as ASpin, Alert as AAlert, Empty as AEmpty, Table as ATable, message } from 'ant-design-vue';
import DynamicForm from '@/components/layout/DynamicForm.vue';
import operationResultPage from './operationResultPage.vue';
import { useDemandDetail } from './hooks/useDemandDetail.js';
import { useRouter, useRoute } from 'vue-router'; // 用于新建成功后跳转

const router = useRouter();

const props = defineProps({
    pageData: {
        type: Object,
        default: {},
    },
});
const {
    IdProp,
    mode,
    pageTitle,
    apiMap,
    statusHistoryColumns,
    otherParams,
    formConfigs,
    handleBeforeSubmit,
    handleBeforeSave,
    detailPath,
    listPath,
} = props.pageData;
const emit = defineEmits(['goBack']);
const {
    demandDetail: demandDetailData,
    isLoading,
    error,
    operationMode, // 现在从 hook 中获取
    canEditThisDemand,
    fetchDemandDetail,
    handleSave,
    handleSubmit,
} = useDemandDetail({
    IdProp,
    mode,
    url: apiMap,
    otherParams
});
const dynamicFormRef = ref(null);
const isSubmitting = ref(false); // 用于提交按钮的 loading 状态
const formModel = ref({});

const isCreating = ref(true);
const resultPageData = ref({

});

// 监听从 hook 获取的原始数据，用于初始化/更新表单模型
watch(demandDetailData, (newDetail) => {
    if (newDetail) {
        formModel.value = JSON.parse(JSON.stringify(newDetail)); // 深拷贝以编辑
    } else if (operationMode.value === 'create') {
        // 如果是新建模式且 newDetail 为 null（例如 hook 初始化时），确保 formModel 有基础结构
        formModel.value = {
            expireDate: null,
            // ... 其他类型需要的默认字段 ...
        };
    } else {
        formModel.value = {};
    }
}, { deep: true, immediate: true });

const currentFormConfig = computed(() => {
    const baseConfig = formConfigs || [];
    return baseConfig.map(field => ({
        ...field,
        rules: field.rules ? field.rules.map(rule => ({
            ...rule,
            required: rule.required
        })) : []
    }));
});

const save = async () => {
    try {
        await dynamicFormRef.value?.validate();
        const params = dynamicFormRef.value?.getAllData()
        isSubmitting.value = true;
        if (handleBeforeSave && typeof handleBeforeSave === 'function') {
            handleBeforeSave(params)
        }
        const result = await handleSave(params);
        if (result) {
            demandDetailData.value = result;
            isCreating.value = false;
        }
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
        if (handleBeforeSubmit && typeof handleBeforeSubmit === 'function') {
            handleBeforeSubmit(params)
        }
        isSubmitting.value = true;
        const result = await handleSubmit(params);
        if (result) {
            demandDetailData.value = result;
            isCreating.value = false;
        }
    } catch (validationError) {
        console.log('表单校验失败:', validationError);
    } finally {
        isSubmitting.value = false;
    }
};

const goBack = () => {
    emit('goBack');
};

const handleToDetail = () => {
    isCreating.value = true;
    router.push({ path: `detail/${demandDetailData.value.id}` });
}
const handleToList = () => {
    isCreating.value = true;
    router.push({ path: listPath });
}
// 当路由参数（尤其是 IdProp）实际发生变化时，重新加载数据
// 这主要用于：用户在详情页A，通过某种方式（非浏览器前进后退）直接导航到详情页B
watch(() => props.IdProp, (newId) => {
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
@import './styles/edit.less';
</style>