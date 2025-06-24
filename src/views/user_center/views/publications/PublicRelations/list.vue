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
    { id: 'rdCode', label: '研发攻关类型', maxVisibleWithoutMore: 7, dictKey: 'rd_type' },
    { id: 'statusCode', label: '需求状态', maxVisibleWithoutMore: 9, dictKey: 'rd_breakthrough_status' }
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
    { title: '序号', type: 'seq', key: 'index', textAlign: 'center', width: '60px' },
    { title: '单号', field: 'code', key: 'code', ellipsis: true, },
    { title: '研发攻关类型', field: 'rdType', key: 'rdType', align: 'center',
        // customRender: ({record}) => {
        // const { reqPartsTotal, reqPartsFinish } = record;
        // // 计算未完成数量
        // return <span>{reqPartsUnfinish || '-'}</span>;
        // }
    }, 
    { title: '研发需求', field: 'sourceDesc', key: 'sourceDesc', align: 'center' }, // Corrected key
    { title: '需求状态', field: 'statusName', key: 'statusName', align: 'center' }, // Key matches display field
    { title: '创建日期', field: 'createTime', key: 'createTime', align: 'center' },
    { title: '期望匹配周期', field: 'matchPeriodName', key: 'matchPeriodName', align: 'center' },
    { title: '操作', key: 'actions', width: '10%', align: 'center', fixed: 'right' },
]);


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
        overview: 'apm/apmRdBreakthrough/overview?referer=owner'
    },
    filterConfigForPage,
    tableColumns,
    actions,
    statusDictKey: 'rd_breakthrough_status',
    userStatCardVisible: true,
    searchTitle: '研发攻关',
    tableOperations: [
        {
            title: '创建需求',
            clickFn: createNewSourcing,
            type: 'primary'
        },
        {
            title: '下载',
            type: 'primary',
            btnType: 'exportXls',
            fileName: '研发攻关',
            url: 'apm/apmRdBreakthrough/exportXls',
        },
        {
            title: '已删除',
            type: 'delete',
            btnType: 'delete',
        },
    ],
    dateRangeConfig: [
        {
            field: 'createTime', // Unique key for this date range
            label: '提出需求日期',
        }
    ],
})


function viewDetails({ id }) {
    router.push(`/user/published/PublicRelations/detail/${id}`);
};
function createNewSourcing() {
    router.push(`/user/published/PublicRelations/create`);
};
</script>