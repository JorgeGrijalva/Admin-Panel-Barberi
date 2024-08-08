import { Card, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import ServiceNotificationsForm from './form';
import LanguageList from '../../../components/language-list';
import serviceNotificationsService from '../../../services/master/serviceNotifications';

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
