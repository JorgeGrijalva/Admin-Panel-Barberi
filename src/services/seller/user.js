import request from '../request';

const userService = {
  getAll: (params) =>
    request.get('dashboard/seller/users/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/seller/users/${id}`, { params }),
  create: (data) => request.post('dashboard/seller/users', data),
  update: (uuid, data) => request.put(`dashboard/seller/users/${uuid}`, data),
  getDeliverymans: (params) =>
    request.get('dashboard/seller/shop/users/role/deliveryman', { params }),
  shopUsers: (params) =>
    request.get('dashboard/seller/shop/users/paginate', { params }),
  shopUserById: (uuid, params) =>
    request.get(`dashboard/seller/shop/users/${uuid}`, { params }),
  profileFirebaseToken: (data) =>
    request.post(`dashboard/user/profile/firebase/token/update`, data),
  changeActiveStatus: (uuid) =>
    request.post(`dashboard/seller/users/${uuid}/change/status`),
  addUserAddress: (uuid, data) =>
    request.post(`dashboard/seller/users/${uuid}/address`, data),
  statusChange: (id, data) =>
    request.post(`dashboard/seller/shops/invites/${id}/status/change`, data),
  getDeliverymanSettings: (id) =>
    request.get(`dashboard/seller/deliveryman-settings/${id}`),
  createDeliverymanSettings: (data) =>
    request.post('dashboard/seller/deliveryman-settings', data, {}),
  updateDeliverymanSettings: (id, data) =>
    request.put(`dashboard/seller/deliveryman-settings/${id}`, data, {}),
};

export default userService;
