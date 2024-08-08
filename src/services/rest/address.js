import request from '../request';
const addressService = {
  getCountries: (params) => request.get('rest/countries', { params }),
  getCities: (params) => request.get('rest/cities', { params }),
};

export default addressService;
