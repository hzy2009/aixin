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
    // { id: 'region', label: '区域', maxVisibleWithoutMore: 3, options: [{ value: 'all', label: '全部' }, { value: 'huadong', label: '华东' }, { value: 'huanan', label: '华南' }, { value: 'huazhong', label: '华中' }, { value: 'huabei', label: '华北' }, { value: 'xinan', label: '西南' }, { value: 'xibei', label: '西北' }] },
    { id: 'statusCode', label: '寻源状态', maxVisibleWithoutMore: 7, dictKey: 'sourcing_status' }
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
    {type: 'checkbox', width: 34},
    ...OEM_PARTS_SOURCING_COLUMNS.filter(column => column.key !== 'actions'),
  { title: '操作', width: '140px', align: 'center', fixed: 'right', key: 'actions' },
]);

const addButton = reactive({
    text: '创建国产替代寻源',
    clickFn: createNewSourcing
})

const actions = reactive([
    {
        text: '详情',
        icon: FileTextOutlined,
        clickFn: viewDetails,
        // isVisible: (record) => record.statusCode !== '已完成' // Example condition
    },
  {
    text: '删除',
    icon: FileTextOutlined,
    clickFn: viewDetails,
    type: 'del',
    // isVisible: (record) => record.statusCode !== '已完成' // Example condition
  },
]);

const pageData = ref({
    url: {
        list: 'apm/apmSourcingOriginSubstitute/list/owner',
    delete: 'apm/apmSourcingOriginSubstitute/delete',
        overview: 'apm/apmSourcingOriginSubstitute/overview?referer=owner'
    },
    otherParams: {
        sourcingType: '原厂件寻源'
    },
    filterConfigForPage,
    tableColumns,
    addButton,
    actions,
    searchTitle: '原厂件寻源',
    statusDictKey: 'sourcing_status',
    userStatCardVisible: true,
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
            fileName: '原厂件寻源',
            url: 'apm/apmSourcing/exportXls',
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
        // placeholder: ['需求开始', '需求结束'] // Optional: custom placeholder
        },
        {
        field: 'expireDate',
        label: '计划完成日期',
        }
  ],
})


function viewDetails({ id }) {
    router.push(`/user/published/OEMPartsSourcing/detail/${id}`);
};
function createNewSourcing() {
    router.push(`/user/published/OEMPartsSourcing/create`);
};
</script>