import request from '../request';

const brandService = {
  getAll: (params) => request.get('rest/brands/paginate', { params }),
  getById: (id, params) => request.get(`rest/brands/${id}`, { params }),
};

export default brandService;
