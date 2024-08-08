import request from '../request';

const SellerInvitations = {
  getAll: (params) =>
    request.get('dashboard/seller/shop/users/paginate', { params }),
  statusChange: (id, data) =>
    request.post(`dashboard/seller/shops/invites/${id}/status/change`, data),
};

export default SellerInvitations;
