<template>
    <div style="margin-bottom: 20px;">
        <div>第一轮报价</div>
        <!-- 使用 vxe-grid 替代 a-table -->
        <vxe-grid
          class="custom-detail-table"
          :data="props.data"
          :columns="columns"
          :row-config="{ keyField: 'key' }"
          border
          size="small"
        >
        </vxe-grid>
    </div>
</template>

<script setup lang='jsx'>
import {selectOptions} from '@/utils/index';
import { computed } from 'vue';
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
  }
});

const isSecondRound = computed(() => props.isSecondInquiryEnable === 1);

// Event handler also remains unchanged.
const handlePaymentTermChange = (value, record, options) => {
    const selectedOption = options.find(opt => opt.value === value);
    if (selectedOption) {
        record.paymentTermsName = selectedOption.label;
        record.paymentTermsCode = value;
    }
};

// 2. Columns are converted to vxe-table format.
const columns = [
    {
      type: 'seq', // Using vxe-table's built-in sequence type
      title: '序号',
      width: 32,
    },
    {
      title: '贸易商',
      field: 'refUserCode', // dataIndex -> field
      width: 120,
    },
    {
      title: '含税价格',
      field: 'priceIncludingTax',
      width: 80,
      slots: {
        default: ({ row }) => { // customRender -> slots.default, {record} -> {row}
            const expire = dayjs(row.expireDate);
            const disabled = dayjs().isAfter(expire, 'day');
            return (
                isSecondRound.value || disabled ? <span>{row.priceIncludingTax}</span> :
                <a-input-number
                    v-model:value={row.priceIncludingTax}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    style={{ width: '100%' }}
                />
            );
        },
      }
    },
    {
      title: '未税价格',
      field: 'priceExcludingTax',
      width: 80,
      slots: {
        default: ({ row }) => { // customRender -> slots.default, {record} -> {row}
            const expire = dayjs(row.expireDate);
            const disabled = dayjs().isAfter(expire, 'day');
            return (
                isSecondRound.value || disabled ? <span>{row.priceExcludingTax}</span> :
                <a-input-number
                    v-model:value={row.priceExcludingTax}
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
      width: 100,
      slots: {
        default: ({ row }) => { // customRender -> slots.default, {record} -> {row}
            const expire = dayjs(row.expireDate);
            const disabled = dayjs().isAfter(expire, 'day');
            return (
                isSecondRound.value || disabled ? <span>{row.deliveryDate ? row.deliveryDate.split(' ')[0] : '--'}</span> :
                <a-date-picker v-model:value={row.deliveryDate} format="YYYY-MM-DD" valueFormat="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }}></a-date-picker>
            );
        }
      }
    },
    {
      title: '付款条件',
      field: 'paymentTermsCode',
      width: 60,
      slots: {
        default: ({ row }) => { // customRender -> slots.default, {record} -> {row}
            const options = selectOptions('paymentTerms_type');
            const expire = dayjs(row.expireDate);
            const disabled = dayjs().isAfter(expire, 'day');
            return (
                isSecondRound.value || disabled ? <span>{row.paymentTermsName}</span> :
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
      width: 60,
      slots: {
        default: ({ row }) => { // customRender -> slots.default, {record} -> {row}
            const expire = dayjs(row.expireDate);
            const disabled = dayjs().isAfter(expire, 'day');
            return (
                isSecondRound.value || disabled ? <span>{row.guaranteePeriod}</span> :
                <a-input v-model:value={row.guaranteePeriod} style={{ width: '100%' }}></a-input>
            )
        }
      }
    },
    {
      title: '质保说明',
      field: 'guaranteeDesc',
      width: 80,
      slots: {
        default: ({ row }) => { // customRender -> slots.default, {record} -> {row}
            const expire = dayjs(row.expireDate);
            const disabled = dayjs().isAfter(expire, 'day');
            return (
                isSecondRound.value || disabled ? <span>{row.guaranteeDesc}</span> : // Corrected: was guaranteePeriod
                <a-input v-model:value={row.guaranteeDesc} style={{ width: '100%' }}></a-input>
            )
        }
      }
    },
    {
      title: '报价截止日期',
      field: 'expireDate',
      width: 70,
      // Using formatter for simple text transformation is cleaner
      formatter: ({ cellValue }) => {
        return cellValue ? cellValue.split(' ')[0] : '--';
      }
    },
]
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