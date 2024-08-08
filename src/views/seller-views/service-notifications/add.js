import { useTranslation } from 'react-i18next';
import { Card, Form } from 'antd';
import LanguageList from '../../../components/language-list';
import serviceNotificationsService from '../../../services/seller/service-notifications';
import ServiceNotificationsForm from './form';

function AddServiceNotifications() {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = (payload) => {
    return serviceNotificationsService.create(payload);
  };

  return (
    <Card title={t('add.service.notification')} extra={<LanguageList />}>
      <ServiceNotificationsForm form={form} onSubmit={handleSubmit} />
    </Card>
  );
}

export default AddServiceNotifications;
