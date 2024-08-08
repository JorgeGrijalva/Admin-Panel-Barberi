import request from '../request';

const sellerBookingZone = {
  getAll: (params) => request.get('dashboard/seller/shop-sections', { params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/shop-sections/${id}`, { params }),
  create: (data) => request.post('dashboard/seller/shop-sections', data),
  update: (id, data) =>
    request.put(`dashboard/seller/shop-sections/${id}`, data),
  delete: (params) =>
    request.delete('dashboard/seller/shop-sections/delete', { params }),
};

export default sellerBookingZone;
