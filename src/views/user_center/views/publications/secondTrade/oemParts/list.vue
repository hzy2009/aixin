<template>
    <div>
        <listPage :pageData="pageData" ref="refListPage"/>
    </div>
</template>

<script setup >
import { ref, reactive } from 'vue'; // onMounted removed as hook handles it
import { useRouter } from 'vue-router';
import listPage from '@/components/template/listPage.vue';
import { NOTSTANDARD_COLUMNS } from '@/utils/const.jsx';
import { FileTextOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import defHttp from '@/utils/http/axios'


const router = useRouter();
const refListPage = ref();

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
    ...NOTSTANDARD_COLUMNS,
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
        list: 'apm/apmDeviceOrigin/list/owner',
        // overview: 'apm/apmSourcingOriginSubstitute/overview/front'
    },
    tableColumns,
    actions,
    // requiredRoles: ['apm-vip', 'apm-vip-inspection', 'apm-register'],
})
function viewDetails({ id }) {
    router.push(`/user/published/oemParts/detail/${id}`);
};
</script>