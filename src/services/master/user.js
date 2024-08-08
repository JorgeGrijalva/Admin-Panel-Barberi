import request from '../request';

const masterUserService = {
  getAll: (params) => request.get('dashboard/master/users', { params }),
};

export default masterUserService;
