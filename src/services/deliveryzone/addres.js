import request from '../request';

const addressService = {
  getAll: (params) => request.get('dashboard/admin/user-addresses', { params }),
  create: (data) => request.post('dashboard/admin/user-addresses', data),
};

export default addressService;
