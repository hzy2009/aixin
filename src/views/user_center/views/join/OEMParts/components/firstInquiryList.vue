<template>
    <div style="margin-bottom: 20px;">
        <div>第一轮报价</div>
        <a-table class="custom-detail-table" :dataSource="props.data" :columns="columns" :pagination="false" bordered rowKey="key">
        </a-table>
    </div>
</template>

<script setup lang='jsx'>
// 1. 定义 props 和 emits
const props = defineProps({
  data: {
    type: Array,
    default: () => []
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

const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      customRender: ({ index }) => index + 1 // 使用 customRender 实现序号
    },
    {
      title: '贸易商',
      dataIndex: 'refUserName',
      width: 80,
    },
    {
      title: '含税价格',
      dataIndex: 'priceIncludingTax',
      width: 100,
      customRender: ({ record }) => {
        return (
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
      width: 100,
      customRender: ({ record }) => {
        return (
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
      width: 60,
      customRender: ({ record }) => {
        return (
            <a-date-picker v-model:value={record.deliveryDate} format="YYYY-MM-DD" valueFormat="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }}></a-date-picker>
        );
      }
    },
    {
      title: '付款条件',
      dataIndex: 'paymentTermsCode',
      width: 80,
      customRender: ({ record }) => {
        const options = selectOptions('trade_type');
          return (
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
    },
    {
      title: '质保说明',
      dataIndex: 'guaranteeDesc',
      width: 80,
    },
    {
      title: '报价截止日期',
      dataIndex: 'expireDate',
      width: 90,
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