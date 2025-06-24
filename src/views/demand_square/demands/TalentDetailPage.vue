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
								size="medium"
								class="custom-detail-table" >
              <!-- The #bodyCell template is no longer needed -->
            </vxe-grid>
					</div>
        </template>
      </detail>
    </template>
    <template #sidebar>
      <TalentSidebar @reportClick="handleReportClick" />
    </template>
  </ContentWithSidebarLayout>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import detail from '@/components/template/detail.vue';
import { message } from 'ant-design-vue';
import ContentWithSidebarLayout from '@/components/layout/ContentWithSidebarLayout.vue';
import TalentSidebar from './components/TalentSidebar.vue';
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

const formConfigs = [
  { label: '人才编号', field: 'code', span: 24 },
  { label: '现工作单位', field: 'xx', span: 24, },
  { label: '现任职务', field: 'xx', span: 24, },
  { label: '研究领域', field: 'skillAreaName', span: 24 },
  { label: '意愿合作方向', field: 'xx', span: 24, },
  { label: '主要研究方向', field: 'skillDesc', span: 24, },
  { label: '论文成果', field: 'xx', span: 24, },
]

// --- Columns are now defined in vxe-table format ---
const columns = [
	{
		type: 'seq', // Using vxe-table's built-in sequence type
		title: '序号',
		key: 'seq', // Using a unique key is good practice
	},
  {
    title: '荣誉',
    field: 'achievement', // dataIndex -> field
    key: 'achievement',
  },
  {
    title: '取得荣誉年份',
    field: 'year', // dataIndex -> field
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
  pageTitle: '行业人才',
  showLogList: false,
  canSubmit: true,
  showPageTitle: false,
  actionNote: '联系平台获取专家信息',
  listPath: '/demands/Talent',
})

const submit = async () => {
  const response = await defHttp.post({ url: `/apm/apmTalent/newTodo/${props.IdProp}` });
  if (response && response.success) {
    detailRef.value.isCreating = false
  } else {
    message.error(response.message);
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
</style>