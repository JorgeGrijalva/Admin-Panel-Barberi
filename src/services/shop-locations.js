import request from "./request";

const shopLocationsService = {
    getAll: (params) => request.get('dashboard/admin/shop-locations', {params}),
    create: (params) => request.post('dashboard/admin/shop-locations', {}, {params}),
    delete: (params) => request.delete('dashboard/admin/shop-locations/delete', {params})
}

export default shopLocationsService;