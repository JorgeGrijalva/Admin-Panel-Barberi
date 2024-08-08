import { useTranslation } from 'react-i18next';
import { Button, Card, Space } from 'antd';
import LanguageList from '../../../../components/language-list';
import DisabledTimeForm from './form';
import { masterDisabledTimesServices } from '../../../../services/seller/master-disabled-times';

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
