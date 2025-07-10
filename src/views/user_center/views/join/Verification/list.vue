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
import {VERIFICATION_COLUMNS} from '@/utils/const.jsx';
import { selectOptions } from '@/utils/index';
const authStore = useAuthStore();
const router = useRouter();

const getALLProductTypes = () => {
   const allProductTypes = selectOptions('product_type')  
   const allProductTypeMaterials = selectOptions('product_type_material')
   return [{ value: '', label: '全部' }, ...allProductTypes, ...allProductTypeMaterials]
}
// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
    { id: 'projectType', label: '检测验证类型', maxVisibleWithoutMore: 7, dictKey: 'project_type' },
    { id: 'productType', label: '产品类别', maxVisibleWithoutMore: 14, dictKey: 'product_type', options: getALLProductTypes() },
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
    {type: 'checkbox', width: 40},
  ...VERIFICATION_COLUMNS
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
        list: 'apm/apmInspection/list/join',
        overview: 'apm/apmInspection/overview?referer=join'
    },
    filterConfigForPage,
    tableColumns,
    statusDictKey: 'inspection_status',
    userStatCardVisible: true,
    actions,
    pageTitle: '检测验证',
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
            fileName: '检测验证',
            url: 'apm/apmInspection/exportXls',
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
     tableOperations: [
        {
            title: '已删除',
            type: 'delete',
            btnType: 'delete',
        },
    ],
    requiredRoles: ['apm-vip', 'apm-vip-inspection']
})


function viewDetails({ id }) {
    router.push(`/user/join/Verification/detail/${id}`);
};
function createNewSourcing() {
    router.push(`/user/published/Verification/create`);
};
</script>