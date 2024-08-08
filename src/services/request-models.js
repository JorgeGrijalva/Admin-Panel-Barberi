import request from './request';

const requestAdminModelsService = {
    requestChangeCategory: (data) => request.post('dashboard/admin/request-models', data),
    requestChangeUpdate: (id, data) => request.put(`dashboard/admin/request-models/${id}`, data),
    getAll: (params) => request.get('dashboard/admin/request-models', {params}),
    getById: (id, params) => request.get(`dashboard/admin/request-models/${id}`, {params}),
    delete: (params) => request.delete('dashboard/admin/request-models/delete', {params}),
    changeStatus: (id, data) => request.post(`dashboard/admin/request-model/status/${id}`, data)
}

export default requestAdminModelsService