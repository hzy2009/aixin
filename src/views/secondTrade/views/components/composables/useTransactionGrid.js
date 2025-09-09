
import { computed } from 'vue';
import { maskMiddle, selectOptions } from '@/utils/index';

/**
 * 这是一个组合式函数(Composable)，用于封装交易历史页面的VxeGrid配置逻辑。
 * 它将所有复杂的列定义、按钮配置和基于状态的过滤逻辑集中管理，
 * 使得主组件(`TransactionHistoryPage.vue`)更加简洁和易于维护。
 *
 * @param {Object} props - 从主组件传入的响应式props对象。
 * @param {Ref<String>} activeTabKey - 当前激活的标签页 ('transactionType' 或 'negotiation')。
 * @param {Ref<Boolean>} isDeadlinePassed - 竞拍是否已过截止日期的计算属性。
 * @param {Function} isRowEditable - 判断行是否可编辑的函数。
 * @returns {{currentGridConfig: ComputedRef<Object>}} - 返回一个包含当前应使用的表格配置的计算属性。
 */
export function useTransactionGrid(props, activeTabKey, isDeadlinePassed, isRowEditable) {
  // 将原组件内的格式化函数移入此处，并通过闭包访问`props`
  const formatCurrency = ({ cellValue, column }) => {
    if (column?.field && column.field === 'fixedPrice') {
      return `¥${props.product.priceIncludingTax.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    if (cellValue === null || cellValue === undefined || cellValue === '') {
      return '-';
    }
    const numValue = Number(cellValue);
    if (isNaN(numValue)) {
      return '-';
    }
    return `¥${numValue.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const postedBy = () => {
    if (props.product.postedBy) {
      return maskMiddle(props.product.postedBy);
    }
    return '-';
  };

  const formatPurchaseMethod = () => {
    let txt = '';
    if (props.product.purchaseMethod) {
      selectOptions('purchase_method').forEach((item) => {
        if (item.value == props.product.purchaseMethod) {
          txt = item.label;
        }
      });
    }
    return txt;
  };

  const formatTax = () => {
    let txt = '';
    if (props.product.tax) {
      txt = `${props.product.tax}%`;
    }
    return txt;
  };

  // 巨大的表格配置对象
  const gridConfigs = {
    // ... (所有PUBLICATION和JOIN的配置)
      // 卖方
  PUBLICATION_FIXED_PRICE: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'code', title: '爱芯享交易单号', width: 150}, 
      { field: 'purchaseMethod', title: '价格类型', width: 80, formatter: formatPurchaseMethod },
      { field: 'bidStatus', title: '交易结果', width: 90, formatter: ({row}) => {
        if (!row.statusCode) return ''
        return row.statusCode == 'succeeded' ? '交易达成' : '交易未达成'
      }, columnType: 'negotiation' }, // 交易历史
      { field: 'refUserName', title: '买方', width: 74, columnType: 'negotiation', formatter: ({cellValue}) => maskMiddle(cellValue)},  // 交易历史
      { field: 'quantity', title: '本次交易数量', width: 100, columnType: 'negotiation' },
      { field: 'productquantity', title: '库存数量', width: 76, formatter: () => props.product.quantity, columnType: 'transaction' }, 
      { field: 'fixedPrice', title: '售价(含税单价)', formatter: formatCurrency, width: 120, columnType: 'transaction'}, 
      { field: 'refUserName', title: '意向买方', width: 74, columnType: 'transaction', formatter: ({cellValue}) => maskMiddle(cellValue)}, 
      { field: 'createTime', title: '意向买方购买时间', width:150, columnType: 'transaction' }, // 交易详情
      { field: 'quantity', title: '意向买方购买数量', width: 128}, 
      { 
        field: 'confirmedQuantity', 
        title: '可出售数量',
        slots: { default: 'quantityEdit' },
        fiexd: 'right',
        width: 110, 
        columnType: 'transaction' 
      },
      { title: '操作', fiexd: 'right', slots: { default: 'buttons' }, width: 160, columnType: 'transaction' }, 
      { field: 'approveTime', title: '成交时间', width: 150, columnType: 'negotiation' }, // 交易历史
      { field: 'priceDeal', title: '成交单价(含税)', width: 130, columnType: 'negotiation' },  // 交易历史
      { field: 'dealQuantity', title: '成交数量', width: 98, columnType: 'negotiation' }, // 交易历史
      { field: 'publicPriceExcludingTaxTotal', title: '成交总价(不含税)', width: 130,  slots: { default: 'publicPriceExcludingTaxTotal' }, columnType: 'transaction' },
      { field: 'negotiationDealTotalWithoutTax', title: '成交总价(不含税)', slots: { default: 'negotiationDealTotalWithoutTax' }, width: 130, columnType: 'negotiation' }, // 成交总价(不含税)
      { field: 'tax', title: '税率%', formatter: formatTax, width: 70 }, 
      { field: 'publicPriceIncludingTaxTotal', title: '成交总价(含税)',  slots: { default: 'publicPriceIncludingTaxTotal' }, width: 124, columnType: 'transaction' }, 
      { field: 'negotiationDealTotalWithTax', title: '成交总价(含税)', slots: { default: 'negotiationDealTotalWithTax' }, width: 124, columnType: 'negotiation' }, // 成交总价(含税)
      { field: 'remark', title: '备注', columnType: 'both', width: 160 }, // 交易历史列
    ],
    buttons: [
      { key: 'confirmSale', label: '确认出售', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelSale', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  PUBLICATION_NEGOTIABLE: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'code', title: '爱芯享交易单号', width: 160},
      { field: 'purchaseMethod', title: '价格类型', width: 80, formatter: formatPurchaseMethod }, // 交易详情和交易历史共用列
      { field: 'productquantity', title: '库存数量', width: 76, formatter: () => props.product.quantity, columnType: 'transaction' }, 
       { field: 'bidStatus', title: '交易结果', width: 90, formatter: ({row}) => {
        if (!row.statusCode) return ''
        return row.statusCode == 'succeeded' ? '交易达成' : '交易未达成'
      }, columnType: 'negotiation' }, // 交易历史 
      { field: 'refUserName', title: '买方', width: 74, columnType: 'negotiation', formatter: ({cellValue}) => maskMiddle(cellValue)},  // 交易历史
      { field: 'quantity', title: '本次交易数量', width: 100, columnType: 'negotiation' },
      { field: 'refUserName', title: '议价方', width: 74, columnType: 'transaction', formatter: ({cellValue}) => maskMiddle(cellValue)}, 
      { field: 'createTime', title: '议价时间', width: 160, columnType: 'transaction' }, // 交易详情和交易历史共用列
      { field: 'quantity', title: '议价数量', width: 90, columnType: 'transaction'}, 
      { field: 'fixedPrice', title: '标价', formatter: formatCurrency, width: 80, columnType: 'transaction'}, 
      { field: 'price', title: '议价方议价（含税单价）', formatter: formatCurrency, width:170, columnType: 'transaction'}, // 交易详情和交易历史共用列 (交易历史时显示为'议价金额')
      { 
        field: 'priceIncludingTax', 
        title: '还价（含税单价）',
        slots: { default: 'priceEdit' },
         width: 140,
        columnType: 'transaction'
      },
      { 
        field: 'confirmedQuantity', 
        title: '可出售数量',
        slots: { default: 'quantityEdit'},
         width: 100,
        columnType: 'transaction' 
      },
      { title: '操作', slots: { default: 'buttons' }, width: 300, columnType: 'transaction' }, 
      { field: 'approveTime', title: '成交时间', width: 150, columnType: 'negotiation' }, // 交易历史
      { field: 'priceDeal', title: '成交单价(含税)', width: 130, columnType: 'negotiation' },  // 交易历史
      { field: 'dealQuantity', title: '成交数量', width: 98, columnType: 'negotiation' }, // 交易历史
      { field: 'publicPriceExcludingTaxTotal', title: '成交总价(不含税)', slots: { default: 'publicPriceExcludingTaxTotal' }, width: 130, columnType: 'transaction' }, // 交易历史列
      { field: 'negotiationDealTotalWithoutTax', title: '成交总价(不含税)', slots: { default: 'negotiationDealTotalWithoutTax' }, width: 130, columnType: 'negotiation' }, // 成交总价(不含税)
      { field: 'tax', title: '税率%', formatter: formatTax, width: 70 }, 
      { field: 'publicPriceIncludingTaxTotal', title: '成交总价(含税)', slots: { default: 'publicPriceIncludingTaxTotal' }, width: 124, columnType: 'transaction' }, 
      { field: 'negotiationDealTotalWithTax', title: '成交总价(含税)', slots: { default: 'negotiationDealTotalWithTax' }, width: 124, columnType: 'negotiation' }, // 成交总价(含税)
      { field: 'remark', title: '备注', columnType: 'both', width: 160 }, // 交易历史列
    ],
    buttons: [
      { key: 'confirmSale', label: '价格通知买家', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'deal', label: '不还价直接成交', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelSale', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  PUBLICATION_PRICE_ON_REQUEST: {
     columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'code', title: '爱芯享交易单号', width: 150}, 
      { field: 'purchaseMethod', title: '价格类型', width: 80, formatter: formatPurchaseMethod }, // 交易详情和交易历史共用列
      { field: 'bidStatus', title: '交易结果', width: 90, formatter: ({row}) => {
        if (!row.statusCode) return ''
        return row.statusCode == 'succeeded' ? '交易达成' : '交易未达成'
      }, columnType: 'negotiation' }, // 交易历史
      { field: 'refUserName', title: '买方', width: 74, columnType: 'negotiation', formatter: ({cellValue}) => maskMiddle(cellValue)}, 
      { field: 'quantity', title: '本次交易数量', width: 100, columnType: 'negotiation' },
      { field: 'productquantity', title: '库存数量', width: 76, formatter: () => props.product.quantity,columnType: 'transaction' }, 
      { field: 'refUserName', title: '询价方', width: 74,columnType: 'transaction' , formatter: ({cellValue}) => maskMiddle(cellValue)}, 
      { field: 'createTime', title: '询价时间', width: 150,columnType: 'transaction'  }, // 交易详情和交易历史共用列
      { field: 'quantity', title: '询价数量', width: 98,columnType: 'transaction'}, 
      { 
        field: 'priceIncludingTax', 
        title: '报价',
        slots: { default: 'priceEdit' },
         width: 120,
        columnType: 'transaction'
      },
      { 
        field: 'confirmedQuantity', 
        title: '可出售数量',
        fiexd: 'right',
        slots: { default: 'quantityEdit' },
        width: 110, 
        columnType: 'transaction' 
      },
      { title: '操作', fiexd: 'right', slots: { default: 'buttons' }, width: 160, columnType: 'transaction' }, 
      { field: 'approveTime', title: '成交时间', width: 150, columnType: 'negotiation' }, // 交易历史
      { field: 'priceDeal', title: '成交单价(含税)', width: 130, columnType: 'negotiation' },  // 交易历史
      { field: 'dealQuantity', title: '成交数量', width: 98, columnType: 'negotiation' }, // 交易历史
      { field: 'publicPriceExcludingTaxTotal', title: '成交总价(不含税)', slots: { default: 'publicPriceExcludingTaxTotal' }, width: 130, columnType: 'transaction' }, // 交易历史列
      { field: 'negotiationDealTotalWithoutTax', title: '成交总价(不含税)', slots: { default: 'negotiationDealTotalWithoutTax' }, width: 130, columnType: 'negotiation' }, // 成交总价(不含税)
      { field: 'tax', title: '税率%', formatter: formatTax, width: 70 }, 
      { field: 'publicPriceIncludingTaxTotal', title: '成交总价(含税)', slots: { default: 'publicPriceIncludingTaxTotal' }, width: 124, columnType: 'transaction' }, 
      { field: 'negotiationDealTotalWithTax', title: '成交总价(含税)', slots: { default: 'negotiationDealTotalWithTax' }, width: 124, columnType: 'negotiation' }, // 成交总价(含税)
      { field: 'remark', title: '备注', columnType: 'both', width: 160 }, 
    ],
    buttons: [
      { key: 'confirmSale', label: '确认出售', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelSale', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  // Config for "交易详情" when transactionType is 'bidding'
  PUBLICATION_AUCTION: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'code', title: '爱芯享交易单号', width: 150}, 
      { field: 'purchaseMethod', title: '价格类型', width: 80, formatter: formatPurchaseMethod }, // 交易详情和交易历史共用列
      { field: 'bidStatus', title: '交易结果', width: 90, formatter: ({row}) => {
        if (!row.statusCode) return ''
        return row.statusCode == 'succeeded' ? '交易达成' : '交易未达成'
      }, columnType: 'negotiation' }, // 交易历史
      { field: 'refUserName', title: '买方', width: 74, columnType: 'negotiation', formatter: ({cellValue}) => maskMiddle(cellValue)}, 
      { field: 'quantity', title: '本次交易数量', width: 100, columnType: 'negotiation' },
      { field: 'productquantity', title: '库存数量', width: 76, formatter: () => props.product.quantity, columnType: 'transaction' }, 
      { field: 'expireDate', title: '竞拍截止时间', width: 150, columnType: 'transaction' }, // 交易详情和交易历史共用列
      { field: 'createTime', title: '竞拍方竞拍时间', width: 150, columnType: 'transaction' }, // 交易详情和交易历史共用列
      { field: 'refUserName', title: '竞拍方', width: 74, formatter: ({cellValue}) => maskMiddle(cellValue)}, 
      { field: 'quantity', title: '竞拍方竞拍数量', width: 110, columnType: 'transaction'}, 
      { field: 'fixedPrice', title: '起拍价（含税单价）', formatter: formatCurrency, width: 140, columnType: 'transaction' }, 
      { field: 'price', title: '竞拍方竞拍价（含税单价）', formatter: formatCurrency, width: 180, columnType: 'transaction' }, 
      { field: 'isWinner', title: '选定买方', slots: { default: 'switch' }, width: 120, columnType: 'transaction' }, 
      { 
        field: 'confirmedQuantity', 
        title: '可出售数量',
        slots: { default: 'quantityEdit' },
        fiexd: 'right',
        width: 110, 
        columnType: 'transaction' 
      },
      { field: 'approveTime', title: '成交时间', width: 150, columnType: 'negotiation' }, // 交易历史
      { field: 'priceDeal', title: '成交单价(含税)', width: 130, columnType: 'negotiation' },  // 交易历史
      { field: 'dealQuantity', title: '成交数量', width: 98, columnType: 'negotiation' }, // 交易历史
      { field: 'publicPriceExcludingTaxTotal', title: '成交总价(不含税)', slots: { default: 'auctionPriceExcludingTaxTotal' }, width: 130, columnType: 'transaction' }, // 交易历史列
      { field: 'negotiationDealTotalWithoutTax', title: '成交总价(不含税)', slots: { default: 'negotiationDealTotalWithoutTax' }, width: 130, columnType: 'negotiation' }, // 成交总价(不含税)
      { field: 'tax', title: '税率%', formatter: formatTax, width: 70 }, 
      { field: 'publicPriceIncludingTaxTotal', title: '成交总价(含税)', slots: { default: 'auctionPriceIncludingTaxTotal' }, width: 124, columnType: 'transaction' }, 
      { field: 'negotiationDealTotalWithTax', title: '成交总价(含税)', slots: { default: 'negotiationDealTotalWithTax' }, width: 124, columnType: 'negotiation' }, // 成交总价(含税)
      { field: 'remark', title: '备注', columnType: 'both', width: 160 }, // 交易历史列
    ],
    buttons: [],
  },
  // 买方
  JOIN_FIXED_PRICE: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'code', title: '爱芯享交易单号', width: 150}, 
      { field: 'purchaseMethod', title: '价格类型', width: 80, formatter: formatPurchaseMethod },
      { field: 'postedBy', title: '卖方', width: 54, formatter: postedBy }, 
      { field: 'quantity', title: '本次交易数量', width: 100, columnType: 'negotiation' },
       { field: 'bidStatus', title: '交易结果', width: 90, formatter: ({row}) => {
        if (!row.statusCode) return ''
        return row.statusCode == 'succeeded' ? '交易达成' : '交易未达成'
      }, columnType: 'negotiation' }, // 交易历史
      // { field: 'productquantity', title: '卖方库存数量', width: 100, formatter: () => props.product.quantity, columnType: 'transaction' }, 
      { field: 'fixedPrice', title: '卖方售价（含税单价）', formatter: formatCurrency, width: 150, columnType: 'transaction' }, 
      { field: 'createTime', title: '购买时间', width: 150, columnType: 'transaction' }, // 交易详情和交易历史共用列
      { 
        field: 'quantity', 
        title: '购买数量',
        fiexd: 'right',
        width: 80, 
        columnType: 'transaction' 
      },
      { field: 'confirmedQuantity', title: '卖方可出售数量', width: 120, columnType: 'transaction'}, 
      { title: '操作', fiexd: 'right', slots: { default: 'buttons' }, width: 160, columnType: 'transaction' }, 
      { field: 'approveTime', title: '成交时间', width: 150, columnType: 'negotiation' }, // 交易历史
      { field: 'priceDeal', title: '成交单价(含税)', width: 130, columnType: 'negotiation' },  // 交易历史
      { field: 'dealQuantity', title: '成交数量', width: 98, columnType: 'negotiation' }, // 交易历史
      { field: 'publicPriceExcludingTaxTotal', title: '成交总价(不含税)', slots: { default: 'joinPriceExcludingTaxTotal' }, width: 130, columnType: 'transaction' }, // 交易历史列
      { field: 'negotiationDealTotalWithoutTax', title: '成交总价(不含税)', slots: { default: 'negotiationDealTotalWithoutTax' }, width: 130, columnType: 'negotiation' }, // 成交总价(不含税)
      { field: 'tax', title: '税率%', formatter: formatTax, width: 70 }, 
      { field: 'publicPriceIncludingTaxTotal', title: '成交总价(含税)', slots: { default: 'joinPriceIncludingTaxTotal' }, width: 124, columnType: 'transaction' }, 
      { field: 'negotiationDealTotalWithTax', title: '成交总价(含税)', slots: { default: 'negotiationDealTotalWithTax' }, width: 124, columnType: 'negotiation' }, // 成交总价(含税)
      { field: 'remark', title: '备注', columnType: 'both', width: 160 }, // 交易历史列
    ],
    buttons: [
      { key: 'confirmBuy', label: '确认交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  JOIN_NEGOTIABLE: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'code', title: '爱芯享交易单号', width: 150}, 
      { field: 'purchaseMethod', title: '价格类型', width: 80, formatter: formatPurchaseMethod }, // 交易详情和交易历史共用列
      { field: 'postedBy', title: '卖方', width: 54, formatter: postedBy }, 
      { field: 'quantity', title: '本次交易数量', width: 100, columnType: 'negotiation' }, // 交易详情和交易历史共用列
      { field: 'bidStatus', title: '交易结果', width: 90, formatter: ({row}) => {
        if (!row.statusCode) return ''
        return row.statusCode == 'succeeded' ? '交易达成' : '交易未达成'
      }, columnType: 'negotiation' }, // 交易历史
      // { field: 'productquantity', title: '卖方库存数量', width: 100, formatter: () => props.product.quantity, columnType: 'transaction' }, 
      { field: 'createTime', title: '议价时间', width: 150, columnType: 'transaction' }, // 交易详情和交易历史共用列
      { field: 'quantity', title: '议价数量', width: 98, columnType: 'transaction'}, 
      { field: 'confirmedQuantity', title: '卖方可出售数量', width: 120, columnType: 'transaction' },
      { field: 'fixedPrice', title: '卖方标价（含税单价）', formatter: formatCurrency, width: 150, columnType: 'transaction' },
      { field: 'price', title: '议价（含税单价）', formatter: formatCurrency, width: 130, columnType: 'transaction'  }, // 交易详情和交易历史共用列 (交易历史时显示为'议价金额')
      { field: 'priceIncludingTax', title: '卖方还价（含税单价）', formatter: formatCurrency, width: 150, columnType: 'transaction'}, 
      { title: '操作', slots: { default: 'buttons' }, width: 210, columnType: 'transaction' }, 
      { field: 'approveTime', title: '成交时间', width: 150, columnType: 'negotiation' }, // 交易历史
      { field: 'priceDeal', title: '成交单价(含税)', width: 130, columnType: 'negotiation' },  // 交易历史
      { field: 'dealQuantity', title: '成交数量', width: 98, columnType: 'negotiation' }, // 交易历史
      { field: 'publicPriceExcludingTaxTotal', title: '成交总价(不含税)', slots: { default: 'joinPriceExcludingTaxTotal' }, width: 130, columnType: 'transaction' }, // 交易历史列
      { field: 'negotiationDealTotalWithoutTax', title: '成交总价(不含税)', slots: { default: 'negotiationDealTotalWithoutTax' }, width: 130, columnType: 'negotiation' }, // 成交总价(不含税)
      { field: 'tax', title: '税率%', formatter: formatTax, width: 70 }, 
      { field: 'publicPriceIncludingTaxTotal', title: '成交总价(含税)', slots: { default: 'joinPriceIncludingTaxTotal' }, width: 124, columnType: 'transaction' }, 
      { field: 'negotiationDealTotalWithTax', title: '成交总价(含税)', slots: { default: 'negotiationDealTotalWithTax' }, width: 124, columnType: 'negotiation' }, // 成交总价(含税)
      { field: 'remark', title: '备注', columnType: 'both', width: 160 }, // 交易历史列
    ],
    buttons: [
      { key: 'confirmBuy', label: '接受还价确认交易', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  JOIN_PRICE_ON_REQUEST: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'code', title: '爱芯享交易单号', width: 150}, 
      { field: 'purchaseMethod', title: '价格类型', width: 80, formatter: formatPurchaseMethod }, // 交易详情和交易历史共用列
      { field: 'postedBy', title: '卖方', width: 54, formatter: postedBy }, 
      { field: 'bidStatus', title: '交易结果', width: 90, formatter: ({row}) => {
        if (!row.statusCode) return ''
        return row.statusCode == 'succeeded' ? '交易达成' : '交易未达成'
      }, columnType: 'negotiation' }, // 交易历史
      { field: 'quantity', title: '本次交易数量', width: 100, columnType: 'negotiation' }, // 交易详情和交易历史共用列
      // { field: 'productquantity', title: '卖方库存数量', width: 100, formatter: () => props.product.quantity, columnType: 'transaction' }, 
      { field: 'priceIncludingTax', title: '卖方报价（含税单价）', formatter: formatCurrency, width: 150, columnType: 'transaction' }, 
      { field: 'createTime', title: '询价时间', width: 150, columnType: 'transaction' }, // 交易详情和交易历史共用列
      {  field: 'quantity',  title: '询价数量',fiexd: 'right',width: 110, columnType: 'transaction' },
      { field: 'confirmedQuantity', title: '卖方可出售数量', width: 120, columnType: 'transaction'}, 
      { title: '操作', fiexd: 'right', slots: { default: 'buttons' }, width: 160, columnType: 'transaction' }, 
      { field: 'dealQuantity', title: '成交数量', width: 120, columnType: 'negotiation' },
      { field: 'approveTime', title: '成交时间', columnType: 'negotiation', width: 150 }, 
      { field: 'publicPriceExcludingTaxTotal', title: '成交总价(不含税)', slots: { default: 'joinPriceExcludingTaxTotal' }, width: 130, columnType: 'transaction' }, 
      { field: 'negotiationDealTotalWithoutTax', title: '成交总价(不含税)', slots: { default: 'negotiationDealTotalWithoutTax' }, width: 130, columnType: 'negotiation' }, // 成交总价(不含税)
      { field: 'tax', title: '税率%', formatter: formatTax, width: 70 }, 
      { field: 'publicPriceIncludingTaxTotal', title: '成交总价(含税)', slots: { default: 'joinPriceIncludingTaxTotal' }, width: 124, columnType: 'transaction' }, 
      { field: 'negotiationDealTotalWithTax', title: '成交总价(含税)', slots: { default: 'negotiationDealTotalWithTax' }, width: 124, columnType: 'negotiation' }, // 成交总价(含税)
      { field: 'remark', title: '备注', columnType: 'both', width: 160 }, 
    ],
    buttons: [
      { key: 'confirmBuy', label: '确认交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  JOIN_AUCTION: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'code', title: '爱芯享交易单号', width: 160}, 
      { field: 'purchaseMethod', title: '价格类型', width: 80, formatter: formatPurchaseMethod }, // 交易详情和交易历史共用列
      { field: 'postedBy', title: '卖方', width: 54, formatter: postedBy }, 
      { field: 'quantity', title: '本次交易数量', width: 100, columnType: 'negotiation' }, // 交易详情和交易历史共用列
      { field: 'bidStatus', title: '交易结果', width: 90, formatter: ({row}) => {
        if (!row.statusCode) return ''
        return row.statusCode == 'succeeded' ? '交易达成' : '交易未达成'
      }, columnType: 'negotiation' }, // 交易历史
      // { field: 'productquantity', title: '卖方库存数量', width: 100, formatter: () => props.product.quantity, columnType: 'transaction' }, 
      { field: 'expireDate', title: '竞拍截止时间', width: 150, columnType: 'transaction' }, // 交易详情和交易历史共用列
      { field: 'createTime', title: '参与竞拍时间', width:150, columnType: 'transaction' }, // 交易详情和交易历史共用列
      { field: 'quantity', title: '竞拍数量', width: 74, columnType: 'transaction'}, 
      { field: 'fixedPrice', title: '起拍价（含税单价）', formatter: formatCurrency, width: 140, columnType: 'transaction' }, 
      { field: 'price', title: '竞拍价（含税单价）', formatter: formatCurrency, width: 140, columnType: 'transaction' }, 
      { title: '操作', fiexd: 'right', slots: { default: 'buttons' }, width: 160, columnType: 'transaction' }, 
      { field: 'approveTime', title: '成交时间', width: 150, columnType: 'negotiation' }, // 交易历史
      { field: 'priceDeal', title: '成交单价(含税)', width: 110, columnType: 'negotiation' },  // 交易历史
      { field: 'dealQuantity', title: '成交数量', width: 74, columnType: 'negotiation' }, // 交易历史
      { field: 'publicPriceExcludingTaxTotal', title: '成交总价(不含税)', slots: { default: 'joinPriceExcludingTaxTotal' }, width: 130, columnType: 'transaction' }, // 交易历史列
      { field: 'negotiationDealTotalWithoutTax', title: '成交总价(不含税)', slots: { default: 'negotiationDealTotalWithoutTax' }, width: 130, columnType: 'negotiation' }, // 成交总价(不含税)
      { field: 'tax', title: '税率%', formatter: formatTax, width: 70 }, 
      { field: 'publicPriceIncludingTaxTotal', title: '成交总价(含税)', slots: { default: 'joinPriceIncludingTaxTotal' }, width: 124, columnType: 'transaction' }, 
      { field: 'negotiationDealTotalWithTax', title: '成交总价(含税)', slots: { default: 'negotiationDealTotalWithTax' }, width: 124, columnType: 'negotiation' }, // 成交总价(含税)
      { field: 'remark', title: '备注', columnType: 'both', width: 160 }, // 交易历史列
    ],
    buttons: [
      { key: 'confirmBuy', label: '确定交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  }
  };

  const filterColumnsByType = (columns, filterType) => {
    return columns.filter((column) => {
      if (column.type === 'seq') return true;
      const columnType = column.columnType || 'both';
      return columnType === 'both' || columnType === filterType;
    });
  };

  const currentGridConfig = computed(() => {
    const columnType = props.product?.purchaseMethod || 'FIXED_PRICE';
    const configKey = `${props.transactionType}_${columnType}`;
    const baseConfig = gridConfigs[configKey] || { columns: [], buttons: [] };

    if (activeTabKey.value === 'negotiation') {
      const filteredColumns = filterColumnsByType(baseConfig.columns, 'negotiation');
      return {
        columns: filteredColumns,
        buttons: [], // 交易历史不显示操作按钮
      };
    }

    if (activeTabKey.value === 'transactionType') {
      let filteredColumns = filterColumnsByType(baseConfig.columns, 'transaction');
      if (props.product?.purchaseMethod === 'AUCTION') {
        filteredColumns = filteredColumns.map((col) => {
          if (col.field === 'isWinner') {
            return { ...col, disabled: !isDeadlinePassed.value };
          }
          return col;
        });
      }
      return {
        columns: filteredColumns,
        buttons: baseConfig.buttons || [],
      };
    }

    return { columns: [], buttons: [] }; // Fallback
  });

  return {
    currentGridConfig,
  };
}
