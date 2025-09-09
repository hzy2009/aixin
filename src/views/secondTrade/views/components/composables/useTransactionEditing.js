/**
 * @file useTransactionEditing.js
 * @description 封装二手交易模块中交易历史页面的编辑和验证逻辑。
 * 该 composable 提供了数量和价格的输入处理、最大数量计算以及选中行数据的验证功能。
 */

import { message } from 'ant-design-vue';

/**
 * 封装交易历史页面中编辑和验证相关的逻辑。
 * 包括数量/价格的输入处理、最大数量计算和选中行验证。
 * @param {Object} props - 组件的 props，通常包含 transactionType 等信息。
 * @param {Function} isRowEditable - 判断行是否可编辑的函数，用于控制编辑行为。
 * @returns {Object} 包含编辑和验证相关操作的响应式对象，提供给组件使用。
 */
export function useTransactionEditing(props, isRowEditable) {

  /**
   * 获取最大可输入数量
   * @param {Object} row - 行数据
   * @returns {number} 最大数量
   */
  const getMaxQuantity = (row) => {
    if (!row) return 0;
    
    if (props.transactionType === 'PUBLICATION') {
      // 出售场景：最大数量为可出售数量
      return Number(row.quantity || 0);
    } else {
      // 购买场景：最大数量为卖方可出售数量
      return Number(row.confirmedQuantity || 0);
    }
  };

  /**
   * 处理数量变化
   * @param {number} value - 新数量值
   * @param {Object} row - 行数据
   * @param {string} field - 字段名
   */
  const handleQuantityChange = (value, row, field) => {
    try {
      if (!isRowEditable(row)) return; // 确保行可编辑

      const maxQuantity = getMaxQuantity(row);
      
      // 验证数量范围
      if (value > maxQuantity) {
        message.warn(`数量不能超过${maxQuantity}`);
        row[field] = maxQuantity;
        return;
      }
      
      if (value !== '' && value < 1) {
        message.warn('数量必须大于0');
        row[field] = 1;
        return;
      }
      
      row[field] = value;
      
    } catch (error) {
      console.error('处理数量变化时发生错误:', error);
      message.error('数量更新失败');
    }
  };

  /**
   * 处理价格变化
   * @param {number} value - 新价格值
   * @param {Object} row - 行数据
   * @param {string} field - 字段名
   */
  const handlePriceChange = (value, row, field) => {
    try {
      if (!isRowEditable(row)) return; // 确保行可编辑

      if (value < 0.01) {
        message.warn('价格必须大于0.01');
        row[field] = 0.01;
        return;
      }
      
      row[field] = value;
    } catch (error) {
      console.error('处理价格变化时发生错误:', error);
      message.error('价格更新失败');
    }
  };

  /**
   * 验证选中的数据
   * @param {Array} selectedRows - 选中的行数据数组
   * @returns {boolean} 验证是否通过
   */
  const validateSelectedRow = (selectedRows) => {
    if (!selectedRows || selectedRows.length === 0) {
      message.warn('请选择买方');
      return false;
    }
    
    for (let i = 0; i < selectedRows.length; i++) {
      const row = selectedRows[i];
      // 验证出售数量
      if (!row.confirmedQuantity || row.confirmedQuantity <= 0) {
        message.warn('请输入有效的卖出数量');
        return false;
      }
      
      // 验证数量不能超过可用数量
      if (row.confirmedQuantity > row.quantity) {
        message.warn(`卖出数量不能超过可用数量（${row.quantity}）`);
        return false;
      }
    }

    return true;
  };

  return {
    getMaxQuantity,
    handleQuantityChange,
    handlePriceChange,
    validateSelectedRow,
  };
}
