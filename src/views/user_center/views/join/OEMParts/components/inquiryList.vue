<template>
    <!-- 使用 vxe-grid 替代 a-table -->
    <vxe-grid
        class="custom-detail-table"
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
import { ref } from 'vue';
import firstInquiryList from './firstInquiryList.vue';
import secondInquiryList from './secondInquiryList.vue';
import { selectOptions } from '@/utils/index';
import defHttp from '@/utils/http/axios';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

const expandedRowKeys = ref([]);
const props = defineProps(['data']);
const emit = defineEmits(['success']);

const dataSource = ref(props.data);

// 【新增】创建 ref 对象，用于按行ID存储子组件的实例
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

// vxe-table 的列配置
const columns = [
    {
      type: 'expand',
      width: 50,
      slots: {
        // 【关键修改】在渲染子组件时，绑定 ref
        content: ({ row: parentRecord }) => {
           return (
            <div v-show={expandedRowKeys.value.includes(parentRecord.id)}>
                <firstInquiryList
                    data={parentRecord.firstInquiryList}
                    isSecondInquiryEnable={parentRecord.isSecondInquiryEnable}
                    // 将组件实例存入 ref 对象，以行 id 为 key
                    ref={el => { if (el) firstInquiryListRefs.value[parentRecord.id] = el; }}
                />
                <secondInquiryList
                    data={parentRecord.secondInquiryList}
                    isFinished={parentRecord.isFinished}
                    style="margin-bottom: 16px;"
                    // 将组件实例存入 ref 对象，以行 id 为 key
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
    },
    {
      title: '内部管理单号',
      field: 'materialCode',
    },
	{
      title: '操作',
      field: 'action',
	  slots: {
        default: ({ row }) => {
            const {isSecondInquiryEnable, firstInquiryList, secondInquiryList} = row
            let expireDate = ''
            if (isSecondInquiryEnable == 1) {
                expireDate = secondInquiryList && secondInquiryList[0]?.expireDate
            } else {
                expireDate = firstInquiryList && firstInquiryList[0]?.expireDate
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

// 【重大修改】重写 save 函数，以从子组件获取最新数据
const save = async (record) => {
    // 1. 判断当前是哪一轮报价，并确定要使用的 Refs 容器
    const isSecondRound = record.isSecondInquiryEnable == 1;
    const activeRefs = isSecondRound ? secondInquiryListRefs.value : firstInquiryListRefs.value;
    const activeListName = isSecondRound ? '第二轮报价' : '第一轮报价';

    // 2. 根据行 ID 从 Refs 容器中获取对应的子组件实例
    const childInstance = activeRefs[record.id];

    // 3. 检查实例和 getData 方法是否存在
    if (!childInstance || typeof childInstance.getData !== 'function') {
        message.error(`无法获取【${activeListName}】的最新数据，请确保该行已展开。`);
        console.error(`Component instance for row ${record.id} not found or it does not have a getData method.`);
        return;
    }

    // 4. 调用子组件的 getData() 方法获取最新数据
    // 假设 getData() 返回一个数组，并且我们只需要第一个元素
    const freshDataList = childInstance.getData();
    if (!freshDataList || freshDataList.length === 0) {
        message.error('报价数据为空，无法保存。');
        return;
    }
    const dataToSave = freshDataList[0];

    console.log("即将保存的最新数据:", dataToSave);

    // 5. 使用获取到的最新数据进行 API 调用
    try {
        const res = await defHttp.post({ url: '/apm/apmSourcingMaterialInquiry/edit', data: dataToSave });
        if (res.success) {
            message.success(res.message || '报价成功');
            emit('success');
        } else {
            message.error(res.message || '报价失败');
        }
    } catch(error) {
        console.error("保存报价失败:", error);
        message.error("请求出错，请稍后重试。");
    }
};

const logFinalData = () => {
    console.log("最终数据:", JSON.stringify(dataSource.value, null, 2));
    alert("最终数据已打印到浏览器控制台。");
};
</script>

<style lang="less" scoped>
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
        background-color: #fff;
    }
}
</style>