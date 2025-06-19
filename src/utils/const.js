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
    { title: '状态', dataIndex: 'operateName', key: 'operateName' },
    { title: '完成日期', dataIndex: 'createTime', key: 'createTime' },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
]