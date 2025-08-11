<template>
  <div>
    <detail :pageData="pageData" @goBack="goBack">
      <template #productType="{ dataSource }">
        <div v-if='dataSource.statusCode !== "submit"'><span>{{ dataSource.productMainTypeName }}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ dataSource.productTypeName }}</span></div>
        <div v-else>
         <a-select v-model:value="dataSource['productMainTypeCode']" :placeholder="`请选择`" 
            style="width: 185px; margin-right: 16px"
            :options="selectOptions('product_main_type')" 
            @change="(v, option) => handleSelectProductMainTypeChange(v, field, option, dataSource)" allow-clear />

          <a-select v-model:value="dataSource['productType']" :placeholder="`请选择`" 
            :disabled="!dataSource['productMainTypeCode']"
            style="width: 185px"
            :options="dataSource['productMainTypeCode'] == 'product_type' ? selectOptions('product_type') : selectOptions('product_type_material')" 
              @change="(v, option) => handleSelectProductTypeChange(v, field, option, dataSource)" allow-clear />
        </div>
      </template>
    </detail>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import detail from '@/components/template/detail.vue';
import { useAuthStore } from '@/store/authStore';
import { BUSINESS_REF_LIST, STATUS_HISTORY_COLUMNS, TENANT_REF_LIST } from '@/utils/const.jsx';
import { selectOptions } from '@/utils/index';


const props = defineProps({
  IdProp: { type: String, default: null },
});

const isManagerAdmin = computed(() => {
  return authStore.isManagerAdmin
});

const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  {
    label: '爱芯享检测验证单号', field: 'code', span: 24,
  },
  { label: '需求创建日期', field: 'createTime', fieldType: 'date', span: 24},
  { label: '期望完成日期', field: 'expireDate', fieldType: 'date', span: 24 },
  { label: '内部管理单号', field: 'internalCode', span: 24, },
  // {
  //   label: '产品类别', field: 'productType', fieldType: 'select', dictKey: 'product_type', span: 24,
  // },
  {
    label: '产品类别', field: 'productType', fieldType: 'slot', span: 24,
  },
  {
    label: '检测验证类别', field: 'projectType', fieldType: 'select', dictKey: 'project_type', span: 24,
  },
  // {
  //   label: '验证项目', field: 'projectName', fieldType: 'input', span: 24,
  // },
  {
    label: '需求提出方', field: 'createBy', span: 24, disabled: true,
  },
  // {
  //   label: '检测验证状态', field: 'statusName', detailField: 'statusName', fieldType: 'select', span: 24, disabled: true,
  // },
]


const pageTitle = '检测验证详情'

const pageData = reactive({
  IdProp: props.IdProp,
  apiMap: {
    add: 'apm/apmInspection/add',
    edit: 'apm/apmInspection/edit',
    detail: 'apm/apmInspection/queryById',
    submit: 'apm/apmInspection/submit',
    delete: 'apm/apmInspection/delete',
  },
  formConfigs,
  statusHistoryColumns: STATUS_HISTORY_COLUMNS,
  pageTitle,
  canSubmit: true,
  isUseDelete: true,
  detailPath: '/user/published/Verification/detail',
  listPath: '/user/published/Verification',
  tableSections: [
    {
      title: '检测验证承接方',
      groupCode: 'tenantRefList',
      columns: [
          { title: '序号', type: 'seq', width: 48, align: 'center' },
          { title: '检测验证承接方', field: 'refUserName', align: 'center' },
      ]
    },
    {
      ...BUSINESS_REF_LIST
    }
  ]
})

const goBack = () => {
  router.go(-1);
  // router.push('/user/published/verification');
};

//特殊代码不复用的烂代码，赶时间
const handleSelectProductMainTypeChange = (v, field, option, dataSource) => {
  dataSource['productMainTypeName'] = option?.label
  dataSource['productType'] = ''
  dataSource['productTypeName'] = ''
}
const handleSelectProductTypeChange = (v, field, option, dataSource) => {
  dataSource['productTypeName'] = option?.label
}
</script>
