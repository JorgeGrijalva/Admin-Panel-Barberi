import { Card, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import LanguageList from 'components/language-list';
import serviceExtraService from 'services/service-extra';
import ServiceExtraForm from './form';

function CreateServiceExtra() {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onSubmit = (body) => {
    return serviceExtraService.create(body);
  };
  return (
    <Card title={t('create.service.extra')} extra={<LanguageList />}>
      <ServiceExtraForm form={form} onSubmit={onSubmit} />
    </Card>
  );
}

export default CreateServiceExtra;
