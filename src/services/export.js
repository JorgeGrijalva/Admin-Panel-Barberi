import request from './request';

const exportService = {
  orderExport: (id, params) =>
    request.get(`dashboard/user/export/order/${id}/pdf`, {
      params,
      responseType: 'blob',
    }),
};

export default exportService;
