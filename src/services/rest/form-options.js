import request from '../request';

const formOptionsRestService = {
  getAll: (params) => request.get(`rest/form-options`, { params }),
  getById: (id) => request.get(`rest/form-options/${id}`),
};

export default formOptionsRestService;
