import { useTranslation } from 'react-i18next';
import { Button, Card, Form, Space } from 'antd';
import ServiceMasterForm from './form';
import serviceMasterService from '../../../services/service-master';
import LanguageList from '../../../components/language-list';

function ServiceMasterAdd({ setVisibleComponent }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = (payload) => {
    return serviceMasterService.create(payload);
  };

  return (
    <Card
      title={t('add.service.master')}
      extra={
        <Space>
          <Button onClick={() => setVisibleComponent('table')}>
            {t('back')}
          </Button>
        </Space>
      }
    >
      <ServiceMasterForm
        form={form}
        onSubmit={handleSubmit}
        setVisibleComponent={setVisibleComponent}
      />
    </Card>
  );
}

export default ServiceMasterAdd;
