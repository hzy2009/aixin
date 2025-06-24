<template>
    <!-- 使用 vxe-grid 替代 a-table -->
    <vxe-grid
        :data="dataSource" 
        :columns="columns"
        border
        :row-config="{ keyField: 'id' }"
        :expand-config="{ expandRowKeys: expandedRowKeys, trigger: 'default' }"
        @toggle-row-expand="handleToggleExpand"
    >
    </vxe-grid>
</template>

<script setup lang='jsx'>
import { ref } from 'vue'
import firstInquiryList from './firstInquiryList.vue'
import secondInquiryList from './secondInquiryList.vue'
import { selectOptions } from '@/utils/index';
import defHttp from '@/utils/http/axios'
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

const expandedRowKeys = ref([]);
const props = defineProps(['data'])

const emit = defineEmits(['success']);
const dataSource = ref(props.data);

// 新增：处理 vxe-table 的行展开/折叠事件
const handleToggleExpand = ({ row, expanded }) => {
    const key = row.id;
    if (expanded) {
        if (!expandedRowKeys.value.includes(key)) {
            expandedRowKeys.value.push(key);
        }
    } else {
        const index = expandedRowKeys.value.indexOf(key);
        if (index > -1) {
            expandedRowKeys.value.splice(index, 1);
        }
    }
};

// vxe-table 的列配置
const columns = [
    { 
      type: 'expand', // vxe-table 的展开列
      width: 50,
      slots: {
        content: ({ row: parentRecord }) => { // 使用 {row} 并重命名为 parentRecord
           return (
            // 使用 v-show 可以在折叠时保留子组件状态
            <div v-show={expandedRowKeys.value.includes(parentRecord.id)}>
                <firstInquiryList 
                    data={parentRecord.firstInquiryList}
                    isSecondInquiryEnable={parentRecord.isSecondInquiryEnable}
                />
                <secondInquiryList 
                    data={parentRecord.secondInquiryList}
                    isFinished={parentRecord.isFinished}
                    style="margin-bottom: 16px;"
                    v-show={parentRecord.secondInquiryList && parentRecord.secondInquiryList.length > 0}
                />
            </div>
           )
        }
      }
    },
    {
      type: 'seq', // 使用内置序号
      title: '序号',
      width: 60,
    },
    {
      title: '爱芯享单据号',
      field: 'materialCode', // field -> field
      width: 120,
    },
	{
      title: '操作',
      field: 'action', // field -> field
      width: 150,
	  slots: {
        default: ({ row }) => { // customRender -> slots.default, {record} -> {row}
            const {isSecondInquiryEnable, firstInquiryList, secondInquiryList} = row
            let expireDate = ''
            if (isSecondInquiryEnable == 1) {
                expireDate = secondInquiryList && secondInquiryList[0].expireDate
            } else {
                expireDate = firstInquiryList && firstInquiryList[0].expireDate
            }
            const disabled = dayjs().isAfter(expireDate, 'day')

            return (
                row.isFinished === 1 || disabled ? <span></span> :
                <a-button 
                    type="link" 
                    onClick={() => save(row)}
                >
                    报价
                </a-button>
            );
        }
      }
    },
];

// save 函数保持不变，因为它操作的是数据 (row)，与UI组件无关
const save = async (record) => {
    const code = record.isSecondInquiryEnable == 1 ? 'secondInquiryList' : 'firstInquiryList';
    const res = await defHttp.post({ url: '/apm/apmSourcingMaterialInquiry/edit', data: record[code][0] });
    if (res.success) {
        message.success(res.message);
        emit('success');
    } else {
        message.error(res.message);
    }
}

const logFinalData = () => {
    console.log("最终数据:", JSON.stringify(dataSource.value, null, 2));
    alert("最终数据已打印到浏览器控制台。");
};
</script>

<style lang="less" scoped>
// 样式已适配 vxe-table
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
	:deep(.vxe-body--column), :deep(.vxe-body--expanded-cell) {
		color: @text-color-secondary;
		font-size: 13px;
        .vxe-cell {
            padding: 10px 8px;
        }
		word-break: break-all;
	}
    :deep(.vxe-body--expanded-cell) {
        padding: 12px;
    }
}
</style>