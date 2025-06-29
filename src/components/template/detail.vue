<template>
	<div class="detail-view-page">
		<!-- 1. Page Title -->
		<div class="page-title-header" v-if="showPageTitle">
			<h2 class="page-main-heading">{{ pageTitle }}</h2>
		</div>
		<a-spin :spinning="isLoading">
            <div v-if="isCreating">
			<!-- Section: Basic Information -->
				<section  v-if="$slots.title" >
					<slot name="title" :dataSource="formModel"></slot>
				</section>
				<section class="info-section">
					<div class="section-title-wrapper">
						<h3 class="section-title-text">基本信息</h3>
					</div>
					<div class="basic-info-grid">
						<!-- Basic info fields remain unchanged -->
						<div v-for="item in baseFormConfigs" :key="item.label" class="info-grid-item"
							:style="{ gridColumn: item.span ? `span ${item.span}` : 'span 1' }">
							<span class="info-grid-label">{{ item.label }}：</span>
							<span class="info-grid-value" v-if="item.fieldType === 'input'">
								<a-input v-if="formModel.statusCode == 'submit' && canSubmit" style="width: 386px;" v-model:value="formModel[item.field]"
              					:placeholder="item.placeholder || `请输入${item.label}`" :disabled="item.disabled" allow-clear />
								<span v-else>{{ formModel[item.field] }}</span>
							</span>
							<span class="info-grid-value" v-else-if="item.fieldType === 'select' && (item.options || selectOptions(item.dictKey))">
								<a-select v-if="formModel.statusCode == 'submit' && canSubmit" v-model:value="formModel[item.field]"
									style="width: 386px;"
									:placeholder="item.placeholder || `请选择${item.label}`"
									:options="item.options || selectOptions(item.dictKey)" :mode="item.selectMode"
									:filter-option="item.remoteSearch ? false : filterOption" :loading="item.loading"
									:disabled="item.disabled" @change="(v, option) => handleSelectChange(v, item, option)" allow-clear />
								<span v-else>
									{{ getSelectDisplayValue(item, formModel[item.field]) }}
								</span>
							</span>
							<span class="info-grid-value" v-else-if="item.fieldType === 'date'">
								<a-date-picker v-if="formModel.statusCode == 'submit' && canSubmit" v-model:value="formModel[item.field]"
									:placeholder="item.placeholder || `请选择${item.label}`"
									:disabled-date="disabledDate"
									:value-format="item.valueFormat || 'YYYY-MM-DD HH:mm:ss'" :show-time="item.showTime"
									style="width: 386px" :disabled="item.disabled" />
								<span v-else>{{ getDataDisplayValue(formModel[item.field]) }}</span>
							</span>
							<span class="info-grid-value" v-else-if="item.fieldType === 'textarea'">
								<a-textarea v-if="formModel.statusCode == 'submit' && canSubmit" v-model:value="formModel[item.field]"
								style="width: 386px"
								:placeholder="item.placeholder || `请输入${item.label}`" :rows="item.rows || 4" :disabled="item.disabled"
								allow-clear :maxlength="item.maxLength" show-count />
								<span v-else>{{ formModel[item.field] }}</span>
							</span>
							<span class="info-grid-value" v-else-if="item.fieldType === 'imageUpload'">
								<a-upload v-if="formModel.statusCode == 'submit' && canSubmit" v-model:file-list="formModel[item.field]" :name="item.uploadName || 'file'"
									list-type="picture-card" class="custom-image-uploader"
									:show-upload-list="item.showUploadList !== undefined ? item.showUploadList : true" :action="uploadUrl"
									:before-upload="item.beforeUpload || beforeUpload" accept="image/*" :headers="getHeaders()"
									:data="{ biz: 'temp' }" @change="(info) => handleImageUploadChange(info, item)"
									@preview="handleImagePreview" :max-count="item.maxCount || 1" :disabled="item.disabled">
									<div
										v-if="(!formModel[item.field] || formModel[item.field].length < (item.maxCount || 1))">
										<PlusOutlined />
										<div style="margin-top: 8px">上传</div>
									</div>
								</a-upload>
								<img v-else :src="getImgUrl(formModel[item.field])" :alt="formModel[item.field]" alt="" class="info-grid-image">
							</span>
							<div class="info-grid-value" v-else-if="item.fieldType === 'slot'" width="100%">
								<slot :name="item.field" :dataSource="formModel"></slot>
							</div>
							<span v-else class="info-grid-value">{{ formModel[item.field] }}</span>
						</div>
						<!-- Table Sections - CONVERTED TO VXE-GRID -->
						<div v-for="(tableSection, index) in tableSections" :key="`table-section-${index}`"
							class="info-grid-item">
							<span class="info-grid-label">{{ tableSection.title }}：</span>
							<div class="flex1">
								<span v-if='!formModel[`${tableSection.groupCode}`] || formModel[`${tableSection.groupCode}`].length === 0'>暂无数据</span>
								<vxe-grid v-else
									:columns="tableSection.columns|| []"
									:data="formModel[`${tableSection.groupCode}`] || []"
									:row-config="{ keyField: tableSection.rowKey || 'id' }"
									border
									size="medium"
									class="custom-detail-table">
								</vxe-grid>
							</div>
						</div>
					</div>
				</section>
				<section class="info-section" v-if="$slots.content" >
					<slot name="content" :dataSource="formModel"></slot>
				</section>
				<section v-if="showProgressList" class="info-section">
					<div class="section-title-wrapper">
						<h3 class="section-title-text">{{ statusTracking.title || '状态跟踪' }}</h3>
					</div>
					<CustomProgressTimeline :progressList="formModel.progressList" />
					<!-- Status History Table - CONVERTED TO VXE-GRID -->
					<vxe-grid
						v-if="formModel.logList && formModel.logList.length > 0"
						:columns="statusHistoryColumns || []"
						:data="formModel.logList"
						:row-config="{ keyField: 'id' }"
						border
						size="medium"
						class="custom-detail-table status-history-table">
					</vxe-grid>
				</section>

				<!-- Action Buttons (remain unchanged) -->
				<slot name="actions" :handleDefaultSubmit=handleDefaultSubmit :handleDefaultCancel=handleDefaultCancel>
					<div class="page-actions-footer">
						<a-button @click="handleDefaultCancel" class="action-button cancel-button" v-if="isUseBack">返回</a-button>
						<a-button @click="handleDefaultdelete" class="action-button cancel-button" v-if="formModel.statusCode === 'submit' && isUseDelete ">删除</a-button>
						<a-button v-for="(item, i) in actionNotes" :key="i" class="action-button cancel-button" @click="handleActionNoteClick(item)" :type="item.type">{{ item.title }}</a-button>
						<a-button type="primary" danger @click="handleDefaultSubmit" v-if='formModel.statusCode === "submit" && canSubmit'
							class="action-button submit-button">{{ actionNote }}</a-button>
					</div>
				</slot>
            </div>
			<div v-else>
                <operationResultPage  @primaryAction="handleToDetail"
                    @secondaryAction="handleToList" />
            </div>
		</a-spin>
	</div>
	  <!-- Image Preview Modal -->
  <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handlePreviewCancel">
    <img alt="example" style="width: 100%" :src="previewImage" />
  </a-modal>
</template>

<script setup>
import { computed, ref, watch, reactive } from 'vue';
// Ant design components are still used elsewhere, so keep imports
import { Button as AButton, Steps as ASteps, Step as AStep } from 'ant-design-vue';
// All other script logic remains the same
import { useDemandDetail } from './hooks/useDemandDetail.js';
import { useAuthStore } from '@/store/authStore';
import { useRouter, useRoute } from 'vue-router';
import { selectOptions } from '@/utils/index';
import operationResultPage from './operationResultPage.vue';
import CustomProgressTimeline from '@/components/layout/CustomProgressTimeline.vue';
import { getFileAccessHttpUrl, formatDate, getRandom } from '@/utils/index';
import { PlusOutlined } from '@ant-design/icons-vue';
import defaultImg from '@/assets/images/default.png';
import dayjs from 'dayjs';

// --- ALL OTHER SCRIPT LOGIC IS UNCHANGED ---
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const props = defineProps({
	pageData: {
		type: Object,
		default: {},
	},
});

const {
	IdProp, mode, pageTitle, apiMap, statusDictKey, statusHistoryColumns,
	otherParams, formConfigs, tableSections, canSubmit = false,
	showLogList = true, showPageTitle = true, listPath, actionNote='一键敲门',
	actionNotes = [], statusTrackingTitle, isUseBack = true, localeGetDetail = null,submitTpe = 'fn', handleBeforeSubmit, isUseDelete= false
} = props.pageData;

const uploadUrl = `${import.meta.env.VITE_GLOB_UPLOAD_URL}sys/common/upload` || '/api';
const getHeaders = () => {
  return reactive({
    'X-Access-Token': auth.token,
    'X-Tenant-Id': auth.userInfo.id || '0',
  });
}
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const isSubmitting = ref(false); // 用于提交按钮的 loading 状态

const baseFormConfigs = ref(formConfigs);
const emit = defineEmits(['goBack', 'cancel', 'submit']);
const handleformConfigsAfter = (data) => {
	if (auth.userInfo.loginTenantId == data.tenantId) {
		baseFormConfigs.value = formConfigs.filter(item => {
			return item.field !== 'createUserName'
		})
	}
};
const {
	demandDetail: demandDetailData, isLoading, error, operationMode,
	fetchDemandDetail, internalDemandId, handleSubmit,handleDelete
} = useDemandDetail({
	IdProp, mode, url: apiMap, otherParams, handleformConfigsAfter, localeGetDetail
});
const formModel = ref({});
const isCreating = ref(true);

const statusTracking = computed(() => {
	const stepData = formModel.value.progressList || [];
	const steps = stepData.map(step => ({ ...step, title: step.operateName, description: step.createTime, statusCode: step.businessId ? 'finish' : 'wait' }));
	return { title: statusTrackingTitle || '状态跟踪', steps };
});

watch(demandDetailData, (newDetail) => {
	const modelToAssign = newDetail ? JSON.parse(JSON.stringify(newDetail)) : {};
	if (canSubmit && newDetail && newDetail.statusCode === 'submit') {
		baseFormConfigs.value.forEach(field => {
			if (field.fieldType === 'imageUpload') {
			if (!modelToAssign[field.field]) {
				modelToAssign[field.field] = []; // Initialize as empty array for AntD Upload
			} else {
				modelToAssign[field.field] = [{
				uid: getRandom(10),
				name: "图片",
				status: 'done',
				url: getFileAccessHttpUrl(modelToAssign[field.field]),
				response: {
					status: 'history',
					message: modelToAssign[field.field],
				},
				}]
			}
			}
		});
	}
	formModel.value = modelToAssign;
}, { deep: true, immediate: true });

const currentStepIndex = computed(() => {
	if (!statusTracking.value?.steps?.length) return -1;
	let lastFinishIndex = -1;
	for (let i = statusTracking.value.steps.length - 1; i >= 0; i--) {
		if (statusTracking.value.steps[i].statusCode === 'finish') {
			lastFinishIndex = i;
			break;
		}
	}
	if (lastFinishIndex === statusTracking.value.steps.length - 1) return statusTracking.value.steps.length;
	return lastFinishIndex >= 0 ? lastFinishIndex : 0;
});

const getSelectDisplayValue = (fieldConfig, value) => {
	let optionsList = fieldConfig.options || selectOptions(fieldConfig.dictKey);
	if (!optionsList) return value || '-';
	if (fieldConfig.selectMode === 'multiple' || fieldConfig.selectMode === 'tags') {
		if (!Array.isArray(value) || value.length === 0) return '-';
		return value.map(val => {
			const option = optionsList.find(opt => opt.value === val);
			return option ? option.label : val;
		}).join(', ');
	} else {
		const option = optionsList.find(opt => opt.value === value);
		return option ? option.label : (value || '-');
	}
};

const getDataDisplayValue = (dateTimeString) => dateTimeString ? formatDate(dateTimeString) : '';
const formatAmount = (value) => {
	if (value === null || value === undefined || value === '') return '-';
	const num = Number(value);
	if (isNaN(num)) return value;
	return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const handleDefaultCancel = () => { 
	if (listPath) {
		handleToList();
	} else {
		emit('goBack');
	}
 };
const handleDefaultdelete = async() => { 
	const result = await handleDelete(formModel.value);
	console.log('result', result);
	if (result.success) {
		handleToList();
	}
 };
const goBack = () => { emit('goBack'); };
const handleDefaultSubmit = () => {
	// window.scrollTo({ top: 0, behavior: 'smooth' });
	if (submitTpe === 'fn') {
		handleSubmitForm()
	} else {
		emit('submit');
	}
};
const handleToDetail = () => { isCreating.value = true; };
const handleToList = () => {
    isCreating.value = true;
    router.push({ path: listPath });
};
const getImgUrl = (url) => url ? getFileAccessHttpUrl(url) : defaultImg;
const handleActionNoteClick = (actionNote) => { if (actionNote.fn) actionNote.fn(demandDetailData); };
const showProgressList = computed(() => {
	if (showLogList) {
		if (statusTracking.value) {
			if (statusTrackingTitle !== '状态跟踪' && (!formModel.value.progressList || formModel.value.progressList.length === 0)) {
			return false;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
	return true;
});
const handleSelectChange = (value, fieldConfig, option) => {
  // Emit a generic fieldChange event
//   emit('fieldChange', { field: fieldConfig.field, value, option, formModel: formModel.value });
  if (fieldConfig.onChange) {
    fieldConfig.onChange({ value, field: fieldConfig, form: formModel.value, option });
  }
};
const handleSubmitForm = async () => {
    try {
		const params = getAllData();
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
const handleImagePreview = async file => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
const handlePreviewCancel = () => {
  previewVisible.value = false;
};
const handleImageUploadChange = (info, fieldConfig) => {
  // internalFormModel[fieldConfig.field] is already bound with v-model:file-list
  // This handler is for additional logic like showing messages or custom status updates
  if (info.file.status === 'uploading') {
    // fieldConfig.loading = true; // If you have a loading state per field
    return;
  }
  if (info.file.status === 'done') {
    if (info.file.response.success === false) {
      message.error(info.file.response.message);
      const failIndex = internalFormModel[fieldConfig.field].findIndex((item) => item.uid === file.uid);
      if (failIndex != -1) {
        internalFormModel[fieldConfig.field].splice(failIndex, 1);
      }
    }
    // fieldConfig.loading = false;
    message.success(`${info.file.name} 上传成功`);
    // if ((fieldConfig.maxCount || 1) === 1 && info.file.response?.message) {
    //   internalFormModel[fieldConfig.field] = [info.file.response.message];
    // }
  } else if (info.file.status === 'error') {
    // fieldConfig.loading = false;
    message.error(`${info.file.name} 上传失败.`);
  }
  // emit('fieldChange', { field: fieldConfig.field, value: info.fileList, formModel: internalFormModel });
};
const beforeUpload = (file) => {
  let fileType = file.type;
  if (fileType.indexOf('image') < 0) {
    createMessage.info('请上传图片');
    return false;
  }
};

const disabledDate = (current) => {
  // 不能选择上个月的日期
  return current && current < dayjs().subtract(1, 'month');
}
const filterOption = (input, option) => {
  return option.label && option.label.toLowerCase().includes(input.toLowerCase());
};

const getAllData = () => {
  const paranms = JSON.parse(JSON.stringify(formModel.value || {}));
  baseFormConfigs.value.forEach(fielditem => {
    if (fielditem.fieldType === 'imageUpload') {
		debugger
      if (paranms[fielditem.field] && paranms[fielditem.field][0] && paranms[fielditem.field][0].response.message) {
        paranms[fielditem.field] = paranms[fielditem.field][0].response.message
      } else {
        paranms[fielditem.field] = null
      }
    }
  });
  return paranms
}

watch(() => route.params.id, (newId, oldId) => {
	if (newId && newId !== oldId) {
		internalDemandId.value = newId;
		fetchDemandDetail();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
}, { immediate: false });

defineExpose({ isCreating, handleToDetail, fetchDemandDetail });
</script>

<style scoped lang="less">
// Style section is adjusted for vxe-table
@import '@/assets/styles/_variables.less';

.flex1 {
	flex: 1
}

.detail-view-page {
	padding: @spacing-lg @spacing-xl;
	background-color: @background-color-base;
	border-radius: @border-radius-sm;
	margin-bottom: 20px;
}

.page-title-header {
	display: flex;
	align-items: center;
	margin-bottom: @spacing-md;

	.title-decorator-bar {
		width: 4px;
		height: 20px;
		background-color: @primary-color;
		margin-right: @spacing-sm;
	}

	.page-main-heading {
		font-size: 18px;
		font-weight: 500;
		color: @text-color-base;
		margin: 0;
	}
}

.info-section {
	margin-bottom: @spacing-xl + @spacing-md;
}

.section-title-wrapper {
	margin-bottom: @spacing-md;
	padding-bottom: @spacing-xs;
	border-bottom: 1px solid @border-color-light;
	position: relative;

	.section-title-text {
		font-size: 14px;
		font-weight: 400;
		color: #656C74;
		margin: 0;
		display: inline-block;
		position: relative;

		&::after {
			content: '';
			display: block;
			width: 100%;
			height: 2px;
			background-color: @primary-color;
			position: absolute;
			bottom: -(@spacing-xs + 1px);
			left: 0;
			z-index: 1;
		}
	}
}

.basic-info-grid {
	// display: grid;
	// grid-template-columns: 1fr; // Default to single column
	gap: @spacing-sm @spacing-lg;
	font-size: 14px;

	// If you want a two-column layout for basic info sometimes for larger screens:
	@media (min-width: 768px) {
		// Example breakpoint
		// By default, items take 1fr. If span=2, it takes 2fr (full width on 2-col grid)
		// This requires items to specify their span if they need to be full width.
		// For now, let's assume a dynamic grid based on item.span or a fixed 2-column layout.
		// To force a 2-column layout where items with span=1 take half:
		// grid-template-columns: repeat(2, 1fr);
	}


	.info-grid-item {
		display: flex;
		padding: @spacing-md 0;
		// line-height: 1.6;
		font-family: PingFang SC;
		font-weight: 400;
		font-size: 14px;
		line-height: 22px;
		letter-spacing: 0%;
	}

	.info-grid-label {
		// font-family: PingFang SC;
		// font-weight: 400;
		// font-size: 14px;
		// line-height: 22px;
		// letter-spacing: 0%;
		display: flex;
		justify-content: right;
    	// align-items: center;
		color: @text-color-secondary;
		margin-right: @spacing-xs;
		white-space: nowrap;
		min-width: 120px; // Adjust as needed for your longest labels
		text-align: right;
	}

	.info-grid-value {
		font-family: PingFang SC;
		font-weight: 400;
		font-size: 14px;
		line-height: 22px;
		letter-spacing: 0%;

		color: #272A30;
		word-break: break-word;
		flex: 1;
		&.requester-id-value {
			background-color: #F7F8FA;
			padding: 2px 8px;
			border-radius: @border-radius-sm;
		}
	}
}

.custom-detail-table {
	margin-top: @spacing-xs;

	:deep(.ant-table-thead > tr > th) {
		background-color: #FAFAFA;
		color: @text-color-base;
		font-weight: 500;
		font-size: 13px;
		padding: 10px 8px;
		text-align: left; // Ensure headers align left by default
	}

	:deep(.ant-table-tbody > tr > td) {
		color: @text-color-secondary;
		font-size: 13px;
		padding: 10px 8px;
		word-break: break-all;
	}

	:deep(.ant-table-bordered .ant-table-container) {
		border-color: @border-color-light !important;
	}

	:deep(.ant-table-cell) {
		border-color: @border-color-light !important;
	}
}

.status-steps {
	margin: @spacing-lg 0 @spacing-xl 0;
	padding: 0 @spacing-xs; // Reduced horizontal padding a bit

	:deep(.ant-steps-item-title) {
		font-size: 13px;
		font-weight: 400;
	}

	:deep(.ant-steps-item-description) {
		font-size: 14px;
		color: @text-color-tertiary;
	}

	:deep(.ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot),
	:deep(.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot) {
		background: @primary-color;
	}

	:deep(.ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot) {
		background: #D9D9D9;
	}

	// :deep(.ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-tail::after),
	// :deep(.ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-tail::after) {
	// 	// Also color tail for current process
	// 	background-color: @primary-color;
	// }
	:deep(.ant-steps-item-finish>.ant-steps-item-container>.ant-steps-item-tail::after) {
		background-color: @primary-color;
	}
}

.status-history-table {
	// No specific overrides needed beyond .custom-detail-table for now
}

.page-actions-footer {
	display: flex;
	justify-content: flex-end;
	margin-top: @spacing-xl;
	padding-top: @spacing-lg;
	// border-top: 1px solid @border-color-light;
}

.action-button {
	// min-width: 88px;
	height: 42px;
	padding: 0 28px;
	font-family: PingFang SC;
	font-weight: 400;
	font-size: 16px;
	line-height: 22px;
	letter-spacing: 0%;

	border-radius: 4px;
	margin-right: @spacing-md;
	&.cancel-button {
		background-color: @background-color-base;
		border: 1px solid #D9D9D9;
		color: #C3CBCF;
			&:hover {
			color: @primary-color;
			border-color: @primary-color;
		}
	}

	&.submit-button {
		// type="primary" danger for red
	}
}

.action-submit-note {
	text-align: right;
	margin-top: @spacing-xs;
	font-size: 14px;
	color: @text-color-tertiary;
}

.info-grid-image {
	max-width: 300px;
	max-height: 300px;
}
</style>