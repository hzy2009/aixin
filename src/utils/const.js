import {selectOptions} from '@/utils/index';

export const BUSINESS_REF_LIST = {
    title: '关联业务',
    groupCode: 'businessRefList',
    columns: [
    { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center', align: 'center' },
    { title: '单据类型', dataIndex: 'refBusinessType', key: 'materialName', align: 'center',
        customRender: ({record}) => {
        let label = ''
        selectOptions('business_type').forEach(item => {
            if (item.value == record.refBusinessType) {
            label = item.label;
            }
        })
        return label;
        }
        },
    { title: '单据号', dataIndex: 'refBusinessCode', key: 'materialCount', align: 'center' },
    ]
}

export const REGISTER_LIST = {
    title: '参与者',
    groupCode: 'registerList',
    columns: [
    { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' },
    { title: '类型', dataIndex: 'registerType', key: 'registerType',
        customRender: ({record}) => {
        let label = ''
        selectOptions('register_type').forEach(item => {
            if (item.value == record.registerType) {
            label = item.label;
            }
        })
        return label;
        }
        },
    { title: '编号', dataIndex: 'registerUserWorkNo', key: 'registerUserWorkNo' },
    ]
}

export const TENANT_REF_LIST = {
    groupCode: 'tenantRefList',
    columns: [
    { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center', align: 'center' },
    { title: '寻源承接方', dataIndex: 'refUserName', key: 'materialName', align: 'center' },
    ]
}

export const STATUS_HISTORY_COLUMNS = [
    { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' },
    { title: '状态', dataIndex: 'operateName', key: 'operateName'},
    { title: '完成日期', dataIndex: 'createTime', key: 'createTime' },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
]

export const DOMESTIC_SOURCING_COLUMNS = [
  { title: '序号', dataIndex: 'index', key: 'index', width: '60px' },
  { title: '寻源单号', dataIndex: 'code', key: 'code', width: '120px' },
  { title: '需求方', dataIndex: 'tenantName', key: 'tenantName', },
  { title: '创建日期', dataIndex: 'createTime', key: 'createTime', },
  { title: '期望完成日期', dataIndex: 'expireDate', key: 'expireDate', width: '120px' },
  { title: '需求状态', dataIndex: 'statusName', key: 'statusName', width: '80px' },
  { title: '操作', key: 'actions', width: '10%', align: 'center', fixed: 'right' },
]

export const OEM_PARTS_COLUMNS = [
    
]
// .map(item => ({ ...item, align: 'center', resizable: true }))

export const OFFLINE_EVENT_COLUMNS = [
    
]


export const PUBLIC_RELATIONS_COLUMNS = [
    
]


export const VERIFICATION_COLUMNS = [
    
]