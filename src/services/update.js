import request from './request';

const updateService = {
  upload: (data) => request.post('dashboard/admin/project-upload', data),
  update: (data) => request.post('dashboard/admin/project-update', data),
};

export default updateService;
