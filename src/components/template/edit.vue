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
                    <div>
                        <slot name="moreForm"></slot>
                    </div>
                </div>
                <!-- 3. Action Buttons -->
                 <div v-if='useFooterAction'>
                    <div class="page-actions-footer">
                        <a-button @click="goBack" class="action-button cancel-button">取消</a-button>
                        <a-button type="primary" danger @click="handleSubmitForm" :loading="isSubmitting"
                            class="action-button submit-button">
                            一键敲门
                        </a-button>
                    </div>
                    <p class="action-submit-note">一键敲门后，客服人员将在<span class="text">30分钟内</span>与您联系</p>
                 </div>
            </div>
            <div v-else>
                <operationResultPage :pageData="resultPageData" @primaryAction="handleToDetail"
                    @secondaryAction="handleToList" />
            </div>
		</a-spin>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Button as AButton, Spin as ASpin, message } from 'ant-design-vue';
import DynamicForm from '@/components/layout/DynamicForm.vue';
import operationResultPage from './operationResultPage.vue';
import { useDemandDetail } from './hooks/useDemandDetail.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
    pageData: {
        type: Object,
        default: () => ({}), // 推荐为 props 的 object/array 类型提供工厂函数默认值
    },
});

const {
    IdProp,
    mode,
    pageTitle,
    apiMap,
    statusHistoryColumns, // 此变量在模板中未使用，可考虑移除
    otherParams,
    formConfigs,
    handleBeforeSubmit,
    handleBeforeSave,
    detailPath,
    listPath,
    useFooterAction = true,
} = props.pageData;

const emit = defineEmits(['goBack']);

const {
    demandDetail: demandDetailData,
    isLoading,
    error, // 此变量在模板中未使用，可考虑添加错误状态展示
    operationMode,
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
const isSubmitting = ref(false);
const formModel = ref({});
const isCreating = ref(true);
const resultPageData = ref({});

// 监听从 hook 获取的原始数据，用于初始化/更新表单模型
watch(demandDetailData, (newDetail) => {
    if (newDetail) {
        // 使用深拷贝，防止表单修改意外影响原始数据
        formModel.value = JSON.parse(JSON.stringify(newDetail));
    } else {
        // 为创建模式或无数据时提供一个空对象
        formModel.value = {};
    }
}, { deep: true, immediate: true });

// 直接使用从 props 传入的 formConfigs，如果不存在则给一个空数组。
// 校验规则的生成和处理已封装在 DynamicForm 组件内部，此处无需再次处理。
const currentFormConfig = computed(() => formConfigs || []);

/**
 * 处理表单动作（保存、提交等）的通用函数
 * @param {Function} actionApi - 实际要调用的 API 函数 (如 handleSave, handleSubmit)
 * @param {Function} beforeActionHook - 调用 API 前的预处理钩子
 */
const handleFormAction = async (actionApi, beforeActionHook) => {
    if (!dynamicFormRef.value) return;

    try {
        // 1. 校验表单
        await dynamicFormRef.value.validate();

        // 2. 获取表单数据
        let params = dynamicFormRef.value.getAllData();
        
        // 3. 执行前置钩子（如果存在）
        if (beforeActionHook && typeof beforeActionHook === 'function') {
            const modifiedParams = beforeActionHook(params);
            // 如果钩子返回了新参数，则使用新参数
            if (modifiedParams) {
                params = modifiedParams;
            }
        }
        
        isSubmitting.value = true;
        
        // 4. 调用实际的 API
        const result = await actionApi(params);

        // 5. 处理结果
        if (result) {
            demandDetailData.value = result;
            isCreating.value = false; // 切换到结果页
            // resultPageData.value = {
            //     status: 'success',
            //     title: '提交成功',
            //     subTitle: '我们已收到您的请求，客服将尽快与您联系。'
            // };
        }
    } catch (validationError) {
        // 捕获校验失败或其他错误
        console.error('表单操作失败:', validationError);
        // 只在校验失败时提示用户，避免将API错误直接暴露
        // if (validationError && validationError.errorFields) {
        //    message.error('请检查表单，有未填写或格式不正确的项目！');
        // }
    } finally {
        isSubmitting.value = false;
    }
};

// **: 使用通用函数简化 save 和 handleSubmitForm**
const save = () => {
    handleFormAction(handleSave, handleBeforeSave);
};

const handleSubmitForm = () => {
    handleFormAction(handleSubmit, handleBeforeSubmit);
};


const goBack = () => {
    emit('goBack');
};

const handleToDetail = () => {
    isCreating.value = true;
    router.push({ path: `${detailPath}/${formModel.value.id}` }); // 假设 detailPath 是基础路径
}

const handleToList = () => {
    isCreating.value = true;
    router.push({ path: listPath });
}

// 监听 ID 变化以重新加载数据
watch(() => props.IdProp, (newId) => {
    if (newId && operationMode.value !== 'create') {
        fetchDemandDetail();
    }
});

// 暴露给父组件的方法
const getAllData = async() => {
    return dynamicFormRef.value?.getAllData();
}
const validate = async() => {
  return await dynamicFormRef.value?.validate();
}

defineExpose({
    getAllData,
    validate,
    formRef: dynamicFormRef,
    // 如果父组件需要手动触发保存，也可以暴露
    // save,
    // handleSubmitForm,
});

</script>

<style scoped lang="less">
@import './styles/edit.less';
</style>