import { Card, Form } from 'antd';
import { useTranslation } from 'react-i18next';

import serviceMasterService from '../../../services/master/serviceMaster';
import ServiceMasterForm from './service-master-form';

function ServiceMasterAdd() {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = (payload) => {
    return serviceMasterService.create(payload);
  };

  return (
    <Card title={t('add.service.master')}>
      <ServiceMasterForm form={form} onSubmit={handleSubmit} />
    </Card>
  );
}

export default ServiceMasterAdd;
