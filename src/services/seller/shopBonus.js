import request from '../request';

const shopBonusService = {
  getAll: (params) => request.get('dashboard/seller/bonuses', { params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/bonuses/${id}`, { params }),
  create: (data) => request.post('dashboard/seller/bonuses', data, {}),
  update: (id, data) => request.put(`dashboard/seller/bonuses/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/seller/bonuses/delete`, { params }),
  setActive: (id) => request.post(`dashboard/seller/bonuses/status/${id}`),
};

export default shopBonusService;
