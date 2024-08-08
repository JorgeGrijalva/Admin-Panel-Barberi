import request from "../request";

const sellerShopLocationService = {
    getAll: (params) => request.get('dashboard/seller/shop-locations', {params}),
    create: (params) => request.post('dashboard/seller/shop-locations', {}, {params}),
    delete: (params) => request.delete('dashboard/seller/shop-locations/delete', {params})
}

export default sellerShopLocationService;