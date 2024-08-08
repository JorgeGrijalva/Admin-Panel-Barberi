import request from '../request';

const restAreaService = {
  get: (params) => request.get('rest/areas', { params }),
};

export default restAreaService;
