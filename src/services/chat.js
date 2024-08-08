import request from './request';

const chatService = {
  getUser: (params) => request.get(`dashboard/user/chat-users`, { params }),
};

export default chatService;
