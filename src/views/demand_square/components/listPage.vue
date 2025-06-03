<template>
    <HomeHeroSection :height="200"/>
    <div class="list-page container">
        <!-- <breadcrumbs/> -->
        <!-- 1. Stats Bar -->
        <!-- <div class="stats-bar"> 
            <UserStatCard :label="item.label" :value="item.count || 0" v-for="item in stats.list" :key="item.label + item.count" @click="handleStatClick(item)">
                <template #icon><img src="@/assets/images/user_center/icon-pending.png" alt="未响应" /></template>
            </UserStatCard>
            <UserStatCard label="未响应" :value="stats.pendingResponse || 0">
                <template #icon><img src="@/assets/images/user_center/icon-pending.png" alt="未响应" /></template>
            </UserStatCard>
            <UserStatCard label="进行中" :value="stats.inProgress || 0">
                <template #icon><img src="@/assets/images/user_center/icon-inprogress.png" alt="进行中" /></template>
            </UserStatCard>
            <UserStatCard label="已完成" :value="stats.completed || 0">
                <template #icon><img src="@/assets/images/user_center/icon-completed.png" alt="已完成" /></template>
            </UserStatCard>
            <UserStatCard label="总计" :value="stats.total || 0">
                <template #icon><img src="@/assets/images/user_center/icon-total.png" alt="总计" /></template>
            </UserStatCard>
        </div> -->
        <!-- 2. Filter Accordion -->
        <UserFilterAccordion :filter-groups="filterConfigForPage" :initial-filters="currentFilters.value"
            @filters-changed="handleFiltersChange" class="filter-accordion-section" ref="userFilterAccordionRef" />

        <!-- 3. Search and Action Bar -->
        <div class="search-action-bar">
            <div class="search-input-wrapper">
                <a-input v-model:value="search" placeholder="请输入关键字" allow-clear @pressEnter="triggerSearch">
                    <template #prefix>
                        <SearchOutlined />
                    </template>
                </a-input>
                <a-button type="primary" @click="triggerSearch" class="search-btn">搜索</a-button>
            </div>
            <a-button type="primary" @click="handleAdd(addButton)" class="create-new-btn">
                {{ addButton?.text }}
            </a-button>
        </div>

        <!-- 4. Results Table -->
        <div class="results-table-section">
            <a-table :columns="tableColumns" :dataSource="tableData" :loading="isLoading" :pagination="paginationConfig"
                row-key="id" @change="handleTablePaginationChange" size="middle" class="user-demands-table">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'statusCode'">
                        <a-tag :color="getStatusTagColor(record.sourcingStatus)" class="status-tag">
                            {{ record.statusCode }}
                        </a-tag>
                    </template>
                    <template v-else-if="column.key === 'actions'">
                        <a-button type="link" @click="action?.clickFn(record)" class="action-link"
                            v-for="(action, i) in actions" :key="i">
                            {{ action.text }}
                        </a-button>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup lang="jsx">// jsx for custom pagination render if kept
import { ref, computed, toRefs } from 'vue'; // onMounted removed as hook handles it
import { Table as ATable, Tag as ATag, Button as AButton, Input as AInput } from 'ant-design-vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import HomeHeroSection from '@/views/home/components/HomeHeroSection.vue';
import UserStatCard from '@/views/user_center/components/UserStatCard.vue';
import UserFilterAccordion from '@/views/user_center/components/UserFilterAccordion.vue';
import breadcrumbs from './breadcrumbs.vue';

import { useUserDemandList } from './hooks/useUserDemandList.js'; // Adjust path
import { useAuthStore } from '@/store/authStore';

import { notification as Notification} from 'ant-design-vue'

const authStore = useAuthStore();

const router = useRouter();

const userFilterAccordionRef = ref(null);

const props = defineProps({
    pageData: {
        type: Object,
        default: {},
    },
});

const { url, filterConfigForPage, tableColumns, addButton, actions, otherParams, statusDictKey } = props.pageData;
const {
    selectOptions,
    stats,
    currentFilters,       // Ref from hook
    search,    // Ref from hook
    isLoading,            // Ref from hook
    tableData,            // Ref from hook
    pagination,           // Reactive object from hook
    handleFiltersChange,  // Method from hook
    triggerSearch,        // Method from hook
    handleTablePaginationChange, // Method from hook
    getStatusTagColor,
    handleStatClick,
    isVIP, // Ref from hook
} = useUserDemandList({
    otherParams,
    url: url,
    statusDictKey,
});
filterConfigForPage.forEach(item => {
    if (!item.options && item.dictKey) {
        item.options = selectOptions(item.dictKey);
    }
});

// --- Pagination Config (computed property using hook's pagination) ---
const paginationConfig = computed(() => ({
    ...pagination, // Spread all properties from the hook's pagination object
    itemRender: ({ type, originalElement }) => { // Custom render directly here
        if (type === 'prev' || type === 'next' || type === 'page') return originalElement;
        if (type === 'jump-prev' || type === 'jump-next') {
            return <span class="ant-pagination-item-ellipsis" >•••</span>;
        }
        return null; // Should not happen for other types
    },
}));
const handleAdd = (btn) => {
    if (authStore?.token) {
        btn.clickFn();
    } else {
        Notification.info({
            message: `没有权限创建`,
            placement: 'topRight',
            description: '请先登录',
        });
        setTimeout(() => {
            router.push('/login');
        }, 1000)
    }
}

</script>

<style scoped lang="less">
@import './styles/list.less';
</style>