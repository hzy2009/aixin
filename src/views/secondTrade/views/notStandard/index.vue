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
import { NOTSTANDARD_COLUMNS } from '@/utils/const.jsx';
import { maskMiddle } from '@/utils/index';
const router = useRouter();

const filterConfigForPage = reactive([
    // { id: 'statusCode', label: '寻源结果', maxVisibleWithoutMore: 7, dictKey: 'origin_substitute_sourcing_status' }
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
    ...NOTSTANDARD_COLUMNS
]);
const actions = reactive([
    {
        text: '详情',
        icon: FileTextOutlined,
        clickFn: viewDetails,
        // isVisible: (record) => record.statusCode !== '已完成' // Example condition
    }
]);

const tableOperations = reactive([
    {
        title: '一键敲门',
        clickFn: createNewSourcing,
        type: 'primary'
    }
])

const pageData = ref({
    url: {
        list: 'apm/apmDeviceUnstandard/list/front',
    },
    tableColumns,
    actions,
    tableOperations,
    // requiredRoles: ['apm-vip', 'apm-vip-inspection', 'apm-register'],
})


function viewDetails({ id }) {
    router.push(`/demands/OEMPartsDetailPage/${id}`);
};
function createNewSourcing() {
    router.push(`/user/published/OEMPartsSourcing/create`);
};
</script>