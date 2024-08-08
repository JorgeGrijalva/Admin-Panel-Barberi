import { Card, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import GiftCardForm from './form';
import LanguageList from '../../../components/language-list';
import SellerGiftCardService from '../../../services/seller/gift-cards';
import getTranslationFields from '../../../helpers/getTranslationFields';
import { shallowEqual, useSelector } from 'react-redux';

function GiftCardAdd() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { languages } = useSelector((state) => state.formLang, shallowEqual);

  const handleSubmit = (values) => {
    const body = {
      ...values,
      title: getTranslationFields(languages, values, 'title'),
    };

    return SellerGiftCardService.create(body);
  };
  return (
    <Card title={t('add.gift.card')} extra={<LanguageList />}>
      <GiftCardForm form={form} handleSubmit={handleSubmit} />
    </Card>
  );
}

export default GiftCardAdd;
