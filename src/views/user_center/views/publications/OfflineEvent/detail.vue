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



const props = defineProps({
  IdProp: { type: String, default: null },
});

const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '活动编号', field: 'code', span: 24},
  { label: '活动类型', field: 'activityTypeName', dictKey: 'activity_type', span: 24},
  { label: '活动会议内容', field: 'activityName', span: 24},
  { label: '活动会议结果', field: 'description', span: 24 },
  { label: '活动名称', field: 'activityName', span: 24},
  { label: '活动图片', field: 'imageUrl', fieldType: 'imageUpload', span: 24 },
]

const statusHistoryColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center' },
  { title: '状态', dataIndex: 'operateName', key: 'operateName' },
  { title: '完成日期', dataIndex: 'createTime', key: 'createTime' },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
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
      title: '参与者',
      groupCode: 'registerList',
      columns: [
        { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center' },
        { title: '类型', dataIndex: 'registerType', key: 'registerType' },
        { title: '编号', dataIndex: 'registerUserId', key: 'registerUserId' },
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
