<template>
  <div>
    <edit :pageData="pageData" @goBack="goBack"></edit>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import edit from '@/components/template/edit.vue';
import { useAuthStore } from '@/store/authStore';



const props = defineProps({
  IdProp: { type: String, default: null },
});

const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '活动名称', field: 'activityName', fieldType: 'input', span: 24 },
  { label: '封面图片', field: 'imageUrl', fieldType: 'imageUpload', span: 24 },
  {
    label: '活动类型', field: 'activityTypeCode', fieldType: 'select', dictKey: 'activity_type', span: 24,
    onChange: ({ value, form, option }) => {
      form.activityTypeName = option.label || '';
    }
  },
  { label: '活动内容', field: 'description', fieldType: 'textarea', span: 24 },
  { label: '活动日期', field: 'activityDate', fieldType: 'date', span: 24 },
  { label: '电话', field: 'phone', fieldType: 'phone', span: 24 },
  { label: '邮箱', field: 'email', fieldType: 'email', span: 24 },
]

const statusHistoryColumns = [
  { title: '序号', type: 'seq', key: 'index', width: 60, align: 'center', align: 'center' },
  { title: '状态', field: 'operateName', key: 'operateName' },
  { title: '完成日期', field: 'createTime', key: 'createTime' },
  { title: '备注', field: 'remark', key: 'remark' },
]


const pageTitle = '创建线下活动'

const pageData = reactive({
  IdProp: props.IdProp,
  apiMap: {
    add: '/apm/apmResearchReport/add',
    edit: 'apm/apmOfflineActivity/edit',
    detail: 'apm/apmOfflineActivity/queryById',
    submit: 'apm/apmOfflineActivity/submit',
    delete: 'apm/apmOfflineActivity/delete',
  },
  formConfigs,
  statusHistoryColumns,
  pageTitle,
  handleBeforeSave: (data) => {
    data.imageUrl = data.imageUrl.join(',');
  },
  detailPath: '/user/published/OfflineEventDetail',
  listPath: '/user/published/OfflineEvent',
})

const goBack = () => {
  router.push('/user/published/OfflineEvent');
};

</script>
