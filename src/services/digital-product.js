import request from './request';

const digitalProductService = {
  create: (data) => request.post('dashboard/admin/digital-files', data, {}),
};

export default digitalProductService;
