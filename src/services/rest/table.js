import request from '../request';

const tableService = {
  getAllRestTables: (params) => request.get('rest/booking/tables', { params }),
};

export default tableService;
