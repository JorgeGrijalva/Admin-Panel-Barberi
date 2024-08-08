import request from '../request';

const restCountryService = {
  get: (params) => request.get('rest/countries', { params }),
};

export default restCountryService;
