import request from '../request';

const storyService = {
  upload: (data) => request.post('dashboard/seller/stories/upload', data),
};

export default storyService;
