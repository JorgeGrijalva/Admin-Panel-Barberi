import { useTranslation } from 'react-i18next';
import { Card, Form } from 'antd';
import serviceMasterService from '../../../services/seller/service-master';
import ServiceMasterForm from './form';

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
