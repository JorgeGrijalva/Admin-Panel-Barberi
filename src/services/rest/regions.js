import request from '../request';

const restRegionsService = {
  get: (params) => request.get('rest/regions', { params }),
};

export default restRegionsService;
