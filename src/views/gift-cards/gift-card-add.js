import { useTranslation } from 'react-i18next';
import { Card, Form } from 'antd';
import { shallowEqual, useSelector } from 'react-redux';
import GiftCardForm from './form';
import getTranslationFields from '../../helpers/getTranslationFields';
import LanguageList from '../../components/language-list';
import GiftCardService from '../../services/gift-card';

function GiftCardAdd() {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = (body) => {
    console.log(body);
    return GiftCardService.create(body);
  };
  return (
    <Card title={t('add.gift.card')} extra={<LanguageList />}>
      <GiftCardForm form={form} handleSubmit={handleSubmit} />
    </Card>
  );
}

export default GiftCardAdd;
