import request from '../request';

const informationService = {
  translations: (params) =>
    request.get('rest/translations/paginate', { params }),
  settingsInfo: (params) => request.get('rest/settings', { params }),
  systemInformation: (params) =>
    request.get('rest/system/information', { params }),
};

export default informationService;
