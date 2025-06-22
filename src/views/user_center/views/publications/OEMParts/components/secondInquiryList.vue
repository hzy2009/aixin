<template>
  <div v-show="props.data.length > 0">
    <div>第二轮报价</div>
    <a-table  class="custom-detail-table" :dataSource="dataSource" :columns="columns" :pagination="false" bordered rowKey="key">
    </a-table>
  </div></template>

<script setup lang='jsx'>
import { ref, watch } from 'vue'
import  Dayjs  from 'dayjs'; // Import Dayjs for type-checking if needed

// 1. Define props and emits. 'update:data' is key for v-model.
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
const emit = defineEmits(['select-winner', 'update:data']);

// 2. Create a local, modifiable copy of the data.
const dataSource = ref([]);

// 3. Watch the incoming prop to update the local copy.
watch(() => props.data, (newData) => {
  // Use deep copy to avoid mutating props directly.
  dataSource.value = JSON.parse(JSON.stringify(newData || []));
}, { immediate: true, deep: true });

// --- NEW LOGIC ---
/**
 * Handles changes to the expiry date.
 * @param {Dayjs | null} date - The new date value from the picker.
 * @param {string} dateString - The formatted date string.
 * @param {number} index - The index of the row being edited.
 */
const handleDateChange = (date, dateString, index) => {
  if (index === 0) {
    dataSource.value.forEach(item => {
      item.expireDate = Dayjs(dateString); // Update all rows with the new dateString;
    });
  }
  if (!dateString) return
  
  emit('update:data', dataSource.value);
};
// --- END NEW LOGIC ---

const handleWinnerChange = (record, checked) => {
  // This logic can now be simplified if we let the parent handle it,
  // but for full encapsulation, we can do it here and emit.
  // const isWin = checked ? 1 : 0;
  // record.isWinner = isWin; // Update local record

  // Emit the event for the parent to handle global logic (like clearing other lists)
  emit('select-winner', { record, checked, type:'second' });
  // Also emit the data update
  // emit('update:data', dataSource.value);
};

const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      customRender: ({ index }) => index + 1
    },
    {
      title: '贸易商',
      dataIndex: 'refUserName',
      width: 80,
    },
    {
      title: '含税价格',
      dataIndex: 'price',
      width: 80,
    },
    {
      title: '未税价格',
      dataIndex: 'untaxedPrice',
      width: 80,
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
      width: 100,
      customRender: ({ record, index }) => {
        // Use a date picker for editing
        const disabled = props.isSecondInquiryEnable === 1 || props.isFinished === 1
        return (
          disabled ?
            <span>{record.expireDate ? Dayjs(record.expireDate).format('YYYY-MM-DD') : '-'}</span> : 
            <a-date-picker 
                format="YYYY-MM-DD" valueFormat="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }}
                v-model:value={record.expireDate}
                placeholder="请选择日期"
                // Pass index to the handler
                onChange={(date, dateString) => handleDateChange(date, dateString, index)}
            />
        )
      }
    },
    {
      title: '选定中标方',
      dataIndex: 'isWinner',
      width: 60,
      customRender: ({ record }) => {
        const { price, untaxedPrice } = record
        const disabled = () => {
          if (props.isFinished === 1) return true
          if (!price || !untaxedPrice) return true
          return false
        }
        return (
            <a-checkbox 
                disabled={disabled()}
                checked={record.isWinner}
                onChange={(e) => handleWinnerChange(record, e.target.checked)}
            />
        );
      },
    },
];
</script>

<style lang="less" scoped>
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