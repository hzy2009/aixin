<template>
    <!-- 使用 vxe-grid 替代 a-table -->
    <vxe-grid
      :class="isMaxWidth ? 'materialVoListtable': ''"
      :data="props.data"
      :columns="columns"
      :row-config="{ keyField: 'id' }"
      border
      min-height="88"
    />
</template>

<script setup lang="jsx">
import userRefList from '@/views/user_center/views/components/userRefList.vue'
import businessRefList from '@/views/user_center/views/components/businessRefList.vue'
import { selectOptions } from '@/utils/index';

const props = defineProps(['data', 'isMaxWidth'])

// 列定义已转换为 vxe-table 格式，并包含了展开行的配置
const columns = [
    {
      type: 'expand', // 这是 vxe-table 的展开列，会显示 +/- 图标
      width: 98,
      title: '点击查看详情',
      // 展开行的内容在这里通过 JSX 定义
      slots: {
        content: ({ row }) => { // vxe-table 的作用域变量是 { row }
          return (
            <>
              {/* <userRefList data={row.tenantRefList} style="margin: 16px;"></userRefList> */}
              <businessRefList data={row.businessRefList} style="margin: 16px;"></businessRefList>
            </>
          )
        }
      }
    },
    {
      type: 'seq', // 使用 vxe-table 内置的序号类型
      title: '序号',
      align: 'center',
      width: 46,
    },
    {
      title: '内部管理单号',
      field: 'materialCode', // field -> field
      width: 180,
      align: 'center'
    },
    {
      title: '状态',
      field: 'statusCode', // field -> field
      formatter: ({ cellValue }) => {
          const option = selectOptions('material_code').find(item => item.value == cellValue);
          return option ? option.label : '';
      },
      width: 90,
    },
    {
      title: '厂商1',
      field: 'refUserCode1', // field -> field
      width: 150,
    },
    {
      title: '厂商2',
      field: 'refUserCode2', // field -> field
      width: 150,
    },
    {
      title: '厂商3',
      field: 'refUserCode3', // field -> field
      width: 150,
    },
    {
      title: '厂商4',
      field: 'refUserCode4', // field -> field
      width: 150,
    },
]
</script>
<style>
.materialVoListtable{
  max-width: 710px;
}
</style>