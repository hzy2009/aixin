<template>
    <div >
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
import { selectOptions } from '@/utils/index';
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
    let params = {}
    if (newSort.key === 'default') {
        params = { order: 'desc', column: 'createTime' };
    } else {
       params = { order: newSort.order, column: newSort.key };
    }
    refListPage.value.loadTableData(params);
};

const fieldList = [
    { key: 'partNumber', label: '零部件料号' },
    { key: 'productModel', label: '零部件型号' },
    { key: 'originalManufacturer', label: '品牌/制造商' },
]
const tagList = [
    'productStatus',
    'stockStatus'
]
const handleDetails = (item) => {
    console.log(item);
    router.push({
        path: `/secondTrade/oemParts/details/${item.id}`,
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

const getALLProductTypes = () => {
   const allProductTypes = selectOptions('product_type')  
   const allProductTypeMaterials = selectOptions('product_type_material')
   return [{ value: '', label: '全部' }, ...allProductTypes, ...allProductTypeMaterials]
}
// --- Filter Configuration (remains in component as it's UI specific) ---
const filterConfigForPage = reactive([
    { id: 'productStatus', label: '零部件状态', maxVisibleWithoutMore: 9, dictKey: 'productStatus', options: [
        { label: '全部', value: '',},
        { label: '全新未拆封', value: '全新未拆封',},
        { label: '拆封未使用', value: '拆封未使用',},
        { label: '拆封已使用 ', value: '拆封已使用',},
    ] },
    { id: 'purchaseMethod', label: '购买形式', maxVisibleWithoutMore: 9, dictKey: 'purchase_method'},
    { id: 'productType', label: '产品类别', maxVisibleWithoutMore: 14, dictKey: 'product_type', options: getALLProductTypes() },
    { id: 'stockStatus', label: '库存状态', maxVisibleWithoutMore: 9, selectionType: 'single', options: [
        { label: '全部', value: '',},
        { label: '现货', value: '现货',},
        { label: '非现货', value: '非现货',},
    ] },
]);

const pageData = ref({
    url: {
        list: 'apm/apmDeviceOrigin/list/front',
        // overview: 'apm/apmSourcingOriginSubstitute/overview/front'
    },
    filterConfigForPage,
    initialPageSize: initialPageSize
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