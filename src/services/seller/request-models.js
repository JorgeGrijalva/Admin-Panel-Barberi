import request from '../request';
const requestModelsService = {
    requestChange: (data) => request.post('dashboard/seller/request-models', data),
    requestChangeUpdate: (id, data) => request.put(`dashboard/seller/request-models/${id}`, data),
    getAll: (params) => request.get('dashboard/seller/request-models', {params}),
    getById: (id, params) => request.get(`dashboard/seller/request-models/${id}`, {params}),
    delete: (params) => request.delete('dashboard/seller/request-models/delete', {params})
}

export default requestModelsService