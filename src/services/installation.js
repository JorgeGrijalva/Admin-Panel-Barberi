import request from './request';

const installationService = {
  checkInitFile: (params) => request.get('install/init/check', { params }),
  setInitFile: (data) => request.post('install/init/set', data),
  updateDatabase: (data) => request.post(`install/database/update`, data),
  migrationRun: (data) => request.post('install/migration/run', data),
  createAdmin: (data) => request.post(`install/admin/create`, data),
  createLang: (data) => request.post(`install/languages/create`, data),
  createCurrency: (data) => request.post(`install/currency/create`, data),
  systemInformation: (params) =>
    request.get('dashboard/admin/settings/system/information', { params }),
  backupHistory: (params) =>
    request.post('dashboard/admin/backup/history', {}, { params }),
  getBackupHistory: (params) =>
    request.get('dashboard/admin/backup/history', { params }),
  checkLicence: (data) => request.post(`install/check/licence`, data),
};

export default installationService;
