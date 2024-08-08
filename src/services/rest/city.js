import request from '../request';

const restCityService = {
  get: (params) => request.get('rest/cities', { params }),
};

export default restCityService;
