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
  { label: '寻源编号', field: 'code', span: 24, },
  { label: '需求提出方', field: 'tenantName', span: 24, },
  { label: '提出需求日期', field: 'createTime', span: 24 },
  { label: '计划完成日期', field: 'expireDate', span: 24 },
  { label: '需求数量', field: 'reqPartsTotal', span: 24 },
  { label: '需求状态', field: 'statusName', span: 24, },
  { label: '已寻到数量', field: 'reqPartsFinish', span: 24 },
  { label: '未寻到数量', field: 'reqPartsUnfinish', span: 24 },
]

const statusHistoryColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center' },
  { title: '状态', dataIndex: 'operateName', key: 'operateName' },
  { title: '完成日期', dataIndex: 'createTime', key: 'createTime' },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
]

// const demandTypeDisplayName = '国产替代寻源需求';

const pageTitle = '国产替代寻源'
const queryAfter = (data) => {
  data.reqPartsUnfinish = data.reqPartsTotal - data.reqPartsFinish;
  return data;
};

const pageData = reactive({
  IdProp: props.IdProp,
  mode: props.mode,
  apiMap: {
    add: 'apm/apmSourcing/add',
    edit: 'apm/apmSourcing/edit',
    detail: 'apm/apmSourcing/queryById',
    submit: 'apm/apmSourcing/submit',
    delete: 'apm/apmSourcing/delete',
  },
  otherParams: {
    sourcingType: '国产替代寻源',
  },
  formConfigs,
  statusHistoryColumns,
  pageTitle,
  queryAfter,
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
  statusDictKey: 'sourcing_status',
})

const goBack = () => {
  router.go(-1);
};

</script>
