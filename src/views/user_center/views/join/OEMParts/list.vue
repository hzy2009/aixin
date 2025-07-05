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
import { OEM_PARTS_SOURCING_COLUMNS } from '@/utils/const.jsx';
const router = useRouter();

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
    // { id: 'region', label: '区域', maxVisibleWithoutMore: 3, options: [{ value: 'all', label: '全部' }, { value: 'huadong', label: '华东' }, { value: 'huanan', label: '华南' }, { value: 'huazhong', label: '华中' }, { value: 'huabei', label: '华北' }, { value: 'xinan', label: '西南' }, { value: 'xibei', label: '西北' }] },
    { id: 'statusCode', label: '寻源状态', maxVisibleWithoutMore: 7, dictKey: 'origin_substitute_sourcing_status' }
]);

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
        list: 'apm/apmSourcingOriginSubstitute/material/list/join',
        overview: 'apm/apmSourcingOriginSubstitute/overview?referer=join'
    },
    otherParams: {
        sourcingType: '原厂件寻源'
    },
    filterConfigForPage,
    tableColumns,
    actions,
    statusDictKey: 'origin_substitute_sourcing_status',
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
            fileName: '原厂件寻源',
            url: 'apm/apmSourcing/exportXls',
        }
    ],
    dateRangeConfig: [
        {
        field: 'createTime', // Unique key for this date range
        label: '需求创建日期',
        // placeholder: ['需求开始', '需求结束'] // Optional: custom placeholder
        },
        {
        field: 'expireDate',
        label: '期望完成日期',
        }
    ],
    tableOperations: [
        {
            title: '已删除',
            type: 'delete',
            btnType: 'delete',
        },
    ],
    requiredRoles: ['apm-vip', 'apm-vip-inspection', 'apm-register']
})


function viewDetails({ id }) {
    router.push(`/user/join/OEMPartsSourcing/detail/${id}`);
};
function createNewSourcing() {
    router.push(`/user/published/OEMPartsSourcing/create`);
};
</script>