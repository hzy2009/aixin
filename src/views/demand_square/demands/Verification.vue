<template>
    <div>
        <listPage :pageData="pageData" />
    </div>
</template>

<script setup lang="jsx">// jsx for custom pagination render if kept
import { ref, reactive } from 'vue'; // onMounted removed as hook handles it
import { useRouter } from 'vue-router';
import listPage from '../../../components/template/listPage.vue';
import { FileTextOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '@/store/authStore';
import {VERIFICATION_COLUMNS} from '@/utils/const';
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
    { id: 'projectType', label: '验证验证类型', maxVisibleWithoutMore: 7, dictKey: 'project_type' },
    { id: 'productType', label: '产品类别', maxVisibleWithoutMore: 10, dictKey: 'product_type', options: getALLProductTypes() },
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
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
        list: 'apm/apmInspection/list/front',
        overview: 'apm/apmInspection/overview/front'
    },
    filterConfigForPage,
    tableColumns,
    actions,
    showBanner: true,
    userStatCardVisible: true,
    pageTitle: '检测验证',
    statusDictKey: 'inspection_status',
    tableOperations: [
        {
        title: '创建检测验证',
        clickFn: createNewSourcing,
        type: 'primary'
        }
    ],
    dateRangeConfig: [
        // {
        //     field: 'createTime', // Unique key for this date range
        //     label: '需求提出日期',
        // }
    ],
    searchTitle: '检测验证',
    requiredRoles: ['apm-vip', 'apm-vip-inspection']
})


function viewDetails({ id }) {
    router.push(`/demands/VerificationDetailPage/${id}`);
};
function createNewSourcing() {
    router.push(`/user/published/Verification/create`);
};
</script>