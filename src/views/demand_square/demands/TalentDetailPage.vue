<template>
  <ContentWithSidebarLayout>
    <template #main>
      <detail :pageData="pageData" @goBack="goBack">
        <template #content="{ dataSource = {} }">
					<div class="section-title-wrapper">
						<h3 class="section-title-text">获得省市国家级荣誉</h3>
					</div>
					<div>
							<a-table 
									:columns="columns"
									:data-source="dataSource.xx || []" :pagination="false"
									:row-key="'id'" bordered size="middle" class="custom-detail-table" />
					</div>
        </template>
      </detail>
    </template>
    <template #sidebar>
      <RecommendedSidebar :current-report-id="IdProp" :category="reportData?.category" :count="3" />
    </template>
  </ContentWithSidebarLayout>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import detail from '@/components/template/detail.vue';
import ContentWithSidebarLayout from '@/components/layout/ContentWithSidebarLayout.vue'; // Adjust path if needed
import RecommendedSidebar from './components/RecommendedSidebar.vue';

const route = useRoute();
const router = useRouter();

const props = defineProps({
  IdProp: { type: String, default: null },
});
const reportData = ref({});

const formConfigs = [
  { label: '人才编号', field: 'id', span: 24 },
  { label: '性别', field: 'gender', span: 24 },
  { label: '研究领域', field: 'skillAreaName', span: 24 },
  { label: '主要研究方向', field: 'skillDesc', span: 24, },
]
const columns = [
	{
		title: '序号',
		dataIndex: 'eq',
		key: 'eq',
	},
  {
    title: '荣誉',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '取得荣誉年份',
    dataIndex: 'time',
    key: 'time',
  },
]
const pageData = reactive({
  IdProp: props.IdProp,
  mode: props.mode,
  apiMap: {
    add: 'apm/apmTalent/add',
    edit: 'apm/apmTalent/edit',
    detail: 'apm/apmTalent/queryById/front',
    submit: 'apm/apmTalent/submit',
    delete: 'apm/apmTalent/delete',
  },
  formConfigs,
  pageTitle: '行业人才',
})

const goBack = () => {
  router.go(-1); 
};
</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.industry-report-detail-page {
  background-color: @background-color-light-gray; // 整个页面的背景色
  padding-bottom: @spacing-xxl;
}
.section-title-wrapper {
	margin-bottom: @spacing-md;
	padding-bottom: @spacing-xs;
	border-bottom: 1px solid @border-color-light;
	position: relative;

	.section-title-text {
		font-size: 14px;
		font-weight: 400;
		color: @text-color-secondary;
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
</style>