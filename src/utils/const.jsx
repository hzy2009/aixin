import { selectOptions, formatDate } from '@/utils/index';
import defHttp from '@/utils/http/axios';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
const pathMap = {
    'A': {
        url: '/apm/apmSourcing/material/list/front',
        path: '/demands/DomesticDetailPage',
        title: '多元化寻源',

    },
    'B': {
        url: '/apm/apmSourcingOriginSubstitute/material/list/front',
        path: '/demands/OEMPartsDetailPage',
        title: '原厂件寻源',
    },
    'C': {
        url: '/apm/apmInspection/list/front',
        path: '/demands/VerificationDetailPage',
        title: '检测验证',
    },
    'D': {
        url: '/apm/apmRdBreakthrough/list/front',
        path: '/demands/PublicRelationsDetailPage',
        title: '研发攻关',
    },
    'E': {
        url: '/apm/apmResearchReport/list/front',
        path: '/demands/IndustryReportDetailPage',
        title: '行研报告',
    },
    'F': {
        url: '/apm/apmOfflineActivity/list/front',
        path: '/demands/OfflineEventDetailPage',
        title: '线下活动',
    },
}
const getOrderId = async (url, searche) => {
    let params = {
        pageNo: 1,
        pageSize: 1,
        search: searche
    }
    const res = await defHttp.get({ url: url, params });
    if (!res.success) {
        return false
    } else if (res.result.total < 1) {
        return false
    }
    return res.result.records[0].id
}
export const BUSINESS_REF_LIST = {
    title: '与此单关联的平台其他业务',
    groupCode: 'businessRefList',
    columns: [
        { title: '序号', type: 'seq', fixed: 'left', width: 50, align: 'center' },
        {
            title: '单据类型',
            field: 'refBusinessType',
            align: 'center',
            // 使用 formatter 进行简单的值-标签转换，更符合 vxe-table 的用法
            formatter: ({ cellValue }) => {
                const option = selectOptions('business_type').find(item => item.value == cellValue);
                return option ? option.label : '';
            }
        },
        {
            title: '单据号', field: 'refBusinessCode', align: 'center',
            slots: {
                default: ({ row }) => {
                    const router = useRouter();
                    const { refBusinessType = '', refBusinessCode } = row
                    return [<span class="link" onClick={async () => {
                        if (pathMap[refBusinessType]) {
                            const id = await getOrderId(pathMap[refBusinessType].url, refBusinessCode)
                            if (id) {
                                router.push({ path: `${pathMap[refBusinessType].path}/${id}` })
                            } else {
                                message.error('单据不存在');
                            }
                        } else {
                            message.error('不支持的该单据类型跳转');
                        }

                    }}>{refBusinessCode}</span>]
                }
            }
        },
    ]
}

export const REGISTER_LIST = {
    title: '参与者',
    groupCode: 'registerList',
    columns: [
        { title: '序号', type: 'seq', fixed: 'left', width: 50, align: 'center' },
        {
            title: '类型',
            field: 'registerType',
            // 使用 formatter 进行转换
            formatter: ({ cellValue }) => {
                const option = selectOptions('register_type').find(item => item.value == cellValue);
                return option ? option.label : '';
            }
        },
        { title: '编号', field: 'registerUserWorkNo', align: 'center' },
    ]
}

export const TENANT_REF_LIST = {
    groupCode: 'tenantRefList',
    columns: [
        { title: '序号', type: 'seq', fixed: 'left', width: 50, align: 'center' },
        { title: '检测验证承接方', field: 'refUserName', align: 'center' },
    ]
}

export const STATUS_HISTORY_COLUMNS = [
    { title: '序号', type: 'seq', fixed: 'left', width: 50, align: 'center' },
    { title: '状态', field: 'operateName', align: 'center' },
    { title: '完成日期', field: 'createTime', align: 'center' },
    { title: '备注', field: 'remark', align: 'center' },
]

export const DOMESTIC_SOURCING_COLUMNS = [
    { title: '序号', type: 'seq', fixed: 'left', width: 50, align: 'center' },
    { title: '爱芯享寻源单号', field: 'code', align: 'center', width: 180 },
    { title: '需求方', field: 'createBy', align: 'center', width: 180 },
    { title: '需求创建日期', field: 'createTime', align: 'center', fieldType: 'date', width: 120 },
    { title: '期望完成日期', field: 'expireDate', align: 'center', fieldType: 'date', width: 120 },
    { title: '内部管理单号', field: 'materialCode', align: 'center', width: 160 },
    { title: '选定厂商', field: 'refUserCode', align: 'center', width: 160 },
    { title: '需求状态', field: 'statusName', align: 'center', width: 100 },
    // 操作列通常没有 field，通过插槽（slot）来定义其内容
    { title: '操作', width: '10%', align: 'center', fixed: 'right', key: 'actions', width: 90 },
]

export const OEM_PARTS_SOURCING_COLUMNS = [
    { title: '序号', type: 'seq', fixed: 'left', width: 50, align: 'center' },
    { title: '爱芯享寻源单号', field: 'code', align: 'center', width: 180 },
    { title: '需求方', field: 'createBy', align: 'center', width: 180 },
    { title: '需求创建日期', field: 'createTime', align: 'center', fieldType: 'date', width: 110 },
    { title: '期望完成日期', field: 'expireDate', align: 'center', fieldType: 'date', width: 110 },
    { title: '内部管理单号', field: 'materialCode', align: 'center', width: 160 },
    { title: '选定厂商', field: 'refUserCode', align: 'center', width: 160 },
    { title: '需求状态', field: 'statusName', align: 'center', width: 110 },
    // 操作列通常没有 field，通过插槽（slot）来定义其内容
    { title: '操作', width: '10%', align: 'center', fixed: 'right', key: 'actions', width: 100 },
]

export const OFFLINE_EVENT_COLUMNS = [
    { title: '序号', type: 'seq', fixed: 'left', width: 50, align: 'center' },
    { title: '爱芯活动单号', field: 'code', align: 'center', width: 180 },
    { title: '活动类型', field: 'activityTypeName', align: 'center', width: 80 },
    { title: '发起人', field: 'createBy', align: 'center', width: 180 },
    {
        title: '参与者', field: 'registerList', align: 'center', width: 180, formatter: ({ cellValue }) => {
            const text = cellValue && cellValue.length > 0 && cellValue.map(item => item.registerUserWorkNo).join(',');
            return text || ''
        }
    },
    { title: '内容', field: 'description', align: 'center', showOverflow: true, width: 180 },
    { title: '结论', field: 'activityAddress', align: 'center', width: 180 },
    { title: '需求创建日期', field: 'createTime', align: 'center', fieldType: 'date', width: 100 },
    { title: '活动开始日期', field: 'activityDate', align: 'center', fieldType: 'date', width: 100 },
    { title: '活动结束日期', field: 'activityEndDate', align: 'center', fieldType: 'date', width: 100 },
    { title: '活动状态', field: 'statusName', align: 'center', width: 80 },
    { title: '操作', width: '10%', align: 'center', fixed: 'right', key: 'actions', width: 90 },
]

export const PUBLIC_RELATIONS_COLUMNS = [
    { title: '序号', type: 'seq', fixed: 'left', width: 50, align: 'center' },
    { title: '爱芯享研发攻关单号', field: 'code', align: 'center', width: 180 },
    { title: '研发攻关类型', field: 'rdType', align: 'center', width: 100 },
    { title: '需求创建日期', field: 'createTime', align: 'center', fieldType: 'date', width: 100 },
    { title: '期望完成日期', field: 'expireDate', align: 'center', fieldType: 'date', width: 100 },
    { title: '需求方', field: 'createBy', align: 'center' },
    { title: '承接方', field: 'refUserName', align: 'center' },
    { title: '需求状态', field: 'statusName', align: 'center', width: 100 },
    // 操作列通常没有 field，通过插槽（slot）来定义其内容
    { title: '操作', width: '10%', align: 'center', fixed: 'right', key: 'actions', width: 90 },
]
const getALLProductTypes = () => {
    const allProductTypes = selectOptions('product_type')
    const allProductTypeMaterials = selectOptions('product_type_material')
    return [...allProductTypes, ...allProductTypeMaterials]
}
export const VERIFICATION_COLUMNS = [
    { title: '序号', type: 'seq', fixed: 'left', width: 50, align: 'center' },
    { title: '爱芯享检测验证单号', field: 'code', align: 'center', width: 160 },
    { title: '检测验证类别', field: 'projectType', align: 'center', fieldType: 'select', width: 100, dictKey: 'project_type' },
    { title: '产品类别1', field: 'productMainTypeCode', align: 'center', fieldType: 'select', width: 80, dictKey: 'product_main_type' },
    {
        title: '产品类别2', field: 'productTypeName', align: 'center', width: 100,
        // formatter: ({row}) => {
        //     let txt = row?.productMainTypeName
        //     const spaces = '\u00A0'.repeat(4); // 4个空格的间距
        //     if (row?.productTypeName) {
        //         txt = `${txt} ${spaces} ${row?.productTypeName}`
        //     }
        //     return txt
        // } 
    },
    { title: '需求创建日期', field: 'createTime', align: 'center', fieldType: 'date', width: 100 },
    { title: '期望完成日期', field: 'expireDate', align: 'center', fieldType: 'date', width: 100 },
    { title: '需求方', field: 'createBy', align: 'center' },
    { title: '承接方', field: 'refUserName', align: 'center' },
    { title: '需求状态', field: 'statusName', align: 'center', width: 80 },
    // 操作列通常没有 field，通过插槽（slot）来定义其内容
    { title: '操作', width: '10%', align: 'center', fixed: 'right', key: 'actions', width: 90 },
]