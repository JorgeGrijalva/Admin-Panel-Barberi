import { useTranslation } from 'react-i18next';
import { Button, Card, Space } from 'antd';
import DisabledTimeForm from './form';
import LanguageList from '../../../components/language-list';
import { masterDisabledTimesServices } from '../../../services/master-disabled-times';

function DisabledTimeAdd({ setVisibleComponent }) {
  const { t } = useTranslation();

  const handleSubmit = (payload) => {
    return masterDisabledTimesServices.create(payload);
  };

  return (
    <Card
      extra={
        <Space>
          <Button onClick={() => setVisibleComponent('table')}>
            {t('back')}
          </Button>
          <LanguageList />
        </Space>
      }
    >
      <DisabledTimeForm
        onSubmit={handleSubmit}
        setVisibleComponent={setVisibleComponent}
      />
    </Card>
  );
}

export default DisabledTimeAdd;
