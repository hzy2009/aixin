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
import { BUSINESS_REF_LIST, REGISTER_LIST, STATUS_HISTORY_COLUMNS} from '@/utils/const';

const props = defineProps({
  IdProp: { type: String, default: null },
});

const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '活动编号', field: 'code', span: 24 },
  { label: '活动类型', field: 'activityTypeName', dictKey: 'activity_type', span: 24 },
  { label: '活动内容', field: 'activityName', span: 24 },
  { label: '活动结果', field: 'description', span: 24 },
  { label: '活动名称', field: 'activityName', span: 24 },
  { label: '活动日期', field: 'activityDate', span: 24 },
  { label: '封面图片', field: 'imageUrl', fieldType: 'imageUpload', span: 24 },
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
})

const goBack = () => {
  router.push({ path: '/user/published/OfflineEvent' });
};

</script>
