<template>
    <div>
        <listPage :pageData="pageData" />
    </div>
</template>

<script setup lang="jsx">// jsx for custom pagination render if kept
import { ref, reactive } from 'vue'; // onMounted removed as hook handles it
import { useRouter } from 'vue-router';
import listPage from '@/components/template/listPage.vue';
import { FileTextOutlined } from '@ant-design/icons-vue';
const router = useRouter();

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
    { id: 'rdCode', label: '攻关方向', maxVisibleWithoutMore: 7, dictKey: 'rd_type' },
    { id: 'statusCode', label: '研发状态', maxVisibleWithoutMore: 7, dictKey: 'rd_breakthrough_status' }
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
    { title: '单号', dataIndex: 'code', key: 'code', ellipsis: true, },
    { title: '攻关方向名称', dataIndex: 'rdType', key: 'rdType', align: 'center',
        // customRender: ({record}) => {
        // const { reqPartsTotal, reqPartsFinish } = record;
        // // 计算未完成数量
        // return <span>{reqPartsUnfinish || '-'}</span>;
        // }
    }, 
    { title: '研发需求', dataIndex: 'sourceDesc', key: 'sourceDesc', align: 'center' }, // Corrected key
    { title: '需求状态', dataIndex: 'statusName', key: 'statusName', align: 'center' }, // Key matches display field
    { title: '创建日期', dataIndex: 'createTime', key: 'createTime', align: 'center' },
    { title: '期望匹配周期', dataIndex: 'matchPeriodName', key: 'matchPeriodName', align: 'center' },
    { title: '操作', key: 'actions', width: '10%', align: 'center', fixed: 'right' },
]);

const addButton = reactive({
    text: '创建研发攻关',
    clickFn: createNewSourcing
})

const actions = reactive([
    {
        text: '详情',
        icon: FileTextOutlined,
        clickFn: viewDetails,
        // isVisible: (record) => record.statusCode !== '已完成' // Example condition
    }
]);

const pageData = ref({
    url: {
        list: 'apm/apmRdBreakthrough/list/owner',
        overview: 'apm/apmRdBreakthrough/overview'
    },
    filterConfigForPage,
    tableColumns,
    addButton,
    actions,
    statusDictKey: 'sourcing_status',
    userStatCardVisible: true,
    tableOperations: [
        {
        title: '创建需求',
        clickFn: createNewSourcing,
        type: 'primary'
        }
    ]
})


function viewDetails({ id }) {
    router.push(`/user/published/PublicRelations/detail/${id}`);
};
function createNewSourcing() {
    router.push(`/user/published/PublicRelations/create`);
};
</script>