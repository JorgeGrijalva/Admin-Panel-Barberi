import request from '../request';

const inviteService = {
  getAll: (params) =>
    request.get('dashboard/seller/shops/invites/paginate', { params }),
  statusUpdate: (id, params) =>
    request.post(
      `dashboard/seller/shops/invites/${id}/status/change`,
      {},
      { params }
    ),
};

export default inviteService;
