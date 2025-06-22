<template>
    <a-table 
        :data-source="dataSource" 
        :columns="columns" 
        :pagination="false" 
        bordered 
        rowKey="id"
        v-model:expandedRowKeys="expandedRowKeys"
    >
        <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'index'">{{ record.index }}</span>
        </template>
        <template #expandedRowRender="{ record: parentRecord }">
            <!-- 监听子组件的事件 -->
            <div v-if="expandedRowKeys.includes(parentRecord.id)">
                <firstInquiryList 
                    :data="parentRecord.firstInquiryList"
                    :isSecondInquiryEnable="parentRecord.isSecondInquiryEnable"
                />
                <secondInquiryList 
                    :data="parentRecord.secondInquiryList"
                    :isFinished="parentRecord.isFinished"
                    style="margin-bottom: 16px;"
                    v-show='parentRecord.secondInquiryList && parentRecord.secondInquiryList.length > 0'
                />
            </div>
        </template>
    </a-table>
</template>

<script setup lang='jsx'>
import { ref } from 'vue'
import firstInquiryList from './firstInquiryList.vue'
import secondInquiryList from './secondInquiryList.vue'
import { selectOptions } from '@/utils/index';
import defHttp from '@/utils/http/axios'

const expandedRowKeys = ref([]);
const props = defineProps(['data'])

const emit = defineEmits(['success']);
const dataSource = ref(props.data);

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
            record.isFinished === 1 ? <span>已完成</span> :
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

const save = async (record) => {
    const code = record.isSecondInquiryEnable == 1 ? 'secondInquiryList' : 'firstInquiryList';
    const res = await defHttp.post({ url: '/apm/apmSourcingMaterialInquiry/edit', data: record[code][0] });
    if (res.success) {
        alert('操作成功');
        emit('success');
    }
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