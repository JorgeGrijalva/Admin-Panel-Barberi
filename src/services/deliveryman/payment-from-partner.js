import request from '../request';
const paymentFromPartnerService = {
  getAll: (params) =>
    request.get('dashboard/deliveryman/payment-to-partners', { params }),
};

export default paymentFromPartnerService;
