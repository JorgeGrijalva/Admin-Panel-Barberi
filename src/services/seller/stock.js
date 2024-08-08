import request from '../request';

const stockService = {
  getAll: (params) =>
    request.get('dashboard/seller/stocks/select-paginate', { params }),
};

export default stockService;
