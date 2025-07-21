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
import { PUBLIC_RELATIONS_COLUMNS } from '@/utils/const.jsx';
import { maskMiddle } from '@/utils/index';
const router = useRouter();

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
    { id: 'rdCode', label: '研发攻关类型', maxVisibleWithoutMore: 7, dictKey: 'rd_type' },
    // { id: 'matchPeriodName', label: '匹配周期', maxVisibleWithoutMore: 7, dictKey: 'rd_breakthrough_period' },
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
    ...PUBLIC_RELATIONS_COLUMNS.map(item => {
    let Obj = Object.assign({}, item)
    if (['createBy', 'refUserName'].includes(item.field)) {
        Obj.formatter = ({ cellValue }) => maskMiddle(cellValue)
    }
    return Obj
  })
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
        list: 'apm/apmRdBreakthrough/list/front',
        overview: 'apm/apmRdBreakthrough/overview/front'
    },
    filterConfigForPage,
    tableColumns,
    actions,
    showBanner: true,
    pageTitle: '研发攻关',
    statusDictKey: 'rd_breakthrough_status',
    userStatCardVisible: true,
    tableOperations: [
        {
        title: '创建研发攻关',
        clickFn: createNewSourcing,
        type: 'primary'
        }
    ],
    dateRangeConfig: [
        {
            field: 'createTime', // Unique key for this date range
            label: '需求创建日期',
        },
        {
            field: 'expireDate', // Unique key for this date range
            label: '期望完成日期',
        }
    ],
    searchTitle: '研发攻关'
})


function viewDetails({ id }) {
    router.push(`/demands/PublicRelationsDetailPage/${id}`);
};
function createNewSourcing() {
    router.push(`/user/published/PublicRelations/create`);
};
</script>