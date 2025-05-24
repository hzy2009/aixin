import defHttp from '@/utils/http/axios'

const Api = {
    add: 'apm/apmSourcing/add',
    edit: 'apm/apmSourcing/edit',
    queryById: 'apm/apmSourcing/queryById',
    submit: 'apm/apmSourcing/submit',
    delete: 'apm/apmSourcing/delete',
    list: 'apm/apmSourcing/list',
}

export function getList(params) {
    return defHttp.get({ url: Api.list, params });
}

export function addDemand(data) {
    return defHttp.post({ url: Api.add, data });
}

export function editDemand(data) {
    return defHttp.post({ url: Api.edit, data });
}

export function getDemandById(params) {
    return defHttp.get({ url: Api.queryById, params });
}
export function submitDemand(data) {
    return defHttp.post({ url: Api.submit, data });
}
export function deleteDemand(params) {
    return defHttp.delete({ url: Api.delete, params });
}