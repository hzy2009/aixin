<template>
  <div v-show="props.data.length > 0">
    <div>第二轮报价</div>
    <a-table  class="custom-detail-table" :dataSource="props.data" :columns="columns" :pagination="false" bordered rowKey="key">
    </a-table>
  </div>
</template>

<script setup lang='jsx'>
import {selectOptions} from '@/utils/index';
import { computed } from 'vue';
import dayjs from 'dayjs';
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  isFinished: {
    type: Number,
    default: 0
  }
});

/**
 * 
 * @param {string} value - 选中的值
 * @param {object} record - 当前主表行的数据
 * @param {Array} options - 选项列表
 */
const handlePaymentTermChange = (value, record, options) => {
    const selectedOption = options.find(opt => opt.value === value);
    if (selectedOption) {
        record.paymentTermsName = selectedOption.label;
    }
};
const isDisabled = computed(() => props.isFinished.value === 1);

const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 32,
      customRender: ({ index }) => index + 1 // 使用 customRender 实现序号
    },
    {
      title: '贸易商',
      dataIndex: 'refUserCode',
      width: 120,
    },
        {
      title: '含税价格',
      dataIndex: 'priceIncludingTax',
      width: 80,
      customRender: ({ record }) => {
        const expire = dayjs(record.expireDate); // 截止日期
        const disabled = dayjs().isAfter(expire, 'day')
        return (
            isDisabled.value || disabled? <span>{record.priceIncludingTax}</span> :
            <a-input-number
                v-model:value={record.priceIncludingTax}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')} // 允许粘贴带逗号的数字
                style={{ width: '100%' }}
            />
        );
      },
    },
    {
      title: '未税价格',
      dataIndex: 'priceExcludingTax',
      width: 80,
      customRender: ({ record }) => {
        const expire = dayjs(record.expireDate); // 截止日期
        const disabled = dayjs().isAfter(expire, 'day')
        return (
            isDisabled.value || disabled? <span>{record.priceExcludingTax}</span> :
            <a-input-number
                v-model:value={record.priceExcludingTax}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')} // 允许粘贴带逗号的数字
                style={{ width: '100%' }}
            />
        );
      },
    },
    {
      title: '交期',
      dataIndex: 'deliveryDate',
      width: 100,
      customRender: ({ record }) => {
        const expire = dayjs(record.expireDate); // 截止日期
        const disabled = dayjs().isAfter(expire, 'day')
        return (
            isDisabled.value || disabled? <span>{record.deliveryDate ? record.deliveryDate.split(' ')[0] : '--'}</span> :
            <a-date-picker v-model:value={record.deliveryDate} format="YYYY-MM-DD" valueFormat="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }}></a-date-picker>
        );
      }
    },
    {
      title: '付款条件',
      dataIndex: 'paymentTermsCode',
      width: 60,
      customRender: ({ record }) => {
        const expire = dayjs(record.expireDate); // 截止日期
        const disabled = dayjs().isAfter(expire, 'day')
        const options = selectOptions('paymentTerms_type');
          return (
            isDisabled.value || disabled? <span>{record.paymentTermsName}</span> :
            <a-select 
              v-model:value={record.tradeTypeCode} 
              style={{ width: '100%' }} 
              placeholder="付款条件"
              onChange={value => handlePaymentTermChange(value, record, options)}
            >
              {options.map(item => <a-select-option value={item.value}>{item.label}</a-select-option>)}
            </a-select>
          );
      },
    },
    {
      title: '质保期',
      dataIndex: 'guaranteePeriod',
      width: 60,
      customRender: ({ record }) => {
        const expire = dayjs(record.expireDate); // 截止日期
        const disabled = dayjs().isAfter(expire, 'day')
        return (
            isDisabled.value || disabled? <span>{record.guaranteePeriod}</span> :
            <a-input v-model:value={record.guaranteePeriod} style={{ width: '100%' }}></a-input>)
      }
    },
    {
      title: '质保说明',
      dataIndex: 'guaranteeDesc',
      width: 80,
      customRender: ({ record }) => {
        const expire = dayjs(record.expireDate); // 截止日期
        const disabled = dayjs().isAfter(expire, 'day')
        return (
            isDisabled.value || disabled? <span>{record.guaranteePeriod}</span> :
            <a-input v-model:value={record.guaranteeDesc} style={{ width: '100%' }}></a-input>)
      }
    },
    {
      title: '报价截止日期',
      dataIndex: 'expireDate',
      width: 70,
      customRender: ({ record }) => {
        return record.expireDate ? record.expireDate.split(' ')[0] : '--';
      }
    },
]
</script>

<style lang="less" scoped>
// 样式部分保持不变
@import '@/assets/styles/_variables.less';
.custom-detail-table {
	margin-top: @spacing-xs;

	:deep(.ant-table-thead > tr > th) {
		background-color: #FAFAFA;
		color: @text-color-base;
		font-weight: 500;
		font-size: 13px;
		padding: 10px 8px;
		text-align: left;
	}

	:deep(.ant-table-tbody > tr > td) {
		color: @text-color-secondary;
		font-size: 13px;
		padding: 10px 8px;
		word-break: break-all;
	}

	:deep(.ant-table-bordered .ant-table-container) {
		border-color: @border-color-light !important;
	}

	:deep(.ant-table-cell) {
		border-color: @border-color-light !important;
	}
}
</style>