<template>
    <a-table class="custom-detail-table" :dataSource="props.data" :columns="columns" :pagination="false" bordered >
        <template #bodyCell="{ column, record, index }"><span v-if="column.dataIndex === 'index'">{{ index + 1 }}</span></template>

    </a-table>
</template>

<script setup>
const props = defineProps(['data'])
const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
    },
    {
      title: '单据类型',
      dataIndex: 'refBusinessTypeName',
    },
    {
      title: '单据编号',
      dataIndex: 'refBusinessCode',
    },
]
</script>
<style lang="less" scoped>
@import '@/assets/styles/_variables.less'; // Your global LESS variables
.custom-detail-table {
	margin-top: @spacing-xs;

	:deep(.ant-table-thead > tr > th) {
		background-color: #FAFAFA;
		color: @text-color-base;
		font-weight: 500;
		font-size: 13px;
		padding: 10px 8px;
		text-align: left; // Ensure headers align left by default
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