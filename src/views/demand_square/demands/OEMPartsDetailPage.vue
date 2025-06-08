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

const authStore = useAuthStore();

const props = defineProps({
  demandIdProp: { type: String, default: null },
  mode: { type: String, default: 'view' }, // 'create', 'view'
});

const isManagerAdmin = computed(() => {
  return authStore.isManagerAdmin
});

const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '计划完成日期', field: 'expireDate', fieldType: 'date', span: 24 },
  { label: '创建日期', field: 'createTime', fieldType: 'date', span: 24, mode: 'view'  },
  { label: '需求数量', field: 'reqPartsTotal', fieldType: 'number', span: 24, min: 0  },
  {label: '需求提出方', field: 'tenantName', fieldType: 'input', span: 24, disabled: true,},
  // {
  //   label: '需求状态', field: 'statusCode', detailField: 'statusName', fieldType: 'select', dictKey: 'sourcing_status', span: 24, disabled: !isManagerAdmin.value,
  //   onChange: ({ value, form, options }) => {
  //     form.statusName = options.find(opt => opt.value === value)?.label || '';
  //   }
  // },
  {
    label: '需求状态', field: 'statusName', detailField: 'statusName', fieldType: 'input', span: 24, disabled: true,
  },
  { label: '已寻到数量', field: 'reqPartsFinish', fieldType: 'number', span: 24, disabled: true, mode: 'view' },
  { label: '未寻到数量', field: 'reqPartsUnfinish', fieldType: 'number', span: 24, disabled: true, mode: 'view'  },
].filter(item => {
    if (props.mode == 'create' && item.mode == 'view') {
      return false;
    }
    return true;
  }
);

const statusHistoryColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 60, align: 'center' },
  { title: '状态', dataIndex: 'operateName', key: 'operateName' },
  { title: '完成日期', dataIndex: 'createTime', key: 'createTime' },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
]


const pageTitle = '原厂件寻源'

const pageData = reactive({
  demandIdProp: props.demandIdProp,
  mode: props.mode,
  apiMap: {
    add: 'apm/apmSourcing/add',
    edit: 'apm/apmSourcing/edit',
    detail: 'apm/apmSourcing/queryById',
    submit: 'apm/apmSourcing/submit',
    delete: 'apm/apmSourcing/delete',
  },
  otherParams: {
    sourcingType: '原厂件寻源',
  },
  formConfigs,
  statusHistoryColumns,
  pageTitle,
})

const goBack = () => {
  // router.push('/user/published/OEMPartsSourcing');
  router.go(-1);
};

</script>
