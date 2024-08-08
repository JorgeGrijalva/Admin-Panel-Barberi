import request from './request';

const profileService = {
  get: (params) => request.get('dashboard/user/profile/show', { params }),
};

export default profileService;
