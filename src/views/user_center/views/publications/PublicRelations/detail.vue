<template>
  <div>
    <detail :pageData="pageData" @goBack="goBack">
      <template #productType="{ dataSource, isView }">
        <div v-if='dataSource.statusCode !== "submit" || isView'><span>{{ dataSource.productMainTypeName }}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ dataSource.productTypeName }}</span></div>
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
import { selectOptions } from '@/utils/index';

import { BUSINESS_REF_LIST, TENANT_REF_LIST, STATUS_HISTORY_COLUMNS} from '@/utils/const.jsx';

const authStore = useAuthStore();

const props = defineProps({
  IdProp: { type: String, default: null },
});


const router = useRouter();
// // --- 表单配置 ---
const formConfigs = [
  { label: '爱芯享定制开发单号', field: 'code', span: 24},
  // {
  //   label: '定制开发类型', field: 'rdCode', dictKey: 'rd_type', span: 24, fieldType: 'select',
  // },
  {
    label: '产品类别', field: 'productType', fieldType: 'slot', span: 24,
  },
  // {
  //   label: '期望匹配周期', field: 'matchPeriodCode', dictKey: 'rd_breakthrough_period', span: 24, fieldType: 'select'
  // },
  { label: '需求创建日期', field: 'createTime', fieldType: 'date', span: 24},
  { label: '期望完成日期', field: 'expireDate', fieldType: 'date', span: 24},
  { label: '内部管理单号', field: 'internalCode', span: 24, },
  // { label: '需求有效期', field: 'expireDate', span: 24 },
  { label: '需求提出方', field: 'createBy', span: 24, },
]


// const demandTypeDisplayName = '定制开发';

const pageTitle = '定制开发详情'

const pageData = reactive({
  IdProp: props.IdProp,
  apiMap: {
    add: 'apm/apmRdBreakthrough/add',
    edit: 'apm/apmRdBreakthrough/edit',
    detail: 'apm/apmRdBreakthrough/queryById',
    submit: 'apm/apmRdBreakthrough/submit',
    delete: 'apm/apmRdBreakthrough/delete',
  },
  formConfigs,
  statusHistoryColumns: STATUS_HISTORY_COLUMNS,
  pageTitle,
  canSubmit: true,
  isUseDelete: true,
  detailPath: '/user/published/PublicRelations/detail',
  listPath: '/user/published/PublicRelations',
  tableSections: [
    {
      title: '定制开发承接方',
      groupCode: 'tenantRefList',
      columns: [
          { title: '序号', type: 'seq', width: 48, align: 'center' },
          { title: '定制开发承接方', field: 'refUserName', align: 'center' },
      ]
    },
    {
      ...BUSINESS_REF_LIST
    }
  ],
})

const goBack = () => {
  router.go(-1);
  // router.push('/user/published/PublicRelations');
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
