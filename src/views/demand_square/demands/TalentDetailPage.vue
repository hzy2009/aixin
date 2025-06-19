<template>
  <div class="page-section-title-bar container">
    <span class="decorator"></span>
    <h2 class="title-text">行业人才</h2>
  </div>
  <ContentWithSidebarLayout>
    <template #main>
      <detail :pageData="pageData" @goBack="goBack" @submit="submit" ref="detailRef">
        <template #title="{ dataSource = {} }">
          <div class="avatar-wrapper">
            <img src="@/assets/images/auth/avatar.png" alt="" class="avatar-image" v-if="!dataSource.gender">
            <img :src="dataSource.gender === '男' ? ManImg : WomanImg" alt="" class="avatar-image" v-else>
          </div>
        </template>
        <template #content="{ dataSource = {}}">
					<div class="section-title-wrapper">
						<h3 class="section-title-text">获得省市国家级荣誉</h3>
					</div>
					<div>
							<a-table 
									:columns="columns"
									:data-source="dataSource.achievementList || []" :pagination="false"
									:row-key="'id'" bordered size="middle" class="custom-detail-table" >
                <template #bodyCell="{ column, record, index }">
                    <span v-if="column.dataIndex === 'index'">
                        {{ index + 1 }}   
                    </span>
                </template>
            </a-table >
					</div>
        </template>
      </detail>
    </template>
    <template #sidebar>
      <TalentSidebar />
    </template>
  </ContentWithSidebarLayout>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import detail from '@/components/template/detail.vue';
import ContentWithSidebarLayout from '@/components/layout/ContentWithSidebarLayout.vue'; // Adjust path if needed
import TalentSidebar from './components/TalentSidebar.vue';
import ManImg from '@/assets/images/auth/m.png';
import WomanImg from '@/assets/images/auth/w.png';
const route = useRoute();
const router = useRouter();
const detailRef = ref();
const props = defineProps({
  IdProp: { type: String, default: null },
});
const reportData = ref({});

const formConfigs = [
  { label: '人才编号', field: 'code', span: 24 },
  { label: '性别', field: 'gender', span: 24 },
  { label: '研究领域', field: 'skillAreaName', span: 24 },
  { label: '主要研究方向', field: 'skillDesc', span: 24, },
]
const columns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
	},
  {
    title: '荣誉',
    dataIndex: 'achievement',
    key: 'achievement',
  },
  {
    title: '取得荣誉年份',
    dataIndex: 'year',
    key: 'year',
  },
]
const pageData = reactive({
  IdProp: props.IdProp,
  mode: props.mode,
  apiMap: {
    detail: 'apm/apmTalent/queryById/front',
  },
  formConfigs,
  pageTitle: '行业人才',
  showLogList: false,
  canSubmit: true,
  showPageTitle: false
})

const submit = () => {
  console.log('submit');
  setTimeout(() => {
    detailRef.value.isCreating = false
  }, 1000)
  // router.push({ path: '/demands/Talent' });
};

const goBack = () => {
  router.push({ path: '/demands/Talent' });
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
.avatar-wrapper{
  margin-bottom: 20px;
  .avatar-image{
    width: 64px;
    height: 64px;
    border-width: 1px;
  }
}

</style>