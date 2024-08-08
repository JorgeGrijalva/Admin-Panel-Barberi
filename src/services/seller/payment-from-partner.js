import request from '../request';
const paymentFromPartnerService = {
  getAll: (params) =>
    request.get('dashboard/seller/payment-to-partners', { params }),
};

export default paymentFromPartnerService;
