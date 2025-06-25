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
    { id: 'matchPeriodName', label: '匹配周期', maxVisibleWithoutMore: 7, dictKey: 'rd_breakthrough_period' },
]);

const tableColumns = reactive([
    {type: 'checkbox', width: 40},
    ...PUBLIC_RELATIONS_COLUMNS
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
        list: 'apm/apmRdBreakthrough/list/join',
        overview: 'apm/apmRdBreakthrough/overview?referer=join'
    },
    filterConfigForPage,
    tableColumns,
    addButton,
    actions,
    statusDictKey: 'rd_breakthrough_status',
    userStatCardVisible: true,
    tableOperations: [
        // {
        //     title: '创建需求',
        //     clickFn: createNewSourcing,
        //     type: 'primary'
        // },
        {
            title: '下载',
            type: 'primary',
            btnType: 'exportXls',
            fileName: '研发攻关',
            url: 'apm/apmRdBreakthrough/exportXls',
        }
    ],
    dateRangeConfig: [
        {
            field: 'createTime', // Unique key for this date range
            label: '提出需求日期',
        }
    ],
})


function viewDetails({ id }) {
    router.push(`/user/join/PublicRelations/detail/${id}`);
};
function createNewSourcing() {
    router.push(`/user/published/PublicRelations/create`);
};
</script>