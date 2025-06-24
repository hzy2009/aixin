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
import { PUBLIC_RELATIONS_COLUMNS } from '@/utils/const';
const router = useRouter();

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
    { id: 'rdCode', label: '研发攻关类型', maxVisibleWithoutMore: 7, dictKey: 'rd_type' },
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
    {type: 'checkbox', width: 40},
    ...PUBLIC_RELATIONS_COLUMNS
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