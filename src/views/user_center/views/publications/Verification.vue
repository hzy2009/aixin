<template>
    <div>
        <listPage :pageData="pageData" />
    </div>
</template>

<script setup lang="jsx">// jsx for custom pagination render if kept
import { ref, reactive } from 'vue'; // onMounted removed as hook handles it
import { useRouter } from 'vue-router';
import listPage from '../components/listPage.vue';
import { FileTextOutlined } from '@ant-design/icons-vue';
const router = useRouter();

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
    { id: 'productType', label: '产品类别', maxVisibleWithoutMore: 7, dictKey: 'product_type' },
    { id: 'projectType', label: '项目分类', maxVisibleWithoutMore: 7, dictKey: 'project_type' },
    { id: 'statusCode', label: '需求状态', maxVisibleWithoutMore: 7, dictKey: 'inspection_status' }
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
    { title: '单号', dataIndex: 'code', key: 'code', ellipsis: true, width: '120px' },
    { title: '验证项目', dataIndex: 'projectName', key: 'projectName', align: 'center' }, // This should be 'sourcingType' from mock
    { title: '产品类别', dataIndex: 'productType', key: 'productType', align: 'center' }, // Key matches display field
    { title: '项目分类', dataIndex: 'projectType', key: 'projectType', align: 'center' }, // Corrected key
    { title: '需求状态', dataIndex: 'statusName', key: 'statusName', align: 'center' }, // Corrected key
    { title: '需求提出方', dataIndex: 'tenantName', key: 'tenantName', align: 'center' },
    { title: '创建时间', dataIndex: 'createTime', key: 'publishDate', align: 'center' },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', ellipsis: true },
    { title: '操作', key: 'actions', align: 'center', fixed: 'right' },
]);

const addButton = reactive({
    text: '创建检测验证',
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
        list: 'apm/apmInspection/list/owner',
        overview: 'apm/apmInspection/overview'
    },
    filterConfigForPage,
    tableColumns,
    addButton,
    actions
})


function viewDetails({ id }) {
    router.push(`/user/demands/Verification/${id}`);
};
function createNewSourcing() {
    router.push(`/user/demands/Verification/create`);
};
</script>