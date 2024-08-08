import request from './request';

const updateBookingService = {
  upload: (data) => request.post('dashboard/admin/module/booking/upload', data),
  update: (data) => request.post('dashboard/admin/module/booking/upload', data),
};

export default updateBookingService;
