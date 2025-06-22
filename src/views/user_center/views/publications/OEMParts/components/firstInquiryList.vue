<template>
    <div style="margin-bottom: 20px;">
        <div>第一轮报价</div>
        <a-table class="custom-detail-table" :dataSource="props.data" :columns="columns" :pagination="false" bordered rowKey="key" size="small">
        </a-table>
    </div>
</template>

<script setup lang='jsx'>
import  Dayjs  from 'dayjs'; // Import Dayjs for type-checking if needed
// 1. 定义 props 和 emits
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
const emit = defineEmits(['toggle-selection', 'select-winner']);


// 2. 定义处理函数，它们只负责 emit 事件
const handleSelectionChange = (record, checked, type) => {
  // 通知父组件：哪个记录的“入围”状态改变了
  emit('toggle-selection', { record, checked });
};

const handleWinnerChange = (record, checked) => {
  // 通知父组件：哪个记录被选为“中标方”
  emit('select-winner', { record, checked, type: 'first' });
};
// import { ref, watchEffect } from 'vue'
const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: '44px',
      customRender: ({ index }) => index + 1 // 使用 customRender 实现序号
    },
    {
      title: '贸易商',
      width: '180px',
      dataIndex: 'refUserName',
    },
    {
      title: '含税价格',
      width: '80px',
      dataIndex: 'priceIncludingTax',
    },
    {
      title: '未税价格',
      width: '80px',
      dataIndex: 'priceExcludingTax',
    },
    {
      title: '交期',
      dataIndex: 'deliveryDate',
      width: '90px',
      customRender: ({ record }) => {
        // Use a date picker for editing
        return record.deliveryDate ? Dayjs(record.deliveryDate).format('YYYY-MM-DD') : '-'
      }
    },
    {
      title: '付款条件',
      width: '80px',
      dataIndex: 'paymentTermsName',
    },
    {
      title: '质保期',
      width: '70px',
      dataIndex: 'guaranteePeriod',
    },
    {
      title: '质保说明',
      width: '90px',
      dataIndex: 'guaranteeDesc',
    },
    {
      title: '报价截止日期',
      width: '100px',
      dataIndex: 'expireDate',
      customRender: ({ record }) => {
        return record.expireDate ? record.expireDate.split(' ')[0] : '-';
      }
    },
     {
      title: '入围第二轮报价',
      dataIndex: 'isSelected',
      fixed: 'right',
      customRender: ({ record }) => {
        const { priceIncludingTax, priceExcludingTax } = record
        const disabled = () => {
          if (props.isSecondInquiryEnable === 1 || props.isFinished === 1) return true
          if (!priceIncludingTax || !priceExcludingTax) return true
          return false
        }
        return (
            <a-checkbox 
                disabled={disabled()}
                checked={record.isSelected === 1} 
                onChange={(e) => handleSelectionChange(record, e.target.checked)}
            />
        );
      },
    },
    {
      title: '选定中标方',
      dataIndex: 'isWinner',
      fixed: 'right',
      customRender: ({ record }) => {
        const { priceIncludingTax, priceExcludingTax } = record
        const disabled = () => {
          if (props.isSecondInquiryEnable === 1 || props.isFinished === 1) return true
          if (!priceIncludingTax || !priceExcludingTax) return true
          return false
        }
        return (
            <a-checkbox 
                disabled={disabled()}
                checked={record.isWinner === 1}
                onChange={(e) => handleWinnerChange(record, e.target.checked)}
            />
        );
      },
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