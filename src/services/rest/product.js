import request from '../request';

const productService = {
  getAll: (params) => request.get('rest/products/paginate', { params }),
  getProductByIds: (params) => request.get('rest/products/ids', { params }),
  getByID: (id, params) => request.get(`rest/products/${id}`, { params }),
  search: (params) => request.get('rest/products/paginate', { params }),
};

export default productService;
