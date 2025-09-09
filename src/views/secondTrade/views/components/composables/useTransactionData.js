/**
 * @file useTransactionData.js
 * @description 封装二手交易模块中交易历史页面的数据管理逻辑。
 * 该 composable 负责管理表格数据 (gridData) 的状态、处理数据更新，并提供给父组件访问数据的方法。
 */

import { ref, watch, computed } from 'vue';

/**
 * 封装交易历史页面的数据管理逻辑。
 * 包括 gridData 的状态、数据更新、以及暴露给父组件的方法。
 * @param {Object} props - 组件的 props，通常包含 product 数据。
 * @param {Ref<string>} activeTabKey - 当前激活的 tab key，用于区分数据字段。
 * @returns {Object} 包含 gridData 和相关操作的响应式对象，提供给组件使用。
 */
export function useTransactionData(props, activeTabKey) {
  const gridData = ref([]);

  /**
   * 根据当前标签页获取数据字段名
   * @returns {string} 数据字段名
   */
  const getDataFieldName = () => {
    return activeTabKey.value === 'transactionType' ? 'submitItemList' : 'dealItemList';
  };

  /**
   * 更新表格数据
   * @param {Object} productData - 产品数据
   */
  const updateGridData = (productData) => {
    if (!productData) {
      gridData.value = [];
      return;
    }
    
    try {
      const fieldName = getDataFieldName();
      const dataArray = productData[fieldName] || [];
      
      // 深拷贝数据以避免直接修改props
      gridData.value = JSON.parse(JSON.stringify(dataArray));
    } catch (error) {
      console.error('更新表格数据时发生错误:', error);
      gridData.value = [];
    }
  };

  // Watch for prop changes to update internal data state
  watch(() => props.product, updateGridData, { immediate: true, deep: true });

  // Watch for tab changes to reload data
  watch(activeTabKey, () => {
    updateGridData(props.product);
  });

  // 暴露给外部的方法
  const getGridData = computed(() => gridData.value);
  const getSelectedRow = computed(() => gridData.value.find(item => item.isWinner) || null);

  const refreshData = () => updateGridData(props.product);
  
  const clearSelection = () => {
    gridData.value.forEach(item => {
      if (item.isWinner) {
        item.isWinner = false;
      }
    });
  };

  return {
    gridData,
    getGridData,
    getSelectedRow,
    refreshData,
    clearSelection,
  };
}
