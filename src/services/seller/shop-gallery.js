import request from '../request';

const sellerShopGalleryService = {
  getAll: (params) => request.get('dashboard/seller/galleries', { params }),
  create: (params) => request.post('dashboard/seller/galleries', params),
};

export default sellerShopGalleryService;
