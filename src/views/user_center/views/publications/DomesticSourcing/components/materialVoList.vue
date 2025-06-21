<template>
    <a-table :dataSource="props.data" :columns="columns" :pagination="false" bordered class="custom-detail-table">
        <template #bodyCell="{ column, record, index }"><span v-if="column.dataIndex === 'index'">{{ index + 1 }}</span></template>
        <template #expandedRowRender="{ record }">
            <userRefList :data="record.tenantRefList" style="margin-bottom: 16px;"></userRefList>
            <businessRefList :data="record.businessRefList"  style="margin-bottom: 16px;"></businessRefList>
        </template>
    </a-table>
</template>

<script setup>
import userRefList from '@/views/user_center/views/components/userRefList.vue'
import businessRefList from '@/views/user_center/views/components/businessRefList.vue'
const props = defineProps(['data'])
const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
    },
    {
      title: '爱芯享单据号',
      dataIndex: 'materialCode',
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