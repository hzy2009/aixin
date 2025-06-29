<template>
    <!-- 使用 vxe-grid 替代 a-table -->
    <vxe-grid
      class="custom-detail-table"
      :data="props.data"
      :columns="columns"
      :row-config="{ keyField: 'id' }"
      border
    >
    </vxe-grid>
</template>

<script setup lang="jsx">
import userRefList from '@/views/user_center/views/components/userRefList.vue'
import businessRefList from '@/views/user_center/views/components/businessRefList.vue'
import { selectOptions } from '@/utils/index';

const props = defineProps(['data'])

// 列定义已转换为 vxe-table 格式，并包含了展开行的配置
const columns = [
    {
      type: 'expand', // 这是 vxe-table 的展开列，会显示 +/- 图标
      width: 100,
      title: '点击查看详情',
      // 展开行的内容在这里通过 JSX 定义
      slots: {
        content: ({ row }) => { // vxe-table 的作用域变量是 { row }
          return (
            <>
              <userRefList data={row.tenantRefList} style="margin: 16px;"></userRefList>
              <businessRefList data={row.businessRefList} style="margin: 16px;"></businessRefList>
            </>
          )
        }
      }
    },
    {
      type: 'seq', // 使用 vxe-table 内置的序号类型
      title: '序号',
      width: 80,
    },
    {
      title: '内部管理单号',
      field: 'materialCode', // field -> field
    },
    {
      title: '状态',
      field: 'statusName', // field -> field
      formatter: ({ cellValue }) => {
          const option = selectOptions('material_code').find(item => item.value == cellValue);
          return option ? option.label : '';
      }
    },
]
</script>