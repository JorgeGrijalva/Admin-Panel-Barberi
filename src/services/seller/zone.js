import request from '../request';

const deliveryZone = {
  getById: (id) => request.get(`rest/shop/delivery-zone/${id}`),
  create: (data) => request.post(`dashboard/seller/delivery-zones`, data, {}),
};

export default deliveryZone;
