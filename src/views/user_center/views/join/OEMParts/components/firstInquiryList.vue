<template>
    <div style="margin-bottom: 20px;">
        <div>第一轮报价</div>
        <!-- 使用 vxe-grid 替代 a-table -->
        <vxe-grid
          class="custom-detail-table"
          ref="gridRef"
          :data="props.data"
          :columns="columns"
          resizable
          :row-config="{ keyField: 'key' }"
          border
          size="small"
          min-height="88"
        >
        </vxe-grid>
    </div>
</template>

<script setup lang='jsx'>
import {selectOptions} from '@/utils/index';
import { computed,ref } from 'vue';
import dayjs from 'dayjs';

// 1. props and computed logic remain unchanged.
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  isSecondInquiryEnable: {
    type: Number,
    default: 0
  },
  isFinished: {
    type: Number,
    default: 0
  }
});
const isDisabled = computed(() => props.isFinished === 1);

const isSecondRound = computed(() => props.isSecondInquiryEnable === 1);

// Event handler also remains unchanged.
const handlePaymentTermChange = (value, record, options) => {
    const selectedOption = options.find(opt => opt.value === value);
    if (selectedOption) {
        record.paymentTermsName = selectedOption.label;
        record.paymentTermsCode = value;
    }
};
const gridRef = ref(null);
// 2. Columns are converted to vxe-table format.
const columns = [
    {
      type: 'seq', // Using vxe-table's built-in sequence type
      title: '序号',
      fixed: 'left',
      width: '60px',
    },
    {
      title: '贸易商',
      width: '70px',
      fixed: 'left',
      field: 'refUserCode',
    },
    {
      title: '含税价格',
      field: 'priceIncludingTax',
      width: '160px',
      slots: {
        default: ({ row }) => { // customRender -> slots.default, {record} -> {row}
            const expire = dayjs(row?.expireDate);
            const disabled = dayjs().isAfter(expire, 'day');
            return (
                isDisabled.value || isSecondRound.value || disabled ? <span>{row.priceIncludingTax}</span> :
                <a-input-number
                    v-model:value={row.priceIncludingTax}
                    min={0}
                    precision={2}
                    max={9999999999999}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    style={{ width: '100%' }}
                />
            );
        },
      }
    },
    {
      title: '税率%',
      field: 'tax',
      width: '160px',
      slots: {
        default: ({ row }) => { // customRender -> slots.default, {record} -> {row}
            const expire = dayjs(row?.expireDate);
            const disabled = dayjs().isAfter(expire, 'day');
            return (
                isDisabled.value || isSecondRound.value || disabled ? <span>{row.tax}</span> :
                <a-input-number
                    v-model:value={row.tax}
                    min={0}
                    precision={0}
                    max={100}
                    style={{ width: '100%' }}
                />
            );
        },
      }
    },
    {
      title: '未税价格',
      field: 'priceExcludingTax',
      width: '160px',
      slots: {
        default: ({ row }) => { // customRender -> slots.default, {record} -> {row}
            const expire = dayjs(row?.expireDate);
            const disabled = dayjs().isAfter(expire, 'day');
            return (
                isDisabled.value || isSecondRound.value || disabled ? <span>{row.priceExcludingTax}</span> :
                <a-input-number
                    v-model:value={row.priceExcludingTax}
                    min={0}
                    precision={2}
                    max={9999999999999}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    style={{ width: '100%' }}
                />
            );
        },
      }
    },
    {
      title: '交期',
      field: 'deliveryDate',
      width: 140,
      slots: {
        default: ({ row }) => { // customRender -> slots.default, {record} -> {row}
            const expire = dayjs(row?.expireDate);
            const disabled = dayjs().isAfter(expire, 'day');
            return (
                isDisabled.value || isSecondRound.value || disabled ? <span>{row.deliveryDate ? row.deliveryDate.split(' ')[0] : ''}</span> :
                <a-date-picker v-model:value={row.deliveryDate} format="YYYY-MM-DD" valueFormat="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }}></a-date-picker>
            );
        }
      }
    },
    {
      title: '付款条件',
      field: 'paymentTermsCode',
      width: '120px',
      slots: {
        default: ({ row }) => { // customRender -> slots.default, {record} -> {row}
            const options = selectOptions('paymentTerms_type');
            const expire = dayjs(row?.expireDate);
            const disabled = dayjs().isAfter(expire, 'day');
            return (
                isDisabled.value || isSecondRound.value || disabled ? <span>{row.paymentTermsName}</span> :
                <a-select 
                  v-model:value={row.paymentTermsCode} // Corrected: was tradeTypeCode in original
                  style={{ width: '100%' }} 
                  placeholder="付款条件"
                  options={options} // More concise way to pass options in JSX
                  onChange={value => handlePaymentTermChange(value, row, options)}
                />
            );
        },
      }
    },
    {
      title: '质保期',
      field: 'guaranteePeriod',
      width: '120px',
      slots: {
        default: ({ row }) => { // customRender -> slots.default, {record} -> {row}
            const expire = dayjs(row?.expireDate);
            const disabled = dayjs().isAfter(expire, 'day');
            return (
                isDisabled.value || isSecondRound.value || disabled ? <span>{row.guaranteePeriod}</span> :
                <a-input v-model:value={row.guaranteePeriod} style={{ width: '100%' }}></a-input>
            )
        }
      }
    },
    {
      title: '质保说明',
      field: 'guaranteeDesc',
      width: '160px',
      slots: {
        default: ({ row }) => { // customRender -> slots.default, {record} -> {row}
            const expire = dayjs(row?.expireDate);
            const disabled = dayjs().isAfter(expire, 'day');
            return (
                isDisabled.value || isSecondRound.value || disabled ? <span>{row.guaranteeDesc}</span> : // Corrected: was guaranteePeriod
                <a-input v-model:value={row.guaranteeDesc} style={{ width: '100%' }}></a-input>
            )
        }
      }
    },
    {
      title: '报价截止日期',
      field: 'expireDate',
      width: '160px',
      fixed: 'right',
      // Using formatter for simple text transformation is cleaner
      formatter: ({ cellValue }) => {
        return cellValue ? cellValue.split(' ')[0] : '';
      }
    },
]
const getData = () => {
  let data = gridRef.value.getData();
  return data
}
defineExpose({ getData });
</script>

<style lang="less" scoped>
// Styles are updated for vxe-table
@import '@/assets/styles/_variables.less';
.custom-detail-table {
	margin-top: @spacing-xs;

	:deep(.vxe-header--column) {
		background-color: #FAFAFA;
		color: @text-color-base;
		font-weight: 500;
		font-size: 13px;
		padding: 10px 8px;
		text-align: left;
    .vxe-cell {
      padding-left: 8px;
      padding-right: 8px;
    }
	}

	:deep(.vxe-body--column) {
		color: @text-color-secondary;
		font-size: 13px;
    .vxe-cell {
      padding: 10px 8px;
    }
		word-break: break-all;
	}
}
</style>