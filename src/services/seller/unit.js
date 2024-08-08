import request from '../request';

const unitService = {
  getAll: (params) =>
    request.get('dashboard/seller/units/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/units/${id}`, { params }),
};

export default unitService;
