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
const emit = defineEmits(['toggle-selection', 'select-winner']);


// 2. 定义处理函数，它们只负责 emit 事件
const handleSelectionChange = (record, checked) => {
  // 通知父组件：哪个记录的“入围”状态改变了
  emit('toggle-selection', { record, checked });
};

const handleWinnerChange = (record, checked) => {
  // 通知父组件：哪个记录被选为“中标方”
  emit('select-winner', { record, checked });
};
// import { ref, watchEffect } from 'vue'
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
      dataIndex: 'price',
      width: 100,
    //   customRender: ({ record }) => {
    //     return (
    //         <a-input-number
    //             v-model:value={record.price}
    //             formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
    //             parser={(value) => value.replace(/\$\s?|(,*)/g, '')} // 允许粘贴带逗号的数字
    //             style={{ width: '100%' }}
    //         />
    //     );
    //   },
    },
    {
      title: '未税价格',
      dataIndex: 'untaxedPrice',
      width: 100,
    },
    {
      title: '交期',
      dataIndex: 'deliveryDate',
      width: 60,
    },
    {
      title: '付款条件',
      dataIndex: 'paymentTermsName',
      width: 80,
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
     {
      title: '入围第二轮报价',
      dataIndex: 'isSelected',
      width: 90,
      customRender: ({ record }) => {
        return (
            <a-checkbox 
                checked={record.isSelected} // 直接使用 prop 的值
                onChange={(e) => handleSelectionChange(record, e.target.checked)}
            />
        );
      },
    },
    {
      title: '选定中标方',
      dataIndex: 'isWinne',
      width: 70,
      customRender: ({ record }) => {
        return (
            <a-checkbox 
                checked={record.isWinne} // 直接使用 prop 的值
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