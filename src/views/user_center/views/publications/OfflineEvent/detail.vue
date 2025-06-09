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

const authStore = useAuthStore();

const props = defineProps({
  IdProp: { type: String, default: null },
});

const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '活动名称', field: 'activityName', fieldType: 'input', span: 24},
  { label: '活动图片', field: 'imageUrl', fieldType: 'imageUpload', span: 24 },
  {
    label: '活动类型', field: 'activityTypeCode', fieldType: 'select', dictKey: 'activity_type', span: 24,
    onChange: ({ value, form, option }) => {
      form.activityTypeName = option.label || '';
    }
  },
  { label: '活动内容', field: 'description', fieldType: 'textarea', span: 24 },
]

const statusHistoryColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center' },
  { title: '状态', dataIndex: 'operateName', key: 'operateName' },
  { title: '完成日期', dataIndex: 'createTime', key: 'createTime' },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
]


const pageTitle = '线下活动'

const pageData = reactive({
  IdProp: props.IdProp,
  mode: props.mode,
  apiMap: {
    add: 'apm/apmOfflineActivity/add',
    edit: 'apm/apmOfflineActivity/edit',
    detail: 'apm/apmOfflineActivity/queryById',
    submit: 'apm/apmOfflineActivity/submit',
    delete: 'apm/apmOfflineActivity/delete',
  },
  formConfigs,
  statusHistoryColumns,
  pageTitle,
  handleBeforeSave: (data) => {
    debugger
    data.imageUrl = data.imageUrl.join(',');
  },
  detailPath: '/user/published/OfflineEventDetail',
  listPath: '/user/published/OfflineEvent',
  tableSections: [
    {
      title: '物料清单',
      groupCode: 'materialList',
      columns: [
        { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center' },
        { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
        { title: '物料数量', dataIndex: 'materialCount', key: 'materialCount' },
        { title: '物料单位', dataIndex: 'materialUnit', key: 'materialUnit' },
      ]
    },
    {
      title: '关联业务',
      groupCode: 'businessRefList',
      columns: [
        { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center', align: 'center' },
        { title: '单据类型', dataIndex: 'businessRefTypeName', key: 'materialName', align: 'center' },
        { title: '单据号', dataIndex: 'businessRefCode', key: 'materialCount', align: 'center' },
      ]
    }
  ],
})

const goBack = () => {
  router.go(-1);
  // router.push('/user/published/PublicRelations');
};

</script>
