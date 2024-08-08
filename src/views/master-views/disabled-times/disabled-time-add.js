import { Card } from 'antd';
import { useTranslation } from 'react-i18next';
import DisabledTimeForm from './disabled-time-form';
import LanguageList from '../../../components/language-list';
import serviceDisabledDays from '../../../services/master/serviceDisabledTimes';

function DisabledTimeAdd() {
  const { t } = useTranslation();

  const handleSubmit = (payload) => {
    return serviceDisabledDays.create(payload);
  };

  return (
    <Card title={t('add.disabled.time')} extra={<LanguageList />}>
      <DisabledTimeForm onSubmit={handleSubmit} />
    </Card>
  );
}

export default DisabledTimeAdd;
