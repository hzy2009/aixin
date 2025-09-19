<template>
    <div>
        <listPage :pageData="pageData" ref="refListPage">
            <template #content="{ dataSource, paginationConfig, loading }">
                <div class="results-grid content-section">
                    <SortFilters :filters="sortOptions" v-model:value="currentSort" @change="onSortChange" />
                    <EquipmentList :dataSource="dataSource" @handleDetails="handleDetails" :fieldList="fieldList" :loading="loading" :tagList="tagList"/>
                </div>
                <div class="pagination-wrapper">
                    <a-pagination size="small" v-model:current="paginationConfig.current" v-bind="{...paginationConfig, showSizeChanger: false}"
                        show-quick-jumper :total="paginationConfig.total" @change="onChange" />
                </div>
            </template>
        </listPage>
    </div>
</template>

<script setup >
import { ref, reactive } from 'vue'; // onMounted removed as hook handles it
import { useRouter } from 'vue-router';
import listPage from '@/components/template/listPage.vue';
import SortFilters from '../components/SortFilters.vue';
import EquipmentList from '../components/EquipmentList.vue';
import { USEDEQPTRADE_COLUMNS } from '@/utils/const.jsx';
import { message } from 'ant-design-vue';
import defHttp from '@/utils/http/axios'


const router = useRouter();
const refListPage = ref();
const currentSort = ref({ key: 'default' });
const sortOptions = [
    { key: 'default', label: '默认排序' },
    { key: 'priority,priceExcludingTax', label: '价格排序', type: 'dropdown', options: [{label: '从高到低', value: 'desc'}, {label: '从低到高', value: 'asc'}] },
    { key: 'createTime', label: '时间排序', type: 'dropdown', options: [{label: '从高到低', value: 'desc'}, {label: '从低到高', value: 'asc'}]  }
];

const onSortChange = (newSort) => {
    console.log('排序改变:', newSort);
    let params = {}
    if (newSort.key === 'default') {
        params = { order: 'desc', column: 'createTime' };
    } else {
       params = { order: newSort.order, column: newSort.key };
    }
    refListPage.value.loadTableData(params);
};
const tagList = [
    'productStatusName',
    'stockStatusName',
    'productSource'
]
const fieldList = [
    { key: 'productModelName', label: '设备类型' },
    { key: 'compatibleModels', label: '设备型号' },
    { key: 'originalManufacturer', label: '设备厂商' },
]
const handleDetails = (item) => {
    console.log(item);
    router.push({
        path: `/secondTrade/usedEqpTrade/details/${item.id}`,
    })
};
const initialPageSize = 12
const onChange = (page, pageSize) => {
    const res = refListPage.value.handleTablePaginationChange({
        current: page,
        pageSize: initialPageSize
    });
    res.then(() => {
        nextTick(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
            });
        })
    })
}

// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
    { id: 'productType', label: '设备状态', maxVisibleWithoutMore: 9, dictKey: 'secondhand_product_status'},
    { id: 'purchaseMethod', label: '价格类型', maxVisibleWithoutMore: 9, dictKey: 'purchase_method'},
    { id: 'productModelCode', label: '设备类型', maxVisibleWithoutMore: 6, dictKey: 'product_model'},
    { id: 'stockStatusName', label: '库存状态', maxVisibleWithoutMore: 9, selectionType: 'single', dictKey: 'product_stock_status' },
]);

const pageData = ref({
    url: {
        list: 'apm/apmDeviceSecondhand/list/front',
        // overview: 'apm/apmSourcingOriginSubstitute/overview/front'
    },
    initialPageSize: initialPageSize,
    filterConfigForPage
    // requiredRoles: ['apm-vip', 'apm-vip-inspection', 'apm-register'],
})

</script>

<style scoped lang="less">
@import '@/assets/styles/_variables.less';

.content-section {
    margin-bottom: @spacing-lg;

    &:last-child {
        margin-bottom: 0;
    }
}
.pagination-wrapper{
  text-align: right;
  margin-bottom: @spacing-lg;
}
</style>