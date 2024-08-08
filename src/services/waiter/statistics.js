import request from '../request';

const statisticService = {
  getAllCount: (params) =>
    request.get('dashboard/waiter/statistics/count', { params }),
};

export default statisticService;
