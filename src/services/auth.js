import request from './request';

const authService = {
  login: (data) => request.post('auth/login', data),
  logout: (data) => request.post('auth/logout', data),
};

export default authService;
