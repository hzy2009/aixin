<template>
    <HomeHeroSection :height="160" v-if="showBanner" />
    <div class="page-title-header container" v-if="pageTitle">
        <span class="title-decorator-bar"></span>
        <h2 class="page-main-heading">{{ pageTitle }}</h2>
    </div>
    <div class="list-page container">
        <!-- <breadcrumbs/> -->
        <!-- 1. Stats Bar -->
        <div class="stats-bar" v-if="userStatCardVisible">
            <UserStatCard :label="item.label" :value="item.count || 0" v-for="item in stats.list"
                :key="item.label + item.count" @click="handleStatClick(item)">
                <template #icon><img src="@/assets/images/user_center/icon-pending.png" alt="未响应" /></template>
            </UserStatCard>
            <!-- <UserStatCard label="总计" :value="stats.total || 0">
                <template #icon><img src="@/assets/images/user_center/icon-total.png" alt="总计" /></template>
            </UserStatCard> -->
        </div>

        <!-- 2. Filter Accordion -->
        <UserFilterAccordion :filter-groups="filterConfigForPage" :initial-filters="currentFilters" v-if="filterConfigForPage && filterConfigForPage.length > 0"
            @filters-changed="handleFiltersChange" class="filter-accordion-section" ref="userFilterAccordionRef" />

        <!-- 3. Date Range Picker -->
        <MultiDateRangePickerGroup
            v-if="dateRangeConfig.length > 0"
            :config="dateRangeConfig"
            @values-changed="handleDateValuesUpdate"
            ref="multiDateRangePickerRef"
        />

        <!-- 4. Search and Action Bar -->
        <div class="search-action-bar">
            <div class="search-input-wrapper">
                <a-input v-model:value="search" placeholder="请输入关键字" allow-clear @pressEnter="triggerSearch">
                    <template #prefix>
                        <SearchOutlined />
                    </template>
                </a-input>
            </div>
            <div class="results-count-wrapper">
                <span>为你找到</span>
                <span class="results-count">&nbsp;{{ paginationConfig.total }}&nbsp;</span>
                <span>个{{ searchTitle }}</span>
            </div>
            <!-- <a-button type="primary" v-if="addButton" @click="handleAdd(addButton)" class="primary-btn">
                {{ addButton?.text }}
            </a-button> -->
        </div>
        <div class="table-operations">
            <a-button
                v-for="(Operations, index) in tableOperations"
                :key="index"
                @click="operationsClick(Operations)" 
                :type="Operations.type"
                :class="{'primary-btn': Operations.type == 'primary'}" 
                class="operations-btn">
                {{ Operations.title }}
            </a-button>
        </div>
        <slot name="content" :dataSource="tableData" :paginationConfig="paginationConfig">
            <div class="results-table-section">
                <a-table :columns="tableColumns" :dataSource="tableData" :loading="isLoading" bordered
                    :pagination="paginationConfig" row-key="id" @change="handleTablePaginationChange" size="middle" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                    class="user-demands-table">
                    <template #bodyCell="{ column, record, index }">
                         <span v-if="column.dataIndex === 'index'">
                            {{ (paginationConfig.current - 1) * paginationConfig.pageSize + index + 1 }}
                        </span>
                        <template v-if="column.key === 'statusCode'">
                            <a-tag :color="getStatusTagColor(record.sourcingStatus)" class="status-tag">
                                {{ record.statusCode }}
                            </a-tag>
                        </template>
                        <template v-else-if="column.key === 'actions'">
                            <a-button type="link" @click="handleActionClick(record, action)" class="action-link"
                                v-for="(action, i) in actions" :key="i">
                                {{ action.text }}
                            </a-button>
                        </template>
                    </template>
                </a-table>
            </div>
        </slot>
    </div>
</template>

<script setup lang="jsx">// jsx for custom pagination render if kept
import { ref, computed, toRefs } from 'vue'; // onMounted removed as hook handles it
import { Table as ATable, Tag as ATag, Button as AButton, Input as AInput } from 'ant-design-vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import HomeHeroSection from '@/views/home/components/HomeHeroSection.vue';
import UserStatCard from '@/components/layout/UserStatCard.vue';
import UserFilterAccordion from '@/components/layout/UserFilterAccordion.vue';
import MultiDateRangePickerGroup from '@/components/layout/MultiDateRangePickerGroup.vue';
import breadcrumbs from './breadcrumbs.vue';

import { useUserDemandList } from './hooks/useUserDemandList.js'; // Adjust path
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';
import { notification as Notification } from 'ant-design-vue'

const authStore = useAuthStore();
const modalStore = useModalStore();

const router = useRouter();

const userFilterAccordionRef = ref(null);
const props = defineProps({
    pageData: {
        type: Object,
        default: {},
    }
});

const { 
    url,
    filterConfigForPage,
    tableColumns,
    actions,
    otherParams,
    statusDictKey,
    userStatCardVisible,
    showBanner = false,
    pageTitle,
    tableOperations = [],
    dateRangeConfig = [],
    searchTitle 
} = props.pageData;
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
    handleExportXls,
    isVIP, // Ref from hook
} = useUserDemandList({
    otherParams,
    url: url,
    statusDictKey,
    userStatCardVisible
});
filterConfigForPage && filterConfigForPage.forEach(item => {
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

const operationsClick = (btn) => {
    if (authStore?.token) {
        if (btn.btnType == 'exportXls') {
            handleExportXls(btn.fileName, btn.url, {
                selections: selectedRowKeys.value.join(','),
                ...otherParams,
            });
        } else {
            btn.clickFn();
        }
    } else {
        modalStore.showLogin();
        // Notification.info({
        //     message: `没有权限操作`,
        //     placement: 'topRight',
        //     description: '请先登录',
        // });
        // setTimeout(() => {
        //     router.push('/login');
        // }, 1000)
    }
}

const selectedRowKeys = ref([]);

const onSelectChange = (rowKeys) => {
    console.log('selectedRowKeys changed: ', rowKeys);
    selectedRowKeys.value = rowKeys;
}

const handleDateValuesUpdate = (values) => {
    triggerSearch(values)
}

const handleActionClick = (record, action) => {
    if (authStore?.token) {
        action?.clickFn(record)
    } else {
        modalStore.showLogin();
    }
}
</script>

<style scoped lang="less">
@import './styles/list.less';
:deep(.ant-pagination) {
        margin-top: @spacing-lg;
        justify-content: flex-end; // Align pagination to the right
}

:deep(.ant-pagination-item-active) {
    background-color: @primary-color;
    border-color: @primary-color;

    a {
        color: white;
    }

    &:hover {
        background-color: darken(@primary-color, 10%);
        border-color: darken(@primary-color, 10%);

        a {
            color: white;
        }
    }
}

:deep(.ant-pagination-item-link) {

    // Prev/Next buttons
    &:not(.ant-pagination-disabled):hover {
        // color: @primary-color;
        // border-color: @primary-color;
    }
}

:deep(.ant-pagination-options-quick-jumper input) {
    border-radius: @border-radius-sm;

    &:hover {
        border-color: @primary-color;
    }

    &:focus {
        border-color: @primary-color;
        box-shadow: 0 0 0 2px fade(@primary-color, 20%);
    }
}
</style>