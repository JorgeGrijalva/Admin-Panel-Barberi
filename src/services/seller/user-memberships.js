import request from '../request';

const sellerUserMembershipsService = {
    getAll: (params) => request.get('dashboard/seller/user-memberships', {params}),
    getById: (id) => request.get(`dashboard/seller/user-memberships/${id}`),
};

export default sellerUserMembershipsService;
