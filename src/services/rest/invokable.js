import request from '../request';

const invokableService = {
  checkCoupon: (data) => request.post('rest/coupons/check', data),
  checkCashback: (data) => request.post('rest/cashback/check', data),
};

export default invokableService;
