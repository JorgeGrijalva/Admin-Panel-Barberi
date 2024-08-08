import request from '../request';

const reviewService = {
  getAll: (params) =>
    request.get('dashboard/seller/reviews/paginate', { params }),
  getById: (id) => request.get(`dashboard/seller/reviews/${id}`),
  delete: (params) =>
    request.delete(`dashboard/seller/reviews/delete`, { params }),
  dropAll: () => request.get(`dashboard/seller/reviews/drop/all`),
  restoreAll: () => request.get(`dashboard/seller/reviews/restore/all`),
};

export default reviewService;
