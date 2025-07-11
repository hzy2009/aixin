<template>
    <div style="margin-bottom: 20px;">
        <div>第一轮报价</div>
        <!-- 使用 vxe-grid 替代 a-table -->
        <vxe-grid
          class="custom-detail-table"
          :data="props.data"
          :columns="columns"
          border
          size="small"
          ref="gridRef"
        min-height="88"
        >
        </vxe-grid>
    </div>
</template>

<script setup lang='jsx'>
import { ref } from 'vue';
import Dayjs from 'dayjs';

// 1. 定义 props 和 emits (保持不变)
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
  }
});
const emit = defineEmits(['toggle-selection', 'select-winner']);
const gridRef = ref(null);

// 2. 定义处理函数 (保持不变)
const handleSelectionChange = (record, checked) => {
  // 通知父组件：哪个记录的“入围”状态改变了
  emit('toggle-selection', { record, checked });
};

const handleWinnerChange = (record, checked) => {
  // 通知父组件：哪个记录被选为“中标方”
  emit('select-winner', { record, checked, type: 'first' });
};

// 3. vxe-grid 的列配置 (移除了 TypeScript 类型注解)
const columns = [
    {
      type: 'seq', // 使用 vxe-table 内置的序号类型
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
      width: '100px',
      field: 'priceIncludingTax',
    },
    {
      title: '税率%',
      field: 'tax',
      width: '70px',
    },
    {
      title: '未税价格',
      width: '100px',
      field: 'priceExcludingTax',
    },
    {
      title: '交期',
      field: 'deliveryDate',
      width: '90px',
      // 使用 formatter 进行简单的日期格式化
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
      width: '106px',
      field: 'expireDate',
      // 使用 formatter 进行简单的字符串处理
      formatter: ({ cellValue }) => {
        return cellValue ? cellValue.split(' ')[0] : '';
      }
    },
     {
      title: '入围第二轮报价',
      field: 'isSelected',
      fixed: 'right',
      width: '120px', // vxe-table 要求固定列有明确宽度
      // 使用 slots.default 来自定义单元格内容
      slots: {
        default: ({ row }) => { // vxe-table 作用域变量是 row
          const { priceIncludingTax, priceExcludingTax } = row
          const disabled = () => {
            if (props.isSecondInquiryEnable === 1 || props.isFinished === 1) return true
            if (!priceIncludingTax || !priceExcludingTax) return true
            if (props.isDetail) return true
            return false
          }
          return (
              <a-checkbox
                  disabled={disabled()}
                  checked={row.isSelected === 1}
                  onChange={(e) => handleSelectionChange(row, e.target.checked)}
              />
          );
        }
      }
    },
    {
      title: '选定中标方',
      field: 'isWinner',
      fixed: 'right',
      width: '100px', // vxe-table 要求固定列有明确宽度
      slots: {
        default: ({ row }) => { // vxe-table 作用域变量是 row
          const { priceIncludingTax, priceExcludingTax } = row
          const disabled = () => {
            if (props.isSecondInquiryEnable === 1 || props.isFinished === 1) return true
            if (!priceIncludingTax || !priceExcludingTax) return true
            if (props.isDetail) return true
            return false
          }
          return (
              <a-checkbox
                  disabled={disabled()}
                  checked={row.isWinner === 1}
                  onChange={(e) => handleWinnerChange(row, e.target.checked)}
              />
          );
        }
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
// 样式部分保持不变
@import '@/assets/styles/_variables.less';
.custom-detail-table {
	margin-top: @spacing-xs;

	// 适配 vxe-table 的表头单元格
	:deep(.vxe-header--column) {
		background-color: #FAFAFA;
		color: @text-color-base;
		font-weight: 500;
		font-size: 13px;
		padding: 10px 8px;
		text-align: left;
    // vxe-table 的padding和ant-table计算方式不同，为了使文本居中，可能需要调整
    .vxe-cell {
      padding-left: 8px;
      padding-right: 8px;
    }
	}

	// 适配 vxe-table 的表体单元格
	:deep(.vxe-body--column) {
		color: @text-color-secondary;
		font-size: 13px;
    // padding 应用在内部的 .vxe-cell 上
		.vxe-cell {
      padding: 10px 8px;
    }
		word-break: break-all;
	}
}
</style>