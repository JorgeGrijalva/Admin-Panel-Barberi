import request from './request';

const privacyService = {
  getPolicy: () => request.get('dashboard/admin/policy'),
  getTerms: () => request.get('dashboard/admin/term'),
  createPolicy: (data) => request.post('dashboard/admin/policy', data),
  createTerms: (data) => request.post('dashboard/admin/term', data),
};

export default privacyService;
