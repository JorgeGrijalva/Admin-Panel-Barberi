import request from '../request';

const statisticService = {
  getAllCount: (params) =>
    request.get('dashboard/deliveryman/statistics/count', { params }),
};

export default statisticService;
