<template>
  <div>
    <detail :pageData="pageData" @goBack="goBack"></detail>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import detail from '@/components/template/detail.vue';
import { useAuthStore } from '@/store/authStore';
import { BUSINESS_REF_LIST, REGISTER_LIST, STATUS_HISTORY_COLUMNS} from '@/utils/const.jsx';
import placeholder1 from '@/assets/images/offline/点对点对接会.jpg'; // Ensure this placeholder exists
import placeholder2 from '@/assets/images/offline/供需对接会.jpg'; // Ensure this placeholder exists
import placeholder3 from '@/assets/images/offline/技术对接会.jpg'; // Ensure this placeholder exists
const defaultBannerMap = {
  'activity_type_2': placeholder1,
  'activity_type_1': placeholder2,
  'activity_type_3': placeholder3
}
const props = defineProps({
  IdProp: { type: String, default: null },
});

const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '需求提出方', field: 'createBy', span: 24 },
  { label: '爱芯享活动单号', field: 'code', span: 24 },
  { label: '活动名称', field: 'activityName', span: 24, fieldType: 'input' },
  { label: '活动类型', field: 'activityTypeCode', dictKey: 'activity_type', fieldType: 'select', span: 24 },
  { label: '活动内容', field: 'description', span: 24, fieldType: 'textarea' },
  { label: '活动结果', field: 'activityResult ', span: 24},
  { label: '活动开始日期', field: 'activityDate', span: 24, fieldType: 'date' },
  { label: '活动结束日期', field: 'activityEndDate', span: 24, fieldType: 'date' },
  { label: '内部管理单号', field: 'internalCode', fieldType: 'input', span: 24, },
  { label: '封面图片', field: 'imageUrl', fieldType: 'imageUpload', span: 24, defaultImgFn: (data) => {
      let img = defaultBannerMap[data.activityTypeCode] || placeholder1;
      return img;
  }},
]

const pageTitle = '线下活动详情'

const pageData = reactive({
  IdProp: props.IdProp,
  apiMap: {
    add: 'apm/apmOfflineActivity/add',
    edit: 'apm/apmOfflineActivity/edit',
    detail: 'apm/apmOfflineActivity/queryById',
    submit: 'apm/apmOfflineActivity/submit',
    delete: 'apm/apmOfflineActivity/delete',
  },
  formConfigs,
  statusHistoryColumns:STATUS_HISTORY_COLUMNS,
  pageTitle,
  handleBeforeSave: (data) => {
    data.imageUrl = data.imageUrl.join(',');
  },
  detailPath: '/user/published/OfflineEventDetail',
  listPath: '/user/published/OfflineEvent',
  tableSections: [
    {
      ...REGISTER_LIST
    },
    {
      ...BUSINESS_REF_LIST,
    }
  ],
  canSubmit: true,
  isUseDelete: true,
  successTitle: '需求创建成功'
})

const goBack = () => {
  router.push({ path: '/user/published/OfflineEvent' });
};

</script>
