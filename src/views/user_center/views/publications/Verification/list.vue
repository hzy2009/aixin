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
import { useAuthStore } from '@/store/authStore';
const authStore = useAuthStore();
const router = useRouter();

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
    { id: 'productType', label: '产品类别', maxVisibleWithoutMore: 7, dictKey: 'product_type' },
    { id: 'projectType', label: '验证类型', maxVisibleWithoutMore: 7, dictKey: 'project_type' },
    { id: 'statusCode', label: '需求状态', maxVisibleWithoutMore: 7, dictKey: 'inspection_status' }
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
    { title: '序号', type: 'seq', key: 'index', textAlign: 'center', width: '60px' },
    { title: '单号', field: 'code', key: 'code', ellipsis: true, width: '120px' },
    { title: '验证项目', field: 'projectName', key: 'projectName', align: 'center' }, // This should be 'sourcingType' from mock
    { title: '产品类别', field: 'productType', key: 'productType', align: 'center',
        customRender: ({record}) => {
            const dictMap = authStore.sysAllDictItems['product_type'];
            const str = dictMap.find(item => item.value == record.productType);
            return <span>{str?.label || '-'}</span>;
        }
     }, // Key matches display field
    { title: '检测验证类型', field: 'projectType', key: 'projectType', align: 'center',
        customRender: ({record}) => {
            const dictMap = authStore.sysAllDictItems['project_type'];
            const str = dictMap.find(item => item.value == record.productType);
            return <span>{str?.label || '-'}</span>;
        }
     },
    { title: '需求状态', field: 'statusName', key: 'statusName', align: 'center' }, // Corrected key
    { title: '需求提出方', field: 'tenantName', key: 'tenantName', align: 'center' },
    { title: '创建时间', field: 'createTime', key: 'publishDate', align: 'center' },
    { title: '更新时间', field: 'updateTime', key: 'updateTime', ellipsis: true },
    { title: '操作', key: 'actions', align: 'center', fixed: 'right' },
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
        list: 'apm/apmInspection/list/owner',
        overview: 'apm/apmInspection/overview?referer=owner'
    },
    filterConfigForPage,
    tableColumns,
    statusDictKey: 'inspection_status',
    userStatCardVisible: true,
    actions,
    searchTitle: '检测验证',
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
            fileName: '检测验证',
            url: 'apm/apmInspection/exportXls',
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
    router.push(`/user/published/Verification/detail/${id}`);
};
function createNewSourcing() {
    router.push(`/user/published/Verification/create`);
};
</script>