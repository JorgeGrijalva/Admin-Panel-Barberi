import request from '../request';

const currencyService = {
  getAll: (params) => request.get('rest/currencies', { params }),
};

export default currencyService;
