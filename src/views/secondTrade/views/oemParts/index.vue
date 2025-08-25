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
import defHttp from '@/utils/http/axios'


const router = useRouter();
const refListPage = ref();
const currentSort = ref({ key: 'default' });
const sortOptions = [
    { key: 'default', label: '默认排序' },
    // { key: 'price', label: '价格排序', type: 'dropdown', options: [{label: '从高到低', value: 'desc'}, {label: '从低到高', value: 'asc'}] },
    { key: 'time', label: '时间排序', type: 'dropdown', options: [{label: '从高到低', value: 'desc'}, {label: '从低到高', value: 'asc'}]  }
];

const onSortChange = (newSort) => {
    console.log('排序改变:', newSort);
    // TODO: 调用 refListPage.value 的方法，传入新的排序参数并重新加载列表
    // refListPage.value.setQueryParams({ sortKey: newSort.key, sortOrder: newSort.order });
    // refListPage.value.reload();
};

const fieldList = [
    { key: 'partNumber', label: '零部件料号' },
    { key: 'compatibleModels', label: '零部件型号' },
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

const pageData = ref({
    url: {
        list: 'apm/apmDeviceOrigin/list/front',
        // overview: 'apm/apmSourcingOriginSubstitute/overview/front'
    },
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