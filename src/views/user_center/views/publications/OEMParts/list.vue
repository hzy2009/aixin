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
    // { id: 'statusCode', label: '寻源状态', maxVisibleWithoutMore: 7, dictKey: 'origin_substitute_sourcing_status' }
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
    {type: 'checkbox', width: 34},
    // ...OEM_PARTS_SOURCING_COLUMNS.filter(column => column.key !== 'actions'),
     { title: '序号', type: 'seq', fixed: 'left', width: 50, align: 'center' },
    { title: '爱芯享寻源单号', field: 'code', align: 'center', width: 170 },
    { title: '需求方', field: 'createBy', align: 'center', width: 170 },
    { title: '需求创建日期', field: 'createTime', align: 'center', fieldType: 'date', width: 100},
    { title: '期望完成日期', field: 'expireDate', align: 'center', fieldType: 'date', width: 100},
    { title: '内部管理单号', field: 'materialCode', align: 'center', width: 160  },
    { title: '选定厂商', field: 'refUserCode', align: 'center', width: 136  },
    { title: '需求状态', field: 'statusName', align: 'center', width: 90 },
  { title: '操作', width: '150px', align: 'center', fixed: 'right', key: 'actions' },
]);

const addButton = reactive({
    text: '创建多元化寻源',
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
        list: 'apm/apmSourcingOriginSubstitute/material/list/owner',
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
    statusDictKey: 'origin_substitute_sourcing_status',
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
            url: 'apm/apmSourcingOriginSubstitute/exportXls',
            referer: 'owner'
        },
        // {
        //     title: '已删除',
        //     type: 'delete',
        //     btnType: 'delete',
        // },
    ],
    isUseFilterDelete: true,
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
    requiredRoles: ['apm-vip', 'apm-vip-inspection', 'apm-register'],
})


function viewDetails({ id }) {
    router.push(`/user/published/OEMPartsSourcing/detail/${id}`);
};
function createNewSourcing() {
    router.push(`/user/published/OEMPartsSourcing/create`);
};
</script>