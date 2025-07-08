<template>
    <!-- 使用 vxe-grid 替代 a-table -->
    <vxe-grid
        class="custom-detail-table"
        ref="gridRef"
        :data="dataSource"
        :columns="columns"
        border
        resizable
        :row-config="{ keyField: 'id' }"
        :expand-config="{ expandRowKeys: expandedRowKeys, trigger: 'default' }"
        @toggle-row-expand="handleToggleExpand"
    >
        <!--
            vxe-table 的展开行内容通过 expand 列的 content 插槽实现
            为了简单，我们直接在列配置的 slots.content 中定义 JSX
        -->
    </vxe-grid>

    <!-- 用于测试，展示最终数据 -->
    <!-- <button @click="logFinalData" style="margin-top: 20px;">打印最终数据到控制台</button> -->
</template>

<script setup lang='jsx'>
import { ref } from 'vue';
import firstInquiryList from './firstInquiryList.vue';
import secondInquiryList from './secondInquiryList.vue';
import { selectOptions } from '@/utils/index';
import defHttp from '@/utils/http/axios';
import { message } from 'ant-design-vue';

const emit = defineEmits(['success']);
const expandedRowKeys = ref([]); // 控制展开行的 key 数组

const props = defineProps(['data', 'isDetail']);

const dataSource = ref(props.data);

// 【新增】创建两个 ref 对象，用于按行ID存储子组件的实例
const firstInquiryListRefs = ref({});
const secondInquiryListRefs = ref({});
// 处理 vxe-table 的行展开/折叠事件
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
        // delete newItemForSecondRound.priceIncludingTax;
        // delete newItemForSecondRound.priceExcludingTax;
        // delete newItemForSecondRound.deliveryDate;
        // delete newItemForSecondRound.paymentTermsName;
        // delete newItemForSecondRound.guaranteePeriod;
        // delete newItemForSecondRound.guaranteeDesc;

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
                if (checked) item.isSelected = 0
                if (item.id === winningItem.id) item.isWinner = checked ? 1 : 0;
            });
        }
        if (type === 'second' && mainRecord.secondInquiryList) {
            mainRecord.secondInquiryList.forEach(item => {
                if (item?.id === winningItem?.id) item.isWinner = checked ? 1 : 0;
                if (item?.key === winningItem?.key) item.isWinner = checked ? 1 : 0;
            });
        }
        // if (checked && type === 'first') {
        //     if (mainRecord.secondInquiryList) {
        //         mainRecord.secondInquiryList = mainRecord.secondInquiryList.filter(item => item.isWinner === 1);
        //     }
        // }
        // if (!checked) {
        //     const isAnyWinnerLeft = mainRecord.firstInquiryList.some(i => i.isWinner === 1) || (mainRecord.secondInquiryList && mainRecord.secondInquiryList.some(i => i.isWinner === 1));
        //     if (!isAnyWinnerLeft) {
        //         mainRecord.tradeTypeCode = undefined;
        //         mainRecord.tradeTypeName = '';
        //     }
        // }
    });
};

const getRowState = (record) => {
    let winnerName = null;
    let isWinnerSelected = false;
    let winner = null;
    if (record.isSecondInquiryEnable === 1) {
        winner = record.secondInquiryList ? record.secondInquiryList.filter(item => item.isWinner == 1) : null;
    } else {
        winner = record.firstInquiryList.filter(item => item.isWinner  == 1);
    }
    // const winnerInFirst = record.firstInquiryList.filter(item => item.isWinner  == 1);
    // const winnerInSecond = record.secondInquiryList ? record.secondInquiryList.filter(item => item.isWinner == 1) : null;
    // winner = winnerInFirst && winnerInFirst.length > 0 ? winnerInFirst : winnerInSecond;
    if (winner) {
        isWinnerSelected = true;
        winnerName = winner.map(item => item.refUserCode).join(',');
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
      type: 'expand',
      width: 120,
      title: '点击查看详情',
      slots: {
        // 【关键修改】在渲染子组件时，通过 ref 函数将其存入我们的 ref 容器中
        content: ({ row: parentRecord }) => {
           return (
            <div v-show={expandedRowKeys.value.includes(parentRecord.id)}>
                <firstInquiryList
                    data={parentRecord.firstInquiryList}
                    isSecondInquiryEnable={parentRecord.isSecondInquiryEnable}
                    isFinished={parentRecord.isFinished}
                    isDetail={props.isDetail}
                    onToggle-selection={payload => handleToggleSelection(parentRecord, payload)}
                    onSelect-winner={payload => handleSelectWinner(payload)}
                    // 关键改动：绑定 ref，将组件实例存入 ref 对象，以行 id 为 key
                    ref={el => { if (el) firstInquiryListRefs.value[parentRecord.id] = el; }}
                />
                <secondInquiryList
                    data={parentRecord.secondInquiryList}
                    isSecondInquiryEnable={parentRecord.isSecondInquiryEnable}
                    isFinished={parentRecord.isFinished}
                    isDetail={props.isDetail}
                    sucessSecond={parentRecord.sucessSecond}
                    onSelect-winner={payload => handleSelectWinner(payload)}
                    onUpdate:data={newData => parentRecord.secondInquiryList = newData}
                    // 关键改动：绑定 ref
                    ref={el => { if (el) secondInquiryListRefs.value[parentRecord.id] = el; }}
                />
            </div>
           )
        }
      }
    },
    {
      type: 'seq',
      title: '序号',
      width: 60,
      align: 'center',
    },
    {
      title: '内部管理单号',
      field: 'materialCode',
      width: 150,
    },
	{
      title: '选定贸易商',
      field: 'winnerName',
      slots: {
        default: ({ row }) => {
            const { winnerName } = getRowState(row);
            return <span>{winnerName || ''}</span>;
        }
      }
    },
	{
      title: '交易方式',
      field: 'tradeTypeCode',
	  slots: {
        default: ({ row }) => {
            const { isWinnerSelected } = getRowState(row);
            const options = selectOptions('trade_type');
            return (
                row.isFinished === 1 || props.isDetail ? <span>{row.tradeTypeName}</span> :
                <a-select
                    v-model:value={row.tradeTypeCode}
                    style={{ width: '100%' }}
                    placeholder="请选择交易方式"
                    disabled={!isWinnerSelected}
                    options={options}
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
        default: ({ row }) => {
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
            if (props.isDetail) return <span>''</span>;
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

// 【重大修改】重写 save 函数，以获取子组件的最新数据
const save = async (record, actionType) => {
    // 1. 创建一个即将发送到后端的数据副本，避免直接修改 props 或 UI 状态
    const finalRecordData = JSON.parse(JSON.stringify(record));

    // 2. 从 ref 容器中查找对应行的子组件实例
    const firstListInstance = firstInquiryListRefs.value[record.id];
    const secondListInstance = secondInquiryListRefs.value[record.id];

    // 3. 调用子组件的 getData() 方法获取最新数据，并更新到副本中
    // 如果 getData() 是异步方法，这里需要使用 await
    if (firstListInstance && typeof firstListInstance.getData === 'function') {
        finalRecordData.firstInquiryList = firstListInstance.getData();
    }
    // 第二轮询价列表可能不存在，所以需要检查实例是否存在
    if (secondListInstance && typeof secondListInstance.getData === 'function') {
        finalRecordData.secondInquiryList = secondListInstance.getData();
    }

    console.log('即将保存的最终完整数据:', finalRecordData);

    // 4. 使用更新后的 finalRecordData 执行后续的业务逻辑
    if (actionType === 'confirm_winner') {
        if (!finalRecordData.tradeTypeCode) {
            message.error('请选择交易方式');
            return;
        }
        finalRecordData.isFinished = 1;
    } else { // 'start_second_round'
        if (finalRecordData.secondInquiryList.length === 0) {
           return message.error('请请勾选贸易商');
        }
        finalRecordData.isSecondInquiryEnable = 1;
    }

    // 5. 使用包含最新子表数据的 finalRecordData 进行 API 调用
    try {
        const res = await defHttp.post({ url: '/apm/apmSourcingOriginSubstitute/apmSourcingMaterial/edit', data: finalRecordData });
        if (res.success) {
            if (actionType === 'start_second_round') {
                record.isSecondInquiryEnable = 1
                record.sucessSecond = true
            } else {
                record.isFinished = 1
            }
            message.success(res.message || '操作成功');
            emit('success');
        } else {
            message.error(res.message || '操作失败');
        }
    } catch (error) {
        console.error("保存失败:", error);
        message.error("请求出错，请稍后重试");
    }
};

// 用于调试的函数
const logFinalData = () => {
    console.log("最终数据源:", JSON.parse(JSON.stringify(dataSource.value)));
    alert("最终数据已打印到浏览器控制台。");
};
</script>

<style lang="less" scoped>
@import '@/assets/styles/_variables.less'; // 假设您的项目中有这个文件

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
        background-color: #fff; // 展开行背景色
    }
}
</style>