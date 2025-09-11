<template>
  <div>
    <edit :pageData="pageData" @goBack="goBack"/>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import edit from '@/components/template/edit.vue';
import dayjs from 'dayjs';

const props = defineProps({
  IdProp: { type: String, default: null },
  mode: { type: String, default: 'view' }, // 'create', 'view'
});

const router = useRouter();

const formConfigs = [
  {
    label: '零部件料号',
    field: 'partNumber',
    fieldType: 'input',
    span: 24,
  },
  {
    label: '零部件名称',
    field: 'productName',
    fieldType: 'input',
    span: 24,
  },
  {
    label: '零部件来源',
    field: 'productSource',
    fieldType: 'input',
    span: 24,
  },
  {
    label: '零部件型号',
    field: 'productModel',
    fieldType: 'input',
    span: 24,
  },
  {
    label: '规格',
    field: 'specification',
    fieldType: 'input',
    span: 24,
  },
  {
    label: '适用设备型号',
    field: 'compatibleModels',
    fieldType: 'input',
    span: 24,
  },
  {
    label: '品牌/制造商',
    field: 'originalManufacturer',
    fieldType: 'input',
    span: 24,
  },
  {
    label: '生产日期',
    field: 'productionDate',
    fieldType: 'date',
    span: 24,
  },
  {
    label: '产品状态',
    field: 'productStatusName',
    fieldType: 'input',
    span: 24,
  },
  {
    label: '数量',
    field: 'quantity',
    fieldType: 'number',
    span: 24,
  },
  {
    label: '质保期',
    field: 'guaranteePeriod',
    fieldType: 'input',
    span: 24,
  },
  {
    label: '含税单价',
    field: 'priceIncludingTax',
    fieldType: 'number',
    span: 24,
 
    onChange: ({ formModel, value }) => {
      const v = Number(value) || 0;
      formModel.priceExcludingTax = (v / (1 + (formModel.tax || 0) / 100)).toFixed(2);
    }
  },
  {
    label: '税率%',
    field: 'tax',
    fieldType: 'number',
    span: 24,
    onChange: ({ formModel, value }) => {
      const v = Number(value) || 0;
      formModel.priceExcludingTax = ((formModel.priceIncludingTax || 0) / (1 + v / 100)).toFixed(2);
    },
  },
  {
    label: '不含税单价',
    field: 'priceExcludingTax',
    fieldType: 'number',
    span: 24,
    disabled: true,
  },
  {
    label: '付款条件',
    field: 'paymentTermsName',
    fieldType: 'input',
    span: 24,
  },
  {
    label: '交易方式',
    field: 'tradeTypeCode',
    fieldType: 'select',
    dictKey: 'device_trade_type',
    span: 24,
     onChange: ({ value, form, option }) => {
      form.tradeTypeName = option.label || '';
    }
  },
  // {
  //   label: '交易方式名称',
  //   field: 'tradeTypeName',
  //   fieldType: 'input',
  //   span: 24,
  // },
  {
    label: '物流方式',
    field: 'shippingTypeName',
    fieldType: 'input',
    span: 24,
  },
  {
    label: '价格类型',
    field: 'purchaseMethod',
    fieldType: 'select',
    dictKey: 'purchase_method',
    span: 24,
    onChange: ({ value, form, option }) => {
        form.expiredDate = null
    }
  },
  {
    label: '竞价截止日期',
    field: 'expireDate',
    fieldType: 'date',
    span: 24,
    showTime: true,
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
    disabled: ({ formModel }) => formModel.purchaseMethod !== 'AUCTION',
  },
  {
    label: '产品组',
    field: 'productGroup',
    fieldType: 'input',
    span: 24,
  },
  {
    label: '缩略图链接',
    field: 'imageUrl',
    fieldType: 'imageWall',
    span: 24,
    uploadUrl: '/apm/sys/file/upload/A',
  },
  {
    label: '库存状态',
    field: 'stockStatusName',
    fieldType: 'input',
    span: 24,
  },
  {
    label: '概述',
    field: 'description',
    fieldType: 'textarea',
    span: 24,
  },
  {
    label: '使用时长',
    field: 'usageDuration',
    fieldType: 'input',
    span: 24,
  },
  {
    label: '到货时间',
    field: 'deliveryDate',
    fieldType: 'input',
    span: 24,
  },
  {
    label: '工艺段',
    field: 'processSection',
    fieldType: 'input',
    span: 24,
  },
  {
    label: '交期',
    field: 'deliveryDuration',
    fieldType: 'input',
    span: 24,
  },
  {
    label: '有产品使用说明书',
    field: 'hasUserManual',
    fieldType: 'select',
    dictKey: 'yn',
    span: 24,
  },
  {
    label: '备注',
    field: 'remark',
    fieldType: 'input',
    span: 24,
  },
];

const pageTitle = '创建原厂件库存处理需求'; // Updated page title

const pageData = reactive({
  IdProp: props.IdProp,
  apiMap: {
    add: 'apm/oemParts/add',
    edit: 'apm/oemParts/edit',
    detail: 'apm/oemParts/queryById',
    submit: 'apm/oemParts/submit',
    delete: 'apm/oemParts/delete',
  },
  formConfigs,
  pageTitle,
  otherParams: {
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  },
  detailPath: '/user/published/secondTrade/oemParts/detail',
  listPath: '/user/published/secondTrade/oemParts',
});

const goBack = () => {
  router.push('/user/published/secondTrade/oemParts');
};
</script>