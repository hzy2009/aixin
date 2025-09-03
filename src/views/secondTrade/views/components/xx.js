const gridConfigs = {
  PUBLICATION_FIXED_PRICE: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'refUserName', title: '意向买方', width: 100}, // 交易详情列
      { field: 'fixedPrice', title: '固定价', formatter: formatCurrency, width: 120 }, // 交易详情列
      { field: 'quantity', title: '购买数量', width: 80}, // 交易详情列
      { field: 'totalPrice', title: '总价', formatter: ({ row }) => calculateTotalPrice(row, 'priceExcludingTax', 'quantity'), width: 120 }, // 交易详情列
      { field: 'createTime', title: '购买时间', width: 160, columnType: 'both' }, // 交易详情和议价历史共用列
     
      { field: 'confirmedQuantity', title: '成交数量', columnType: 'negotiation', width: 80 }, // 议价历史列
      { field: 'priceExcludingTaxTotal', title: '成交总价', columnType: 'negotiation', width: 80, formatter: ({ row }) => calculateTotalPrice(row, 'priceExcludingTax', 'confirmedQuantity') }, // 议价历史列
      { field: 'approveTime', title: '成交时间', columnType: 'negotiation', width: 160 }, // 议价历史列
      { field: 'remark', title: '备注' }, // 议价历史列
       { 
        field: 'confirmedQuantity', 
        title: '出售数量',
        slots: { default: 'quantityEdit' },
        columnType: 'transaction' // 交易详情列
      },
      { title: '操作', slots: { default: 'buttons' }, width: 180, columnType: 'transaction' }, // 交易详情列
    ],
    buttons: [
      { key: 'confirmSale', label: '确认出售', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelSale', label: '取消出售', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  PUBLICATION_NEGOTIABLE: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'refUserName', title: '意向买方', width: 100 }, 
      { field: 'fixedPrice', title: '固定价', formatter: formatCurrency, width: 120 }, 
      { field: 'price', title: '买方议价', formatter: formatCurrency, width: 120  }, // 交易详情和议价历史共用列 (议价历史时显示为'议价金额')
      { field: 'quantity', title: '购买数量', width: 80  }, // 交易详情和议价历史共用列 (议价历史时显示为'议价数量')
      { field: 'createTime', title: '议价时间'}, 
      { 
        field: 'confirmedQuantity', 
        title: '交易数量',
        slots: { default: 'quantityEdit'},
         width: 120,
        columnType: 'transaction' // 交易详情列
      },
      { 
        field: 'priceExcludingTax', 
        title: '我的还价',
        slots: { default: 'priceEdit' },
        columnType: 'transaction' // 交易详情列
      },
      { 
        field: 'priceExcludingTax', 
        title: '我的还价',
        columnType: 'negotiation' // 交易详情列
      },
      { field: 'approveTime', title: '成交时间', columnType: 'negotiation' }, 
      { field: 'confirmedQuantity', title: '成交数量', width: 120, columnType: 'negotiation' },
      { field: 'totalPrice', title: '成交总价', formatter: ({ row }) => calculateTotalPrice(row, 'priceExcludingTax', 'confirmedQuantity'), width: 120, columnType: 'negotiation' }, // 议价历史列
      { title: '操作', slots: { default: 'buttons' }, width: 300, columnType: 'transaction' }, // 交易详情列
    ],
    buttons: [
      { key: 'confirmSale', label: '价格通知买家', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'deal', label: '不还价直接成交', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelSale', label: '取消出售', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  PUBLICATION_PRICE_ON_REQUEST: {
     columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'refUserName', title: '意向买方', width: 120 },
      { field: 'priceExcludingTax', title: '卖方售价', formatter: () => '***', width: 80 }, // 交易详情列
      { field: 'quantity', title: '购买数量', width: 80, columnType: 'both' }, // 交易详情和议价历史共用列 (议价历史时显示为'议价数量')
      { field: 'createTime', title: '购买时间', width: 160 }, // 交易详情列
      { field: 'confirmedQuantity', title: '成交数量', width: 120, columnType: 'negotiation' },
      { field: 'approveTime', title: '成交时间', columnType: 'negotiation' }, 
      { field: 'remark', title: '备注', columnType: 'both' }, // 交易详情和议价历史共用列
      { 
        field: 'confirmedQuantity', 
        title: '出售数量',
        slots: { default: 'quantityEdit' },
        width: 120,
        columnType: 'transaction' // 交易详情列
      },
      { title: '操作', slots: { default: 'buttons' }, width: 180, columnType: 'transaction' }, // 交易详情列
    ],
    buttons: [
      { key: 'confirmSale', label: '确认出售', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelSale', label: '取消出售', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  // Config for "交易详情" when transactionType is 'bidding'
  PUBLICATION_AUCTION: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'refUserName', title: '意向买方', columnType: 'both', width: 120 }, // 交易详情和议价历史共用列 (议价历史时显示为'对方')
      { field: 'price', title: '买方出价', formatter: formatCurrency, columnType: 'both', width: 80 }, // 交易详情和议价历史共用列 (议价历史时显示为'议价金额')
      { field: 'quantity', title: '购买数量', columnType: 'both', width: 80 }, // 交易详情和议价历史共用列 (议价历史时显示为'议价数量')
      { field: 'createTime', title: '出价时间', width: 160 }, // 交易详情列
      { field: 'expireDate', title: '竞拍截止时间', width: 160 }, // 交易详情列
      { field: 'priceExcludingTax', title: '成交价格', columnType: 'negotiation', width: 100 }, 
      { field: 'confirmedQuantity', title: '成交数量', width: 120, columnType: 'negotiation', width: 100 },
      { field: 'approveTime', title: '成交时间', columnType: 'negotiation', width: 160 }, 
      { field: 'remark', title: '备注', columnType: 'both' }, // 交易详情和议价历史共用列
      { field: 'isWinner', title: '选定买方', slots: { default: 'switch' }, width: 120, columnType: 'transaction' }, // 交易详情列
      { 
        field: 'confirmedQuantity', 
        title: '卖出数量',
        slots: { default: 'quantityEdit' },
        columnType: 'transaction' // 交易详情列
      },
    ],
    buttons: [],
  },
  JOIN_FIXED_PRICE: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'postedBy', title: '卖方', columnType: 'both', width: 80, formatter: postedBy }, 
      { field: 'fixedPrice', title: '固定价', formatter: formatCurrency, width: 100}, // 交易详情列
      { field: 'confirmedQuantity', title: '可出售数量', width: 100 }, // 交易详情列
      { field: 'totalPrice', title: '总价', formatter: ({ row }) => calculateTotalPrice(row, 'priceExcludingTax', 'confirmedQuantity'), columnType: 'transaction' }, // 交易详情列
      { field: 'createTime', title: '购买时间' }, // 交易详情列
      { field: 'totalPrice', title: '成交总价', formatter: ({ row }) => calculateTotalPrice(row, 'priceExcludingTax', 'quantity'), columnType: 'negotiation' }, // 议价历史列
      { field: 'approveTime', title: '成交时间', columnType: 'negotiation', width: 160 }, 
      { field: 'remark', title: '备注', columnType: 'both' }, // 交易详情和议价历史共用列
      { 
        field: 'quantity', 
        title: '购买数量',
        slots: { default: 'quantityEdit' },
        columnType: 'transaction' // 交易详情列
      },
      { title: '操作', slots: { default: 'buttons' }, width: 220, columnType: 'transaction' }, // 交易详情列
    ],
    buttons: [
      { key: 'confirmBuy', label: '确认交易', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  JOIN_NEGOTIABLE: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'postedBy', title: '卖方', columnType: 'both', width: 80, formatter: postedBy }, 
      { field: 'price', title: '我的议价', formatter: formatCurrency, width: 90, columnType: 'both' }, // 交易详情和议价历史共用列 (议价历史时显示为'议价金额')
      { field: 'quantity', title: '购买数量', width: 80, columnType: 'both' }, // 交易详情和议价历史共用列 (议价历史时显示为'议价数量')
      { field: 'createTime', title: '议价时间', columnType: 'both' }, // 交易详情和议价历史共用列
      { field: 'priceExcludingTax', title: '卖方议价', formatter: formatCurrency, width: 90}, // 交易详情列
      { field: 'totalPrice', title: '成交总价', formatter: ({ row }) => calculateTotalPrice(row, 'priceExcludingTax', 'confirmedQuantity'), columnType: 'negotiation' }, // 议价历史列
      { field: 'confirmedQuantity', title: '成交数量', width: 72 }, // 交易详情列
      { 
        field: 'dealedQuantity', 
        title: '交易数量',
        slots: { default: 'quantityEdit' },
        columnType: 'transaction' // 交易详情列
      },
      { field: 'fixedPrice', title: '固定价', formatter: formatCurrency, columnType: 'transaction' }, // 交易详情列
      { field: 'remark', title: '备注', width: 90, columnType: 'both' }, // 交易详情和议价历史共用列
      { title: '操作', slots: { default: 'buttons' }, width: 210, columnType: 'transaction' }, // 交易详情列
    ],
    buttons: [
      { key: 'confirmBuy', label: '接受还价确认交易', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  JOIN_PRICE_ON_REQUEST: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'postedBy', title: '卖方', columnType: 'both', width: 80, formatter: postedBy }, 
      { field: 'priceExcludingTax', title: '卖方售价', formatter: () => '***', width: 80 }, // 交易详情列
      { field: 'confirmedQuantity', title: '可出售数量', width: 90 }, // 交易详情列
      { field: 'productquantity', title: '库存数量', width: 90, formatter: () => props.product.quantity }, // 交易详情列
      // { field: 'totalPrice', title: '总价', formatter: () => '***', width: 80 }, // 交易详情列
      { field: 'createTime', title: '交易时间', width: 160}, // 交易详情列
      { field: 'quantity', title: '交易数量', columnType: 'negotiation', width: 80 }, // 议价历史列
      { field: 'approveTime', title: '成交时间', columnType: 'negotiation', width: 160 }, // 议价历史列
      { field: 'remark', title: '备注', columnType: 'both' }, // 交易详情和议价历史共用列
      { 
        field: 'quantity', 
        title: '交易数量',
        slots: { default: 'quantityEdit' },
        width: 120,
        columnType: 'transaction' // 交易详情列
      },
      { title: '操作', slots: { default: 'buttons' }, width: 160, columnType: 'transaction' }, // 交易详情列
    ],
    buttons: [
      { key: 'confirmBuy', label: '确认交易', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  },
  JOIN_AUCTION: {
    columns: [
      { type: 'seq', title: '序号', width: 46 },
      { field: 'postedBy', title: '卖方', columnType: 'both', width: 80, formatter: postedBy }, 
      { field: 'price', title: '我的竞价', formatter: formatCurrency, columnType: 'both' }, // 交易详情和议价历史共用列 (议价历史时显示为'议价金额')
      { field: 'quantity', title: '购买数量', width: 80, columnType: 'both' }, // 交易详情和议价历史共用列 (议价历史时显示为'议价数量')
      { field: 'totalPrice', title: '我的竞价总价', formatter: ({ row }) => calculateTotalPrice(row, 'price',  'quantity'), columnType: 'transaction' }, // 交易详情列
      { field: 'createTime', title: '竞价时间' }, // 交易详情列
      { field: 'expireDate', title: '竞拍截止时间' }, // 交易详情列
      { field: 'bidStatus', title: '竞拍状态', width: 80, formatter: ({row}) => {
        if (!row.statusCode) return ''
        return row.statusCode == 'success' ? '竞拍成功' : '竞拍失败'
      }, columnType: 'transaction' }, // 交易详情列
      { field: 'totalPrice', title: '成交总价', formatter: ({ row }) => calculateTotalPrice(row, 'price',  'confirmedQuantity'), columnType: 'negotiation' }, // 交易详情列
      { field: 'confirmedQuantity', title: '成交数量', columnType: 'negotiation', width: 80 }, // 议价历史列
      { field: 'remark', title: '备注', columnType: 'both' }, // 交易详情和议价历史共用列
      { field: 'confirmedQuantity', title: '可卖数量', columnType: 'transaction' }, // 交易详情列
       { 
        field: 'dealedQuantity', 
        title: '交易数量',
        slots: { default: 'quantityEdit' },
        columnType: 'transaction' // 交易详情列
      },
      { title: '交易', slots: { default: 'buttons' }, width: 160, columnType: 'transaction' }, // 交易详情列
    ],
    buttons: [
      { key: 'confirmBuy', label: '确定交易', type: 'primary', danger: true, getDisabledState: (row) => !isRowEditable(row) },
      { key: 'cancelBuy', label: '取消交易', type: 'default', danger: true, getDisabledState: (row) => !isRowEditable(row) },
    ],
  }
};