<template>
  <div class="page-section-title-bar container">
    <span class="decorator"></span>
    <h2 class="title-text">专家人才</h2>
  </div>
  <ContentWithSidebarLayout>
    <template #main>
      <detail :pageData="pageData" @goBack="goBack" @submit="submit" ref="detailRef">
        <template #title="{ dataSource = {} }">
          <div class="avatar-wrapper">
            <div class="avatar-image-wrapper">
              <img src="@/assets/images/auth/avatar.png" alt="" class="avatar-image" v-if="!dataSource.gender">
              <img :src="dataSource.gender === '男' ? ManImg : WomanImg" alt="" class="avatar-image" v-else>
            </div>
            <div class="avatar-info-wrapper">
              <div><span class="info-label">姓名：</span><span class="info-value">{{ dataSource.realname }}</span></div>
              <div>
                <span class="mr-r"><span class="info-label">电话：</span><span class="info-value">{{ dataSource.phone }}</span></span>
                <span class="info-label">邮箱：</span><span class="info-value">{{ dataSource.email }}</span>
              </div>
            </div>
          </div>
        </template>
        <template #content="{ dataSource = {}}">
					<div class="section-title-wrapper">
						<h3 class="section-title-text">获得省市国家级荣誉</h3>
					</div>
					<div>
            <!-- CONVERTED TO VXE-GRID -->
						<vxe-grid 
								:columns="columns"
								:data="dataSource.achievementList || []"
								:row-config="{ keyField: 'id' }"
								border
						    min-height="88"
								size="medium"
								class="custom-detail-table" >
              <!-- The #bodyCell template is no longer needed -->
            </vxe-grid>
					</div>
        </template>
        <template #actions='{handleDefaultCancel, handleDefaultSubmit}'>
            <div class="page-actions-footer">
						  <a-button @click="handleDefaultCancel" class="action-button cancel-button">返回</a-button>
              <a-button type="primary" danger @click="handleDefaultSubmit" class="action-button submit-button">联系平台获取专家信息</a-button>
            </div>
            <p class="action-submit-note">一键敲门后，客服人员将在<span class="text">30分钟内</span>与您联系</p>
        </template>
      </detail>
    </template>
    <template #sidebar>
      <TalentSidebar @reportClick="handleReportClick" />
    </template>
  </ContentWithSidebarLayout>
  <PhoneAndEmailModal ref="phoneAndEmailModal" @finish="handleFinish" title="联系平台获取专家信息" actionText="一键敲门"></PhoneAndEmailModal>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import detail from '@/components/template/detail.vue';
import { message } from 'ant-design-vue';
import ContentWithSidebarLayout from '@/components/layout/ContentWithSidebarLayout.vue';
import TalentSidebar from './components/TalentSidebar.vue';
import PhoneAndEmailModal from '@/components/common/PhoneAndEmailModal.vue';
import ManImg from '@/assets/images/auth/m.png';
import WomanImg from '@/assets/images/auth/w.png';
import defHttp from '@/utils/http/axios'

const route = useRoute();
const router = useRouter();
const detailRef = ref();
const props = defineProps({
  IdProp: { type: String, default: null },
});
const reportData = ref({});
const phoneAndEmailModal = ref()

const formConfigs = [
  { label: '人才编号', field: 'code', span: 24 },
  { label: '现工作单位', field: 'company', span: 24, },
  { label: '现任职务', field: 'job', span: 24, },
  { label: '研究领域', field: 'skillAreaName', span: 24 },
  { label: '意愿合作方向', field: 'desiredCooperationDirection', span: 24, },
  { label: '主要研究方向', field: 'skillDesc', span: 24, },
  { label: '论文数量', field: 'paperAchievement', span: 24, },
  { label: '专利数量', field: 'patentCount', span: 24, },
  { label: '专家人才来源', field: 'sourcing', span: 24, },
]

// --- Columns are now defined in vxe-table format ---
const columns = [
	{
		type: 'seq', // Using vxe-table's built-in sequence type
		title: '序号',
		key: 'seq', // Using a unique key is good practice
    width: 60,
	},
  {
    title: '授予单位',
    field: 'awardingUnit', // field -> field
    key: 'awardingUnit',
  },
  {
    title: '荣誉',
    field: 'achievement', // field -> field
    key: 'achievement',
  },
  {
    title: '取得荣誉年份',
    field: 'year', // field -> field
    key: 'year',
  },
]

// --- All other logic remains the same ---
const pageData = reactive({
  IdProp: props.IdProp,
  mode: props.mode,
  apiMap: {
    detail: 'apm/apmTalent/queryById/front',
  },
  formConfigs,
  pageTitle: '专家人才',
  showLogList: false,
  canSubmit: true,
  submitTpe: 'emit',
  showPageTitle: false,
  actionNote: '联系平台获取专家信息',
  listPath: '/demands/Talent',
})

const submit = async () => {
  phoneAndEmailModal.value.opneModal()
};
const handleFinish = async (data) => {
  const response = await defHttp.post({ url: `/apm/apmTalent/newTodo/${props.IdProp}`, params: data });
  if (response && response.success) {
	  window.scrollTo({ top: 0, behavior: 'smooth' });
    detailRef.value.isCreating = false
    phoneAndEmailModal.value.handleClose()
  } else {
    message.info(response.message);
  }
};

const handleReportClick = () => {
    detailRef.value.isCreating = true
}

const goBack = () => {
  router.push({ path: '/demands/Talent' });
};
</script>

<style scoped lang="less">
// No style changes needed here as they are handled by the parent/generic component
@import '@/assets/styles/_variables.less';

.industry-report-detail-page {
  background-color: @background-color-light-gray;
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
  display: flex;
  height: 64px;
  .avatar-image-wrapper{
    margin-right: @spacing-xl;
  }
  .avatar-image{
    width: 64px;
    border-width: 1px;
  }
  .avatar-info-wrapper{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .info-label{
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 14px;
      line-height: 14px;
      letter-spacing: 0%;
      text-align: right;
      color: #656C74;
      margin-right: @spacing-md;
    }
    .info-value{
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      letter-spacing: 0%;
      color: #272A30;
    }
  }
}
.mr-r{
  margin-right:120px;
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
.page-actions-footer {
	display: flex;
	justify-content: flex-end;
	margin-top: @spacing-xl;
	padding-top: @spacing-lg;
	// border-top: 1px solid @border-color-light;
}
</style>