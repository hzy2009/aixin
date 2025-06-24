<template>
    <!-- 使用 vxe-grid 替代 a-table -->
    <vxe-grid
      class="custom-detail-table"
      :data="props.data"
      :columns="columns"
      border
    >
    </vxe-grid>
</template>

<script setup>
const props = defineProps(['data'])

// 列定义已转换为 vxe-table 格式
const columns = [
    {
      type: 'seq', // 使用 vxe-table 内置的序号类型
      title: '序号',
      width: 80,
    },
     {
      title: '已寻到厂商',
      field: 'refUserName', // dataIndex -> field
    },
]
</script>

<style lang="less" scoped>
// @import '@/assets/styles/_variables.less';

// .custom-detail-table {
// 	margin-top: @spacing-xs;

// 	// 已适配 vxe-table 的表头单元格
// 	:deep(.vxe-header--column) {
// 		background-color: #FAFAFA;
// 		color: @text-color-base;
// 		font-weight: 500;
// 		font-size: 13px;
// 		text-align: left;
//     .vxe-cell {
//       padding: 10px 8px;
//     }
// 	}

// 	// 已适配 vxe-table 的表体单元格
// 	:deep(.vxe-body--column) {
// 		color: @text-color-secondary;
// 		font-size: 13px;
// 		word-break: break-all;
//     .vxe-cell {
//       padding: 10px 8px;
//     }
// 	}
// }
</style>