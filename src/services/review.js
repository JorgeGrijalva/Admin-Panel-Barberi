import request from './request';

const reviewService = {
  getAll: (params) =>
    request.get('dashboard/admin/reviews/paginate', { params }),
  getById: (id) => request.get(`dashboard/admin/reviews/${id}`),
  delete: (params) =>
    request.delete(`dashboard/admin/reviews/delete`, { params }),
  dropAll: () => request.get(`dashboard/admin/reviews/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/reviews/restore/all`),
};

export default reviewService;
