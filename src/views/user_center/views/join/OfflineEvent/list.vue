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
import {OFFLINE_EVENT_COLUMNS} from '@/utils/const.jsx';
const router = useRouter();

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
    { id: '', label: '活动类型', maxVisibleWithoutMore: 7, dictKey: 'activity_type' },
]);

// --- Table Columns (remains in component as it's UI specific) ---
const tableColumns = reactive([
    {type: 'checkbox', width: 40},
    ...OFFLINE_EVENT_COLUMNS
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
        list: 'apm/apmOfflineActivity/list/join',
        overview: 'apm/apmOfflineActivity/overview?referer=join'
    },
    filterConfigForPage,
    tableColumns,
    actions,
    statusDictKey: 'activity_status',
    userStatCardVisible: true,
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
            fileName: '线下活动',
            url: 'apm/apmOfflineActivity/exportXls',
        }
    ],
     dateRangeConfig: [
      {
          field: 'createTime', // Unique key for this date range
          label: '需求创建日期',
      },
      {
          field: 'activityDate', // Unique key for this date range
          label: '活动开始日期',
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
    router.push(`/user/join/OfflineEvent/detail/${id}`);
};
function createNewSourcing() {
    router.push(`/user/published/OfflineEvent/create`);
};
</script>