<template>
	<div class="detail-view-page">
		<!-- 1. Page Title -->
		<div class="page-title-header" v-if="showPageTitle">
			<!-- <span class="title-decorator-bar"></span> -->
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
						<div v-for="item in baseFormConfigs" :key="item.label" class="info-grid-item"
							:style="{ gridColumn: item.span ? `span ${item.span}` : 'span 1' }">
							<span class="info-grid-label">{{ item.label }}：</span>
							<span class="info-grid-value"
								v-if="item.fieldType === 'select' && (item.options || selectOptions(item.dictKey))">
								{{ getSelectDisplayValue(item, formModel[item.field]) }}
							</span>
							<span class="info-grid-value" v-else-if="item.fieldType === 'date'">
								{{ getDataDisplayValue(formModel[item.field]) }}
							</span>
							<span class="info-grid-value" v-else-if="item.fieldType === 'imageUpload'">
								<img :src="getImgUrl(formModel[item.field])" :alt="formModel[item.field]" alt="" class="info-grid-image">
								<!-- {{ formModel[item.field] }} -->
							</span>
							<span v-else class="info-grid-value">{{ formModel[item.field] }}</span>
						</div>
						<div v-for="(tableSection, index) in tableSections" :key="`table-section-${index}`"
							class="info-grid-item">
							<span class="info-grid-label">{{ tableSection.title }}：</span>
							<div class=" flex1">
								<a-table :columns="tableSection.columns"
									:data-source="formModel[`${tableSection.groupCode}`] || []" :pagination="false"
									:row-key="tableSection.rowKey || 'id'" bordered size="middle" class="custom-detail-table">
									<template #bodyCell="{ column, record, index }">
										<span v-if="column.dataIndex === 'index'">
											{{ index + 1 }}
										</span>
									</template>
								</a-table>
							</div>
						</div>
					</div>
				</section>
				<section class="info-section" v-if="$slots.content" >
					<slot name="content" :dataSource="formModel"></slot>
				</section>
				<section v-if="showLogList && statusTracking" class="info-section">
					<div class="section-title-wrapper">
						<h3 class="section-title-text">{{ statusTracking.title || '状态跟踪' }}</h3>
					</div>
					<CustomProgressTimeline :progressList="formModel.progressList" />
					<!-- <a-steps progress-dot :current="currentStepIndex" :items="statusTracking.steps" class="status-steps"/> -->
					<a-table v-if="formModel.logList && formModel.logList.length > 0" :columns="statusHistoryColumns"
						:data-source="formModel.logList" :pagination="false" :row-key="'id'" bordered size="middle"
						class="custom-detail-table status-history-table">

						<template #bodyCell="{ column, record, index }">
							<span v-if="column.dataIndex === 'index'">
								{{ index + 1 }}
							</span>
						</template>
					</a-table>
				</section>

				<!-- Action Buttons -->
				<div class="page-actions-footer">
					<slot name="actions">
						<a-button @click="handleDefaultCancel" class="action-button cancel-button">返回</a-button>
						<a-button v-for="(item, i) in actionNotes" :key="i" class="action-button" @click="handleActionNoteClick(item)" :type="item.type">{{ item.title }}</a-button>
						<a-button type="primary" danger @click="handleDefaultSubmit" v-if='canSubmit'
							class="action-button submit-button">{{ actionNote }}</a-button>
					</slot>
				</div>
            </div>
			<div v-else>
                <operationResultPage  @primaryAction="handleToDetail"
                    @secondaryAction="handleToList" />
            </div>
		</a-spin>
	</div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { Button as AButton, Table as ATable, Steps as ASteps, Step as AStep } from 'ant-design-vue';
import { useDemandDetail } from './hooks/useDemandDetail.js';
import { useAuthStore } from '@/store/authStore';
import { useRouter, useRoute } from 'vue-router'; // 用于新建成功后跳转
import {selectOptions} from '@/utils/index';
import operationResultPage from './operationResultPage.vue';
import CustomProgressTimeline from '@/components/layout/CustomProgressTimeline.vue';
import { getFileAccessHttpUrl } from '@/utils/index';
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
	IdProp,
	mode,
	pageTitle,
	apiMap,
	statusDictKey,
	statusHistoryColumns,
	otherParams,
	formConfigs,
	tableSections,
	canSubmit = false,
	showLogList = true,
	showPageTitle = true,
    listPath,
	actionNote='一键敲门',
	actionNotes = []
} = props.pageData;

const baseFormConfigs = ref(formConfigs);
const emit = defineEmits(['goBack', 'cancel', 'submit']);
const handleformConfigsAfter = (data) => {
	if (auth.userInfo.loginTenantId == data.tenantId) {
		baseFormConfigs.value = formConfigs.filter(item => {
			return item.field !== 'tenantName'
		})
	}
};
const {
	demandDetail: demandDetailData,
	isLoading,
	error,
	operationMode, // 现在从 hook 中获取
	fetchDemandDetail,
	internalDemandId,
} = useDemandDetail({
	IdProp,
	mode,
	url: apiMap,
	otherParams,
	handleformConfigsAfter
});
const formModel = ref({});
const isCreating = ref(true);

const statusTracking = computed(() => {
	const stepData = formModel.value.progressList || [];
	const steps = stepData.map(step => {
		return {
			...step,
			title: step.operateName,
			description: step.createTime,
			statusCode: step.businessId ? 'finish' : 'wait'
		}
	})
	return {
		title: '状态跟踪',
		steps
	}
})

// 监听从 hook 获取的原始数据，用于初始化/更新表单模型
watch(demandDetailData, (newDetail) => {
	formModel.value = newDetail ? JSON.parse(JSON.stringify(newDetail)) : {};
}, { deep: true, immediate: true });


const currentStepIndex = computed(() => {
	if (!statusTracking.value || !statusTracking.value.steps || statusTracking.value.steps.length === 0) return -1;
	let lastFinishIndex = -1;
	for (let i = statusTracking.value.steps.length - 1; i >= 0; i--) {
		if (statusTracking.value.steps[i].statusCode === 'finish') {
			lastFinishIndex = i ;
			break;
		}
	}
	if (lastFinishIndex === statusTracking.value.steps.length - 1) {
		return statusTracking.value.steps.length; // All finished
	}
	return lastFinishIndex >= 0 ? lastFinishIndex : 0; // Default to first step or last finished
});

const getSelectDisplayValue = (fieldConfig, value) => {
	let optionsList = fieldConfig.options || selectOptions(fieldConfig.dictKey)
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

const getDataDisplayValue = (dateTimeString) => {
	return dateTimeString ? dateTimeString.split(' ')[0] : '';
}
const formatAmount = (value) => {
	if (value === null || value === undefined || value === '') return '-';
	const num = Number(value);
	if (isNaN(num)) return value; // Return original if not a number
	return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};



const handleDefaultCancel = () => {
	emit('goBack');
};
const goBack = () => {
	emit('goBack');
};


const handleDefaultSubmit = () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
	emit('submit');
};

const handleToDetail = () => {
	isCreating.value = true;
}

const handleToList = () => {
    isCreating.value = true;
    router.push({ path: listPath });
}

const getImgUrl = (url) => {
  if (url) {
    return getFileAccessHttpUrl(url);
  } else {
    return '';
  }
}
const handleActionNoteClick = (actionNote) => {
	if (actionNote.fn) {
		actionNote.fn(demandDetailData)
	}
}

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    internalDemandId.value = newId;
    fetchDemandDetail();
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
  }
}, { immediate: false });

defineExpose({
	isCreating,
	handleToDetail
})
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less'; // Your global LESS variables

.flex1 {
	flex: 1
}

.detail-view-page {
	padding: @spacing-lg @spacing-xl;
	background-color: @background-color-base;
	border-radius: @border-radius-sm;
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
		line-height: 1.6;
	}

	.info-grid-label {
		color: @text-color-secondary;
		margin-right: @spacing-xs;
		white-space: nowrap;
		min-width: 120px; // Adjust as needed for your longest labels
		text-align: right;
	}

	.info-grid-value {
		color: @text-color-base;
		word-break: break-word;

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
		font-size: 12px;
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
	min-width: 88px;
	height: 36px;
	font-size: 14px;
	border-radius: @border-radius-sm;
	margin-right: @spacing-md;
	&:hover {
		color: @primary-color;
		border-color: @primary-color;
	}
	&.cancel-button {
		
		background-color: @background-color-base;
		border: 1px solid #D9D9D9;
		color: @text-color-base;

		
	}

	&.submit-button {
		// type="primary" danger for red
	}
}

.action-submit-note {
	text-align: right;
	margin-top: @spacing-xs;
	font-size: 12px;
	color: @text-color-tertiary;
}

.info-grid-image {
	max-width: 300px;
	max-height: 300px;
}
</style>