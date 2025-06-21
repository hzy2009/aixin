<template>
    <a-table 
        :data-source="dataSource" 
        :columns="columns" 
        :pagination="false" 
        bordered 
        rowKey="key"
        v-model:expandedRowKeys="expandedRowKeys"
    >
        <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'index'">{{ record.index }}</span>
        </template>
        <template #expandedRowRender="{ record: parentRecord }">
            <!-- 监听子组件的事件 -->
            <div v-if="expandedRowKeys.includes(parentRecord.key)">
                <firstInquiryList 
                    :data="parentRecord.firstInquiryList"
                />
                <secondInquiryList 
                    :data="parentRecord.secondInquiryList"
                    style="margin-bottom: 16px;"
                    v-show='parentRecord.secondInquiryList && parentRecord.secondInquiryList.length > 0'
                />
            </div>
        </template>
    </a-table>

    <!-- 用于测试，展示最终数据 -->
    <a-button @click="logFinalData" style="margin-top: 20px;">打印最终数据到控制台</a-button>
</template>

<script setup lang='jsx'>
import { ref } from 'vue'
import firstInquiryList from './firstInquiryList.vue'
import secondInquiryList from './secondInquiryList.vue'
import { selectOptions } from '@/utils/index';
import defHttp from '@/utils/http/axios'

const expandedRowKeys = ref([]);

const initialData = [
	{
        key: 1, 
        materialCode: 'AXS-001',
        index: 1,
        tradeTypeCode: undefined,
        tradeTypeName: '',
		firstInquiryList: [
			{key: '1-1', refUserName: '贸易商A', isSelected: false, isWinne: false, id: 101},
			{key: '1-2', refUserName: '贸易商B', isSelected: false, isWinne: false, id: 102},
		],
		secondInquiryList: [],
	},
	{
        key: 2,
        materialCode: 'AXS-002',
        index: 2,
        tradeTypeCode: undefined,
        tradeTypeName: '',
		firstInquiryList: [
			{key: '2-1', refUserName: '贸易商C', isSelected: false, isWinne: false, id: 103},
			{key: '2-2', refUserName: '贸易商D', isSelected: false, isWinne: false, id: 104},
		],
		secondInquiryList: [],
	},
];

const dataSource = ref(JSON.parse(JSON.stringify(initialData)));

const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 60,
      customRender: ({ index }) => index + 1
    },
    {
      title: '爱芯享单据号',
      dataIndex: 'materialCode',
      width: 120,
    },
	{
      title: '操作',
      dataIndex: 'action',
      width: 150,
	  customRender: ({ record }) => {
        return (
			<a-button 
                type="link" 
                onClick={() => save(record)}
            >
				报价
			</a-button>
        );
	  },
    },
];

const save = (record) => {
    console.log('提交【选定贸易商】数据:', payload);
}

const logFinalData = () => {
    console.log("最终数据:", JSON.stringify(dataSource.value, null, 2));
    alert("最终数据已打印到浏览器控制台。");
};
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