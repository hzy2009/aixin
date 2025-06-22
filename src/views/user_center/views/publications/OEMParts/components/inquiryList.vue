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
                    :isFinished="parentRecord.isFinished"
                    @toggle-selection="payload => handleToggleSelection(parentRecord, payload)"
                    @select-winner="payload => handleSelectWinner(payload)"
                />
                <secondInquiryList 
                    :data="parentRecord.secondInquiryList"
                    :isSecondInquiryEnable="parentRecord.isSecondInquiryEnable"
                    :isFinished="parentRecord.isFinished"
                    @select-winner="payload => handleSelectWinner(payload)"
                    v-model:data="parentRecord.secondInquiryList"
                    style="margin-bottom: 16px;"
                    v-show='parentRecord.secondInquiryList && parentRecord.secondInquiryList.length > 0'
                />
            </div>
        </template>
    </a-table>

    <!-- 用于测试，展示最终数据 -->
    <!-- <a-button @click="logFinalData" style="margin-top: 20px;">打印最终数据到控制台</a-button> -->
</template>

<script setup lang='jsx'>
import { ref } from 'vue'
import firstInquiryList from './firstInquiryList.vue'
import secondInquiryList from './secondInquiryList.vue'
import { selectOptions } from '@/utils/index';
import defHttp from '@/utils/http/axios'
import { message } from 'ant-design-vue';

const emit = defineEmits(['success']);
const expandedRowKeys = ref([]);

const props = defineProps(['data'])

const dataSource = ref(props.data);

const handleToggleSelection = (parentRecord, { record: itemToToggle, checked }) => {
    const originalItem = parentRecord.firstInquiryList.find(item => item.id === itemToToggle.id);
    if (!originalItem) return;
    
    // Convert boolean from event to 1 or 0
    originalItem.isSelected = checked ? 1 : 0;
    
    if (checked) {
        dataSource.value.forEach(mainRecord => {
            // Set to 0
            mainRecord.firstInquiryList.forEach(item => item.isWinner = 0);
            mainRecord.secondInquiryList.forEach(item => item.isWinner = 0);
        });
        const newItemForSecondRound = { ...originalItem };
        delete newItemForSecondRound.id;
        delete newItemForSecondRound.priceIncludingTax;
        delete newItemForSecondRound.priceExcludingTax;
        
        // Set to 0
        newItemForSecondRound.isSelected = 0;
        newItemForSecondRound.isWinner = 0;
        newItemForSecondRound.key = `second-${originalItem.id}`;
        newItemForSecondRound.originKey = originalItem.id;
        parentRecord.secondInquiryList.push(newItemForSecondRound);
        parentRecord.tradeTypeCode = null;
		parentRecord.tradeTypeName = null;
    } else {
        parentRecord.secondInquiryList = parentRecord.secondInquiryList.filter(
            item => item.originKey !== originalItem.id
        );
    }
};

const handleSelectWinner = ({ record: winningItem, checked, type }) => {
    dataSource.value.forEach(mainRecord => {
        if (type === 'first') {
            mainRecord.firstInquiryList.forEach(item => {
                if (checked) {
                    // Set to 0
                    item.isSelected = 0;
                    // Use ternary to set 1 or 0
                    item.isWinner = item.id === winningItem.id ? 1 : 0;
                } else {
                    if (item.id === winningItem.id) item.isWinner = 0;
                }
            });
        }
        if (type === 'second') {
            mainRecord.secondInquiryList.forEach(item => {
                if (checked) {
                    if (winningItem.id) {
                        item.isWinner = item.id === winningItem.id ? 1 : 0;
                    } else {
                        item.isWinner = item.key === winningItem.key ? 1 : 0;
                    }
                    // Use ternary to set 1 or 0
                } else {
                    if (winningItem.id) {
                        if (item.id === winningItem.id) item.isWinner = 0;
                    } else {
                        if (item.key === winningItem.key) item.isWinner = 0;
                    }
                }
            });
        }
        if (checked && type === 'first') {
            mainRecord.secondInquiryList = mainRecord.secondInquiryList.filter(item => item.isWinner === 1);
        }
        if (!checked) {
            // Check for 1
            const isAnyWinnerLeft = mainRecord.firstInquiryList.some(i => i.isWinner === 1) || mainRecord.secondInquiryList.some(i => i.isWinner === 1);
            if (!isAnyWinnerLeft) {
                mainRecord.tradeTypeCode = undefined;
                mainRecord.tradeTypeName = '';
            }
        }
    });
};

const getRowState = (record) => {
    let winnerName = null;
    let isWinnerSelected = false;
    // Check for 1
    const winnerInFirst = record.firstInquiryList.find(item => item.isWinner === 1);
    const winnerInSecond = record.secondInquiryList.find(item => item.isWinner === 1);
    const winner = winnerInFirst || winnerInSecond;
    if (winner) {
        isWinnerSelected = true;
        winnerName = winner.refUserCode;
    }
    // Check for 1
    const isSecondRoundSelected = record.firstInquiryList.some(item => item.isSelected === 1);
    return { winnerName, isWinnerSelected, isSecondRoundSelected };
};

const handleTradeTypeChange = (value, record, options) => {
    const selectedOption = options.find(opt => opt.value === value);
    if (selectedOption) {
        record.tradeTypeName = selectedOption.label;
    }
};

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
      title: '选定贸易商',
      dataIndex: 'winnerName',
      width: 120,
      customRender: ({ record }) => {
        const { winnerName } = getRowState(record);
        return <span>{winnerName || '--'}</span>;
      }
    },
	{
      title: '交易方式',
      dataIndex: 'tradeTypeCode',
      width: 150,
	  customRender: ({ record }) => {
        const { isWinnerSelected } = getRowState(record);
		const options = selectOptions('trade_type');
        return (
            record.isFinished === 1 ? <span>{record.tradeTypeName}</span> : 
			<a-select 
                v-model:value={record.tradeTypeCode} 
                style={{ width: '100%' }} 
                placeholder="请选择交易方式"
                disabled={!isWinnerSelected}
                onChange={value => handleTradeTypeChange(value, record, options)}
            >
				{options.map(item => <a-select-option value={item.value}>{item.label}</a-select-option>)}
			</a-select>
        );
	  },
    },
	{
      title: '操作',
      dataIndex: 'action',
      width: 150,
	  customRender: ({ record }) => {
        const { isWinnerSelected, isSecondRoundSelected } = getRowState(record);
        const isSecondInquiryEnable = record.isSecondInquiryEnable;
        let buttonText = '请先选择';
        let actionType = 'none';
        if (isWinnerSelected) {
            buttonText = '选定贸易商';
            actionType = 'confirm_winner';
        } else if (isSecondRoundSelected && isSecondInquiryEnable !== 1) {
            buttonText = '进入第二轮报价';
            actionType = 'start_second_round';
        }
        return (
            record.isFinished === 1 ? <span>已完成</span> : 
			<a-button 
                type="link" 
                disabled={actionType === 'none'} 
                onClick={() => save(record, actionType)}
            >
				{buttonText}
			</a-button>
        );
	  },
    },
];

const save = async (record, actionType) => {
    if (actionType === 'confirm_winner') {
        // const { winnerName } = getRowState(record);
       
        if (!record.tradeTypeCode) {
            message.error('请选择交易方式');
            return;
        }
        record.isFinished = 1
    } else {
        record.isSecondInquiryEnable = 1
    }
    // start_second_round
    const res = await defHttp.post({ url: '/apm/apmSourcingOriginSubstitute/apmSourcingMaterial/edit', data: record });
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