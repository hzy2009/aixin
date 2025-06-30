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
import { OEM_PARTS_SOURCING_COLUMNS } from '@/utils/const';
const router = useRouter();

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
    { id: 'statusCode', label: '寻源结果', maxVisibleWithoutMore: 7, dictKey: 'sourcing_status' }
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
    ...OEM_PARTS_SOURCING_COLUMNS
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
        list: 'apm/apmSourcingOriginSubstitute/material/list/front',
        overview: 'apm/apmSourcingOriginSubstitute/overview/front'
    },
    otherParams: {
        sourcingType: '原厂件寻源'
    },
    filterConfigForPage,
    tableColumns,
    actions,
    showBanner: true,
    userStatCardVisible: true,
    pageTitle: '原厂件寻源',
    statusDictKey: 'sourcing_status',
    tableOperations: [
        {
        title: '创建原厂件寻源',
        clickFn: createNewSourcing,
        type: 'primary'
        }
    ],
    dateRangeConfig: [
        {
            field: 'createTime', // Unique key for this date range
            label: '需求提出日期',
        },
        {
            field: 'expireDate',
            label: '计划完成日期',
        }
    ],
    searchTitle: '原厂件寻源',
    requiredRoles: ['apm-vip', 'apm-vip-inspection', 'apm-register']
})


function viewDetails({ id }) {
    router.push(`/demands/OEMPartsDetailPage/${id}`);
};
function createNewSourcing() {
    router.push(`/user/published/OEMPartsSourcing/create`);
};
</script>