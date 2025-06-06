<template>
  <div class="industry-report-page">
    <listPage :pageData="pageData" >
        <template #content="{ dataSource, paginationConfig }">
            <IndustryReportItem v-for="item in dataSource" :key="item.id" :report="item" />
            <!-- <IndustryReportItem v-for="item in mock" :key="item.id" :report="item" /> -->
            <a-pagination v-model:current="paginationConfig.current" show-quick-jumper v-bind="paginationConfig" @change="onChange" />
        </template>
    </listPage>
  </div>
</template>

<script setup lang="jsx">// jsx for custom pagination render if kept
import { ref, reactive } from 'vue'; // onMounted removed as hook handles it
import { useRouter } from 'vue-router';
import listPage from '@/components/template/listPage.vue';
import IndustryReportItem from './components/IndustryReportItem.vue';
const router = useRouter();

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
  { id: 'reqPartsType', label: '分类', maxVisibleWithoutMore: 7, dictKey: 'req_parts_type' },
  // { id: 'region', label: '区域', maxVisibleWithoutMore: 3, options: [{ value: 'all', label: '全部' }, { value: 'huadong', label: '华东' }, { value: 'huanan', label: '华南' }, { value: 'huazhong', label: '华中' }, { value: 'huabei', label: '华北' }, { value: 'xinan', label: '西南' }, { value: 'xibei', label: '西北' }] },
  { id: 'statusCode', label: '寻源状态', maxVisibleWithoutMore: 7, dictKey: 'sourcing_status' }
]);

const pageData = ref({
  url: {
    list: 'apm/apmResearchReport/list/front',
    overview: 'apm/apmResearchReport/overview'
  },
  filterConfigForPage,
  showBanner: true
})

const mock = [
    {
        id: '1',
        title: '2024年中国半导体制造业发展报告',
        author: '张明',
        summary: '随着人工智能产业的快速发展，AI 相关的云端 (服务器) 和终端 (AIPC、AI 手机) 产品出货量快速增长，产生大量高端芯片需求。受 AI 需求驱动，全球半导体销售金额在2023年2月触底后迅速回升。',
        category: '半导体技术',
        publishDate: '2025-04-22',
        thumbnailUrl: null, // Will use placeholder if null
        views: 86,
    },
    {
        id: '3',
        title: '2024年中国半导体制造业发展报告',
        author: '张明',
        summary: '随着人工智能产业的快速发展，AI 相关的云端 (服务器) 和终端 (AIPC、AI 手机) 产品出货量快速增长，产生大量高端芯片需求。受 AI 需求驱动，全球半导体销售金额在2023年2月触底后迅速回升。',
        category: '半导体技术',
        publishDate: '2025-04-22',
        thumbnailUrl: null, // Will use placeholder if null
        views: 86,
    },
    {
        id: '342',
        title: '2024年中国半导体制造业发展报告',
        author: '张明',
        summary: '随着人工智能产业的快速发展，AI 相关的云端 (服务器) 和终端 (AIPC、AI 手机) 产品出货量快速增长，产生大量高端芯片需求。受 AI 需求驱动，全球半导体销售金额在2023年2月触底后迅速回升。',
        category: '半导体技术',
        publishDate: '2025-04-22',
        thumbnailUrl: null, // Will use placeholder if null
        views: 86,
    },
    {
        id: '12434',
        title: '2024年中国半导体制造业发展报告',
        author: '张明',
        summary: '随着人工智能产业的快速发展，AI 相关的云端 (服务器) 和终端 (AIPC、AI 手机) 产品出货量快速增长，产生大量高端芯片需求。受 AI 需求驱动，全球半导体销售金额在2023年2月触底后迅速回升。',
        category: '半导体技术',
        publishDate: '2025-04-22',
        thumbnailUrl: null, // Will use placeholder if null
        views: 86,
    },
    {
        id: '441',
        title: '2024年中国半导体制造业发展报告',
        author: '张明',
        summary: '随着人工智能产业的快速发展，AI 相关的云端 (服务器) 和终端 (AIPC、AI 手机) 产品出货量快速增长，产生大量高端芯片需求。受 AI 需求驱动，全球半导体销售金额在2023年2月触底后迅速回升。',
        category: '半导体技术',
        publishDate: '2025-04-22',
        thumbnailUrl: null, // Will use placeholder if null
        views: 86,
    },
    {
        id: '5123',
        title: '2024年中国半导体制造业发展报告',
        author: '张明',
        summary: '随着人工智能产业的快速发展，AI 相关的云端 (服务器) 和终端 (AIPC、AI 手机) 产品出货量快速增长，产生大量高端芯片需求。受 AI 需求驱动，全球半导体销售金额在2023年2月触底后迅速回升。',
        category: '半导体技术',
        publishDate: '2025-04-22',
        thumbnailUrl: null, // Will use placeholder if null
        views: 86,
    },
]
// const currentPage = ref(1);
// const paginationConfig = reactive({
//   current: 1,
//   pageSize: 10
// })
function viewDetails({ id }) {
  router.push(`/user/published/DomesticSourcing/${id}`);
};
function createNewSourcing() {
  router.push(`/user/published/DomesticSourcing/create`);
};
</script>
<style scoped lang="less">
.industry-report-page {
  min-height: 500px;
}
</style>