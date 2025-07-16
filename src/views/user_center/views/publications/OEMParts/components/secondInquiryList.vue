<template>
  <div>第二轮报价</div>
  <!-- 使用 vxe-grid 替代 a-table -->
  <vxe-grid class="custom-detail-table" :data="dataSource" :columns="columns" :row-config="{ keyField: 'key' }"
    resizable border ref="gridRef" size="small" min-height="88">
  </vxe-grid>
</template>

<script setup lang='jsx'>
import { ref, watch } from 'vue'
import Dayjs from 'dayjs';

// 1. Define props and emits. This part remains unchanged.
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
  },
  isDetail: {
    type: Boolean,
    default: false
  },
  sucessSecond: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['select-winner', 'update:data']);
const gridRef = ref(null);
// 2. Create a local, modifiable copy of the data. This logic is UI-independent and remains unchanged.
const dataSource = ref([]);

// 3. Watch the incoming prop to update the local copy. This also remains unchanged.
watch(() => props.data, (newData) => {
  dataSource.value = JSON.parse(JSON.stringify(newData || []));
}, { immediate: true, deep: true });

// --- All business logic functions remain unchanged ---
const handleDateChange = (date, dateString, index) => {
  console.log('date', date, 'dateString', dateString, 'index', index);
  if (index === 0) {
    dataSource.value.forEach(item => {
      item.expireDate = date;
    });
  }
  if (!dateString) return;
  
  emit('update:data', dataSource.value);
};

const handleWinnerChange = (record, checked) => {
  emit('select-winner', { record, checked, type:'second' });
};

// --- Column definitions are converted to vxe-table format ---
const columns = [
    {
      type: 'seq', // Use vxe-table's built-in sequence type
      title: '序号',
      width: '60px',
      fixed: 'left',
    },
    {
      title: '贸易商',
      width: '70px',
      field: 'refUserCode',
      fixed: 'left',
    },
    {
      title: '含税价格',
      field: 'priceIncludingTax',
      width: '100px',
    },
     {
      title: '税率%',
      field: 'tax',
      width: '70px',
    },
    {
      title: '未税价格',
      field: 'priceExcludingTax',
      width: '100px',
    },
    {
      title: '交期',
      field: 'deliveryDate',
      width: '90px',
      // Simple formatting is cleaner with a formatter
      formatter: ({ cellValue }) => {
        return cellValue ? Dayjs(cellValue).format('YYYY-MM-DD') : ''
      }
    },
    {
      title: '付款条件',
      width: '100px',
      field: 'paymentTermsName',
    },
    {
      title: '质保期',
      width: '70px',
      field: 'guaranteePeriod',
    },
    {
      title: '质保说明',
      width: '150px',
      field: 'guaranteeDesc',
    },
    {
      title: '报价截止日期',
      field: 'expireDate',
      width: 150,
      // Use slots.default for rendering complex components like a-date-picker
      slots: {
        default: ({ row, $rowIndex }) => { // vxe-table uses { row, $rowIndex }
          const disabled = props.isFinished == 1 || props.isDetail;
          return (
            disabled ?
              <span>{row.expireDate ? Dayjs(row.expireDate).format('YYYY-MM-DD') : ''}</span> : 
              <a-date-picker 
                  format="YYYY-MM-DD" valueFormat="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }}
                  v-model:value={row.expireDate}
                  placeholder="请选择日期"
                  onChange={(date, dateString) => handleDateChange(date, dateString, $rowIndex)}
              />
          )
        }
      }
    },
    {
      title: '选定中标方',
      field: 'isWinner',
      fixed: 'right',
      width: 188,
      // Use slots.default for rendering a-checkbox
      slots: {
        default: ({ row }) => { // vxe-table uses { row }
          const { priceIncludingTax, priceExcludingTax } = row;
          const isDisabled = () => {
            if (props.isFinished === 1) return true;
            if (!priceIncludingTax || !priceExcludingTax) return true;
            if (props.isDetail) return true
            if (props.sucessSecond) return true
            return false;
          }
          return (
              <a-switch
                disabled={isDisabled()}
                checked-children="是" un-checked-children="否"
                checked={row.isWinner === 1}
                onChange={(checked) => handleWinnerChange(row, checked)}
              />
          );
        },
      }
    },
];
const getData = () => {
  let data = gridRef.value.getData();
  return data
}
defineExpose({ getData });
</script>

<style lang="less" scoped>
// Styles are updated for vxe-table classes
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