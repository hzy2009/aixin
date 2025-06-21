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
                    @toggle-selection="payload => handleToggleSelection(parentRecord, payload)"
                    @select-winner="payload => handleSelectWinner(payload)"
                />
                <secondInquiryList 
                    :data="parentRecord.secondInquiryList"
                    @select-winner="payload => handleSelectWinner(payload)"
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

const emit = defineEmits(['success']);
const expandedRowKeys = ref([]);

const props = defineProps(['data'])

const dataSource = ref(props.data);

const handleToggleSelection = (parentRecord, { record: itemToToggle, checked }) => {
    const originalItem = parentRecord.firstInquiryList.find(item => item.key === itemToToggle.key);
    if (!originalItem) return;
    originalItem.isSelected = checked;
    if (checked) {
        dataSource.value.forEach(mainRecord => {
            mainRecord.firstInquiryList.forEach(item => item.isWinne = false);
            mainRecord.secondInquiryList.forEach(item => item.isWinne = false);
        });
        const newItemForSecondRound = { ...originalItem };
        delete newItemForSecondRound.id;
        newItemForSecondRound.isSelected = false;
        newItemForSecondRound.isWinne = false;
        newItemForSecondRound.key = `second-${originalItem.key}`;
        newItemForSecondRound.originKey = originalItem.key;
        parentRecord.secondInquiryList.push(newItemForSecondRound);
		parentRecord.tradeTypeCode = null;
		parentRecord.tradeTypeName = null;
    } else {
        parentRecord.secondInquiryList = parentRecord.secondInquiryList.filter(
            item => item.originKey !== originalItem.key
        );
    }
};
const handleSelectWinner = ({ record: winningItem, checked }) => {
    dataSource.value.forEach(mainRecord => {
        mainRecord.firstInquiryList.forEach(item => {
            if (checked) {
                item.isSelected = false;
                item.isWinne = item.key === winningItem.key;
            } else {
                 if (item.key === winningItem.key) item.isWinne = false;
            }
        });
        mainRecord.secondInquiryList.forEach(item => {
            if (checked) {
                item.isWinne = item.key === winningItem.key;
            } else {
                 if (item.key === winningItem.key) item.isWinne = false;
            }
        });
        if (checked) {
            mainRecord.secondInquiryList = mainRecord.secondInquiryList.filter(item => item.key === winningItem.key);
        }
        if (!checked) {
            const isAnyWinnerLeft = mainRecord.firstInquiryList.some(i => i.isWinne) || mainRecord.secondInquiryList.some(i => i.isWinne);
            if (!isAnyWinnerLeft) {
                mainRecord.tradeTypeCode = undefined;
                mainRecord.tradeTypeName = '';
            }
        }
    });
};

/**
 * 辅助函数：获取当前行的状态
 * @param {object} record - 当前主表行的数据
 * @returns {object} - 包含状态信息的对象
 */
const getRowState = (record) => {
    let winnerName = null;
    let isWinnerSelected = false;
    const winnerInFirst = record.firstInquiryList.find(item => item.isWinne);
    const winnerInSecond = record.secondInquiryList.find(item => item.isWinne);
    const winner = winnerInFirst || winnerInSecond;
    if (winner) {
        isWinnerSelected = true;
        winnerName = winner.refUserName;
    }
    const isSecondRoundSelected = record.firstInquiryList.some(item => item.isSelected);
    return { winnerName, isWinnerSelected, isSecondRoundSelected };
};

/**
 * 处理交易方式选择的变化
 * @param {string} value - 选中的值
 * @param {object} record - 当前主表行的数据
 * @param {Array} options - 选项列表
 */
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
        let buttonText = '请先选择';
        let actionType = 'none';
        if (isWinnerSelected) {
            buttonText = '选定贸易商';
            actionType = 'confirm_winner';
        } else if (isSecondRoundSelected) {
            buttonText = '进入第二轮报价';
            actionType = 'start_second_round';
        }
        return (
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
            alert('请选择交易方式！');
            return;
        }
    }
    // start_second_round
    const res = await defHttp.post({ url: '/apm/apmSourcingOriginSubstitute/apmSourcingMaterial/edit', data: record });
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