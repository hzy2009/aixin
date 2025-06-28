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
import {VERIFICATION_COLUMNS} from '@/utils/const';
import { selectOptions } from '@/utils/index';
const authStore = useAuthStore();
const router = useRouter();

const getALLProductTypes = () => {
   const allProductTypes = selectOptions('product_type')  
   const allProductTypeMaterials = selectOptions('product_type_material')
   return [...allProductTypes, ...allProductTypeMaterials]
}
// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
    { id: 'projectType', label: '验证验证类型', maxVisibleWithoutMore: 7, dictKey: 'project_type' },
    { id: 'productMainTypeCode', label: '产品类别', maxVisibleWithoutMore: 10, dictKey: 'product_type', options: getALLProductTypes() },
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
    {type: 'checkbox', width: 40},
 ...VERIFICATION_COLUMNS.filter(column => column.key !== 'actions'),
  { title: '操作', width: '160px', align: 'center', fixed: 'right', key: 'actions' },
]);

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
        list: 'apm/apmInspection/list/owner',
        delete: 'apm/apmInspection/delete',
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
        // {
        //     field: 'createTime', // Unique key for this date range
        //     label: '需求提出日期',
        // }
    ],
    requiredRoles: ['apm-vip', 'apm-vip-inspection']
})


function viewDetails({ id }) {
    router.push(`/user/published/Verification/detail/${id}`);
};
function createNewSourcing() {
    router.push(`/user/published/Verification/create`);
};
</script>