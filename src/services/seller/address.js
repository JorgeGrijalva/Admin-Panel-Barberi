import request from '../request';

const addressService = {
  getAll: (params) =>
    request.get('dashboard/seller/user-addresses', { params }),
  create: (data) => request.post('dashboard/seller/user-addresses', data),
};

export default addressService;
