<template>
    <!-- 使用 vxe-grid 替代 a-table -->
    <vxe-grid
        class="custom-detail-table"
        ref="gridRef"
        :data="dataSource" 
        :columns="columns"
        border
        :row-config="{ keyField: 'id' }"
        :expand-config="{ expandRowKeys: expandedRowKeys, trigger: 'default' }"
        @toggle-row-expand="handleToggleExpand"
    >
        <!-- 
            vxe-table 的展开行内容通过 expand 列的 content 插槽实现 
            插槽名字格式为 "expand_content" + 列的 field (如果定义了) 或者 "expand_content"
            为了简单，我们直接在列配置的 slots.content 中定义 JSX
        -->
    </vxe-grid>

    <!-- 用于测试，展示最终数据 -->
    <!-- <button @click="logFinalData" style="margin-top: 20px;">打印最终数据到控制台</button> -->
</template>

<script setup lang='jsx'>
import { ref } from 'vue'
import firstInquiryList from './firstInquiryList.vue'
import secondInquiryList from './secondInquiryList.vue'
import { selectOptions } from '@/utils/index';
import defHttp from '@/utils/http/axios'
import { message } from 'ant-design-vue'; // 假设您仍在使用 a-message

const emit = defineEmits(['success']);
const expandedRowKeys = ref([]); // 控制展开行的 key 数组，保持不变

const props = defineProps(['data'])

const dataSource = ref(props.data);

// 新增：处理 vxe-table 的行展开/折叠事件，以模拟 v-model:expandedRowKeys
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

// --- 以下所有业务逻辑函数完全保持不变，因为它们只操作数据源 ---

const handleToggleSelection = (parentRecord, { record: itemToToggle, checked }) => {
    const originalItem = parentRecord.firstInquiryList.find(item => item.id === itemToToggle.id);
    if (!originalItem) return;
    
    originalItem.isSelected = checked ? 1 : 0;
    
    if (checked) {
        dataSource.value.forEach(mainRecord => {
            mainRecord.firstInquiryList.forEach(item => item.isWinner = 0);
            if(mainRecord.secondInquiryList) {
                mainRecord.secondInquiryList.forEach(item => item.isWinner = 0);
            }
        });
        const newItemForSecondRound = { ...originalItem };
        delete newItemForSecondRound.id;
        delete newItemForSecondRound.priceIncludingTax;
        delete newItemForSecondRound.priceExcludingTax;
        delete newItemForSecondRound.deliveryDate;
        delete newItemForSecondRound.paymentTermsName;
        delete newItemForSecondRound.guaranteePeriod;
        delete newItemForSecondRound.guaranteeDesc;
        
        newItemForSecondRound.isSelected = 0;
        newItemForSecondRound.isWinner = 0;
        newItemForSecondRound.key = `second-${originalItem.id}`;
        newItemForSecondRound.originKey = originalItem.id;
        if (!parentRecord.secondInquiryList) parentRecord.secondInquiryList = [];
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
                    item.isSelected = 0;
                    item.isWinner = item.id === winningItem.id ? 1 : 0;
                } else {
                    if (item.id === winningItem.id) item.isWinner = 0;
                }
            });
        }
        if (type === 'second' && mainRecord.secondInquiryList) {
            mainRecord.secondInquiryList.forEach(item => {
                if (checked) {
                    if (winningItem.id) {
                        item.isWinner = item.id === winningItem.id ? 1 : 0;
                    } else {
                        item.isWinner = item.key === winningItem.key ? 1 : 0;
                    }
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
            if (mainRecord.secondInquiryList) {
                mainRecord.secondInquiryList = mainRecord.secondInquiryList.filter(item => item.isWinner === 1);
            }
        }
        if (!checked) {
            const isAnyWinnerLeft = mainRecord.firstInquiryList.some(i => i.isWinner === 1) || (mainRecord.secondInquiryList && mainRecord.secondInquiryList.some(i => i.isWinner === 1));
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
    const winnerInFirst = record.firstInquiryList.find(item => item.isWinner === 1);
    const winnerInSecond = record.secondInquiryList ? record.secondInquiryList.find(item => item.isWinner === 1) : null;
    const winner = winnerInFirst || winnerInSecond;
    if (winner) {
        isWinnerSelected = true;
        winnerName = winner.refUserCode;
    }
    const isSecondRoundSelected = record.firstInquiryList.some(item => item.isSelected === 1);
    return { winnerName, isWinnerSelected, isSecondRoundSelected };
};

const handleTradeTypeChange = (value, record, options) => {
    const selectedOption = options.find(opt => opt.value === value);
    if (selectedOption) {
        record.tradeTypeName = selectedOption.label;
    }
};

// vxe-table 的列配置
const columns = [
    { 
      type: 'expand', // 这是 vxe-table 的展开列
      width: 50,
      // 展开行的内容在这里定义
      slots: {
        content: ({ row: parentRecord }) => { // vxe-table 作用域变量是 {row}
           return (
            // 优化：仅在行展开时渲染内部组件
            <div v-show={expandedRowKeys.value.includes(parentRecord.id)}> 
                <firstInquiryList 
                    data={parentRecord.firstInquiryList}
                    isSecondInquiryEnable={parentRecord.isSecondInquiryEnable}
                    isFinished={parentRecord.isFinished}
                    onToggle-selection={payload => handleToggleSelection(parentRecord, payload)}
                    onSelect-winner={payload => handleSelectWinner(payload)}
                />
                <secondInquiryList 
                    data={parentRecord.secondInquiryList}
                    isSecondInquiryEnable={parentRecord.isSecondInquiryEnable}
                    isFinished={parentRecord.isFinished}
                    onSelect-winner={payload => handleSelectWinner(payload)}
                    // v-model:data 语法糖无法直接在JSX中使用，需要手动更新
                    onUpdate:data={newData => parentRecord.secondInquiryList = newData}
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
      field: 'materialCode',
    },
	{
      title: '选定贸易商',
      field: 'winnerName',
      slots: {
        default: ({ row }) => { // 使用 {row} 代替 {record}
            const { winnerName } = getRowState(row);
            return <span>{winnerName || '--'}</span>;
        }
      }
    },
	{
      title: '交易方式',
      field: 'tradeTypeCode',
	  slots: {
        default: ({ row }) => { // 使用 {row} 代替 {record}
            const { isWinnerSelected } = getRowState(row);
            const options = selectOptions('trade_type');
            return (
                row.isFinished === 1 ? <span>{row.tradeTypeName}</span> : 
                <a-select 
                    v-model:value={row.tradeTypeCode} 
                    style={{ width: '100%' }} 
                    placeholder="请选择交易方式"
                    disabled={!isWinnerSelected}
                    options={options} // vxe-table/jsx 中直接用 options prop 更简洁
                    onChange={value => handleTradeTypeChange(value, row, options)}
                />
            );
        }
      }
    },
	{
      title: '操作',
      field: 'action',
      width: 150,
	  slots: {
        default: ({ row }) => { // 使用 {row} 代替 {record}
            const { isWinnerSelected, isSecondRoundSelected } = getRowState(row);
            const isSecondInquiryEnable = row.isSecondInquiryEnable;
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
                row.isFinished === 1 ? <span>已完成</span> : 
                <a-button 
                    type="link" 
                    disabled={actionType === 'none'} 
                    onClick={() => save(row, actionType)}
                >
                    {buttonText}
                </a-button>
            );
        }
      }
    },
];

const save = async (record, actionType) => {
    console.log('record', record);
    // if (actionType === 'confirm_winner') {
    //     if (!record.tradeTypeCode) {
    //         message.error('请选择交易方式');
    //         return;
    //     }
    //     record.isFinished = 1
    // } else {
    //     record.isSecondInquiryEnable = 1
    // }
    // const res = await defHttp.post({ url: '/apm/apmSourcingOriginSubstitute/apmSourcingMaterial/edit', data: record });
    // if (res.success) {
    //     message.success(res.message);
    //     emit('success');
    // } else {
    //     message.error(res.message);
    // }
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
        padding: 12px; // 给展开行内容一些内边距
    }
}
</style>