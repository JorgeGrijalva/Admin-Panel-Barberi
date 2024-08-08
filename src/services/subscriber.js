import request from './request';

const subscriberService = {
  getAll: (params) =>
    request.get('dashboard/admin/email-subscriptions', { params }),
};

export default subscriberService;
