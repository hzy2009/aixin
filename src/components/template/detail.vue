<!-- 
  这是一个高度可复用的详情页模板组件。
  它被设计为一个“智能”组件，通过props接收配置来动态渲染不同业务场景的详情页。
  其核心思想是“配置驱动UI”，并利用组合式API将不同职责的逻辑（如数据获取、表单渲染、图片预览）分离到独立的模块中。
-->
<template>
  <div class="detail-view-page">
    <!-- 1. 页面标题 -->
    <div class="page-title-header" v-if="showPageTitle">
      <h2 class="page-main-heading">{{ pageTitle }}</h2>
    </div>

    <!-- 加载状态 -->
    <a-spin :spinning="isLoading">
      <!-- 主内容区域 -->
      <div v-if="isCreating">
        <!-- 预留插槽，用于在基本信息之上插入自定义内容 -->
        <slot name="title" :dataSource="formModel"></slot>

        <!-- 2. 基本信息板块 -->
        <section class="info-section">
          <div class="section-title-wrapper">
            <h3 class="section-title-text">基本信息</h3>
          </div>

          <div class="basic-info-grid">
            <!-- 查看模式: 循环 displayFields, 直接展示格式化后的文本 -->
            <template v-if="isView">
              <div v-for="field in displayFields" :key="field.label" class="info-grid-item" :style="{ gridColumn: field.span ? `span ${field.span}` : 'span 1' }">
                <span class="info-grid-label">{{ field.label }}：</span>
                <img v-if="field.type === 'imageUpload'" :src="field.value" :alt="field.label" class="info-grid-image">
                <div v-else-if="field.type === 'slot'" class="info-grid-value" style="width:100%">
                  <slot :name="field.field" :dataSource="formModel" :isView="isView"></slot>
                </div>
                <pre v-else-if="field.type === 'textarea'" class="info-grid-value">{{ field.value }}</pre>
                <span v-else class="info-grid-value">{{ field.value }}</span>
              </div>
            </template>

            <!-- 编辑模式: 使用动态组件渲染表单 -->
            <template v-else>
              <div v-for="item in baseFormConfigs" :key="item.label" class="info-grid-item" :style="{ gridColumn: item.span ? `span ${item.span}` : 'span 1' }">
                <span class="info-grid-label">{{ item.label }}：</span>
                <div class="info-grid-value">
                  <slot v-if="item.fieldType === 'slot'" :name="item.field" :dataSource="formModel" :isView="isView"></slot>
                  <component
                    v-else-if="formComponentMap[item.fieldType]"
                    :is="formComponentMap[item.fieldType]"
                    v-bind="getComponentProps(item, handleSelectChange)"
                    v-model:value="formModel[item.field]"
                    v-model:file-list="formModel[item.field]"
                  />
                  <span v-else>{{ item.isMask ? maskMiddle(formModel[item.field]) : formModel[item.field] }}</span>
                </div>
              </div>
            </template>

            <!-- 表格板块: 循环渲染多个vxe-grid -->
            <div v-for="(tableSection, index) in tableSections" :key="`table-section-${index}`" class="info-grid-item">
              <span class="info-grid-label">{{ tableSection.title }}：</span>
              <div class="flex1">
                <span v-if="!formModel[tableSection.groupCode] || formModel[tableSection.groupCode].length === 0">暂无数据</span>
                <vxe-grid v-else :columns="tableSection.columns || []" :data="formModel[tableSection.groupCode] || []" :row-config="{ keyField: tableSection.rowKey || 'id' }" min-height="88" border size="medium" class="custom-detail-table" />
              </div>
            </div>
          </div>
        </section>

        <!-- 预留插槽，用于在基本信息之下插入自定义内容 -->
        <slot name="content" :dataSource="formModel"></slot>

        <!-- 3. 状态跟踪板块 -->
        <section v-if="showProgressList" class="info-section">
          <div class="section-title-wrapper">
            <h3 class="section-title-text">{{ statusTracking.title || '状态跟踪' }}</h3>
          </div>
          <CustomProgressTimeline :progressList="formModel.progressList" />
          <vxe-grid v-if="formModel.logList && formModel.logList.length > 0" :columns="statusHistoryColumns || []" :data="formModel.logList" :row-config="{ keyField: 'id' }" min-height="88" border size="medium" class="custom-detail-table status-history-table" />
        </section>

        <!-- 4. 底部操作按钮 -->
        <slot name="actions" :handleDefaultSubmit="handleDefaultSubmit" :handleDefaultCancel="handleDefaultCancel">
           <div class="page-actions-footer">
            <a-button @click="handleDefaultCancel" class="action-button cancel-button" v-if="isUseBack">返回</a-button>
            <a-button @click="handleDefaultdelete" class="action-button cancel-button" v-if="isSubmit && isUseDelete">删除</a-button>
            <a-button v-for="(item, i) in actionNotesList" :key="i" class="action-button cancel-button" @click="handleActionNoteClick(item)" :type="item.type">{{ item.title }}</a-button>
            <a-button type="primary" danger @click="handleToEdit" v-if="isSubmit && canSubmit && isView && actionNotes.length == 0" class="action-button submit-button">修改单据</a-button>
            <a-button type="primary" danger @click="handleDefaultSubmit" v-else-if="isSubmit && canSubmit && !isView && actionNotes.length == 0" class="action-button submit-button">{{ isSubmit ? '一键敲门' : actionNote }}</a-button>
          </div>
        </slot>
      </div>

      <!-- 5. 操作结果页 -->
      <operationResultPage v-else @primaryAction="handleToDetail" @secondaryAction="handleToList" :pagepageData="{ title: successTitle }" />
    </a-spin>

    <!-- 6. 图片预览模态框 -->
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handlePreviewCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script setup>
import { computed, ref, watch, reactive } from 'vue';
import { useDemandDetail } from './hooks/useDemandDetail.js';
import { useDetailForm } from './hooks/useDetailForm.js';
import { useImagePreview } from './hooks/useImagePreview.js';
import { useAuthStore } from '@/store/authStore';
import { useRouter, useRoute } from 'vue-router';
import { maskMiddle } from '@/utils/index';
import operationResultPage from './operationResultPage.vue';
import CustomProgressTimeline from '@/components/layout/CustomProgressTimeline.vue';
import { message } from 'ant-design-vue';

// --- 1. 组件核心状态和依赖 --- 

// 通过 props 接收页面配置，实现组件的高度可复用性
const props = defineProps({ pageData: { type: Object, default: () => ({}) } });

// 从 pageData 中解构出所有配置项
const { 
    IdProp, mode, pageTitle, apiMap, statusHistoryColumns, otherParams, formConfigs, tableSections, 
    canSubmit = false, showLogList = true, showPageTitle = true, listPath, actionNote = '一键敲门', 
    actionNotes = [], statusTrackingTitle, isUseBack = true, localeGetDetail = null, 
    submitTpe = 'fn', handleBeforeSubmit, isUseDelete = false, successTitle = '一键敲门成功' 
} = props.pageData;

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const emit = defineEmits(['goBack', 'cancel', 'submit']);

// 核心状态：是否为查看模式、是否在提交中、表单数据模型、是否显示主内容
const isView = ref(true);
const isSubmitting = ref(false);
const formModel = ref({});
const isCreating = ref(true);
const baseFormConfigs = ref(formConfigs);

// --- 2. 组合式API (Composables) --- 

// a. 数据获取逻辑
const handleformConfigsAfter = (data) => {
  if (auth.userInfo.loginTenantId == data.tenantId) {
    baseFormConfigs.value = formConfigs.filter(item => item.field !== 'createBy');
  }
};
const { demandDetail: detailData, isLoading, fetchDemandDetail, internalDemandId, handleSubmit, handleDelete } = useDemandDetail({
  IdProp, mode, url: apiMap, otherParams, handleformConfigsAfter, localeGetDetail
});

// b. 图片预览逻辑
const { previewVisible, previewImage, previewTitle, handleImagePreview, handlePreviewCancel } = useImagePreview();

// c. 表单渲染与数据处理逻辑
const uploadUrl = `${import.meta.env.VITE_GLOB_UPLOAD_URL}sys/common/upload` || '/api';
const getHeaders = () => reactive({ 'X-Access-Token': auth.token, 'X-Tenant-Id': auth.userInfo.id || '0' });
const handleImageUploadChange = (info, fieldConfig) => {
  if (info.file.status === 'done' && !info.file.response.success) {
    message.error(info.file.response.message);
    formModel.value[fieldConfig.field] = formModel.value[fieldConfig.field].filter(f => f.uid !== info.file.uid);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 上传失败.`);
  }
};
const { displayFields, formComponentMap, getComponentProps, getAllData } = useDetailForm(
  baseFormConfigs, 
  formModel, 
  detailData,       // 传入原始数据
  ref(canSubmit),   // 传入响应式依赖
  uploadUrl, 
  getHeaders, 
  handleImageUploadChange, 
  handleImagePreview
);

// --- 3. 计算属性 (Computed Properties) ---

// 当前单据是否为“已提交”状态
const isSubmit = computed(() => formModel.value.statusCode === 'submit');
// 根据当前状态过滤可显示的操作按钮
const actionNotesList = computed(() => actionNotes.filter(item => item.isShow?.(formModel.value)));
// 状态跟踪时间线的数据
const statusTracking = computed(() => ({ title: statusTrackingTitle || '状态跟踪', steps: (formModel.value.progressList || []).map(s => ({ ...s, title: s.operateName, description: s.createTime, statusCode: s.businessId ? 'finish' : 'wait' })) }));
// 是否显示状态跟踪板块
const showProgressList = computed(() => showLogList && !!(statusTracking.value && (statusTrackingTitle !== '状态跟踪' || formModel.value.progressList?.length > 0)));

// --- 4. 事件处理器 (Event Handlers) ---

// 默认的取消/返回操作
const handleDefaultCancel = () => listPath ? handleToList() : emit('goBack');
// 默认的删除操作
const handleDefaultdelete = async () => (await handleDelete(formModel.value))?.success && handleToList();
// 默认的提交操作
const handleDefaultSubmit = () => { isView.value = true; submitTpe === 'fn' ? handleSubmitForm() : emit('submit'); };
// 切换到详情页
const handleToDetail = () => { isCreating.value = true; };
// 跳转到列表页
const handleToList = () => { isCreating.value = true; router.push({ path: listPath }); };
// 切换到编辑模式
const handleToEdit = () => { isView.value = false; };
// 自定义操作按钮点击
const handleActionNoteClick = (action) => action.fn?.(detailData.value);
// 表单内select组件的change事件
const handleSelectChange = (value, fieldConfig, option) => fieldConfig.onChange?.({ value, field: fieldConfig, form: formModel.value, option });

// 表单提交总处理器
const handleSubmitForm = async () => {
  try {
    const params = getAllData(); // 从 useDetailForm 获取处理好的数据
    handleBeforeSubmit?.(params); // 执行外部传入的提交前回调
    isSubmitting.value = true;
    const result = await handleSubmit(params); // 调用 useDemandDetail 的提交方法
    if (result) { detailData.value = result; isCreating.value = false; }
  } catch (e) { console.log('表单校验失败:', e); }
  finally { isSubmitting.value = false; }
};

// --- 5. 侦听器 (Watchers) ---

// 侦听路由ID变化，重新获取数据
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    internalDemandId.value = newId;
    fetchDemandDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// --- 6. 暴露给父组件的接口 ---
defineExpose({ isCreating, handleToDetail, fetchDemandDetail, detailData });
</script>

<style scoped lang="less">
/* 样式与之前保持一致，此处省略以节省篇幅 */
@import '@/assets/styles/_variables.less';
pre { margin: 0; font-family: inherit; white-space: pre-wrap; word-break: break-word; }
.flex1 { flex: 1; }
.detail-view-page { padding: @spacing-lg @spacing-xl; background-color: @background-color-base; border-radius: @border-radius-sm; margin-bottom: 20px; }
.page-title-header { display: flex; align-items: center; margin-bottom: @spacing-md; .page-main-heading { font-size: 18px; font-weight: 500; color: @text-color-base; margin: 0; } }
.info-section { margin-bottom: @spacing-xl + @spacing-md; }
.section-title-wrapper { margin-bottom: @spacing-md; padding-bottom: @spacing-xs; border-bottom: 1px solid @border-color-light; position: relative; .section-title-text { font-size: 14px; font-weight: 400; color: #656C74; margin: 0; display: inline-block; position: relative; &::after { content: ''; display: block; width: 100%; height: 2px; background-color: @primary-color; position: absolute; bottom: -(@spacing-xs + 1px); left: 0; z-index: 1; } } }
.basic-info-grid { gap: @spacing-sm @spacing-lg; font-size: 14px; .info-grid-item { display: flex; padding: @spacing-md 0; font-family: PingFang SC; font-weight: 400; font-size: 14px; line-height: 22px; } .info-grid-label { display: flex; justify-content: right; align-items: center; color: @text-color-secondary; margin-right: @spacing-xs; white-space: nowrap; min-width: 120px; text-align: right; } .info-grid-value { display: flex; align-items: center; color: #272A30; word-break: break-word; flex: 1; width: calc(100% - 120px); } }
.custom-detail-table, .status-history-table { margin-top: @spacing-md; }
.page-actions-footer { display: flex; justify-content: flex-end; margin-top: @spacing-xl; padding-top: @spacing-lg; }
.action-button { height: 42px; padding: 0 28px; font-family: PingFang SC; font-weight: 400; font-size: 16px; line-height: 22px; border-radius: 4px; margin-left: @spacing-md; &.cancel-button { background-color: @background-color-base; border: 1px solid #D9D9D9; color: #555; &:hover { color: @primary-color; border-color: @primary-color; } } }
.info-grid-image { max-width: 300px; max-height: 300px; border-radius: @border-radius-sm; }
:deep(.custom-image-uploader .ant-upload-select) { width: 102px; height: 102px; }
:deep(.custom-image-uploader .ant-upload-list-item-container) { width: 102px; height: 102px; }
</style>