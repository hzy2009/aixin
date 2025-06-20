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

const router = useRouter();

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
    { id: 'productType', label: '产品类别', maxVisibleWithoutMore: 7, dictKey: 'product_type' },
    { id: 'projectType', label: '项目分类', maxVisibleWithoutMore: 7, dictKey: 'project_type' },
    { id: 'statusCode', label: '需求状态', maxVisibleWithoutMore: 7, dictKey: 'inspection_status' }
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
    { title: '序号', dataIndex: 'index', key: 'index', textAlign: 'center', width: '60px' },
    { title: '单号', dataIndex: 'code', key: 'code', ellipsis: true, width: '120px' },
    { title: '活动名称', dataIndex: 'activityName', key: 'activityName', align: 'center', ellipsis: true }, // This should be 'sourcingType' from mock
    { title: '类型名称', dataIndex: 'activityTypeName', key: 'activityTypeName', align: 'center', ellipsis: true }, // This should be 'sourcingType' from mock
    { title: '规模', dataIndex: 'registerLimit', key: 'registerLimit', align: 'center', ellipsis: true }, // This should be 'sourcingType' from mock
    { title: '活动日期', dataIndex: 'activityDate', key: 'activityDate', align: 'center', ellipsis: true }, // This should be 'sourcingType' from mock
    { title: '活动区域', dataIndex: 'activityArea', key: 'activityArea', align: 'center', ellipsis: true }, // This should be 'sourcingType' from mock
    { title: '活动地址', dataIndex: 'activityAddress', key: 'activityAddress', align: 'center', ellipsis: true }, // This should be 'sourcingType' from mock
    { title: '内容', dataIndex: 'description', key: 'description', align: 'center', ellipsis: true }, // This should be 'sourcingType' from mock
    { title: '需求状态', dataIndex: 'statusName', key: 'statusName', align: 'center', ellipsis: true }, // Corrected key
    { title: '需求提出方', dataIndex: 'tenantName', key: 'tenantName', align: 'center', ellipsis: true },
    { title: '创建时间', dataIndex: 'createTime', key: 'publishDate', align: 'center', ellipsis: true },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', ellipsis: true },
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
        list: 'apm/apmOfflineActivity/list/owner',
        overview: 'apm/apmOfflineActivity/overview?referer=owner'
    },
    filterConfigForPage,
    tableColumns,
    actions,
    statusDictKey: 'sourcing_status',
    userStatCardVisible: true,
    searchTitle: '线下活动',
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
            fileName: '线下活动',
            url: 'apm/apmOfflineActivity/exportXls',
        },
        {
            title: '已删除',
            type: 'delete',
            btnType: 'delete',
        },
    ]
})


function viewDetails({ id }) {
    router.push(`/user/published/OfflineEvent/detail/${id}`);
};
function createNewSourcing() {
    router.push(`/user/published/OfflineEvent/create`);
};
</script>