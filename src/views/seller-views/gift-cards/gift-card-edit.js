import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Card, Form } from 'antd';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LanguageList from '../../../components/language-list';
import GiftCardForm from './form';
import { useTranslation } from 'react-i18next';
import SellerGiftCardService from '../../../services/seller/gift-cards';
import { disableRefetch, setMenuData } from '../../../redux/slices/menu';
import getTranslationFields from '../../../helpers/getTranslationFields';

function GiftCardEdit() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages } = useSelector((state) => state.formLang, shallowEqual);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  function getLanguageFields(data) {
    if (!data?.translations) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.title,
    }));
    return Object.assign({}, ...result);
  }

  const fetchGiftCard = (id) => {
    setLoading(true);
    SellerGiftCardService.getById(id)
      .then((res) => {
        const body = {
          ...getLanguageFields(res.data),
          time: res.data?.time,
          price: res.data?.price,
          active: !!res.data?.active,
        };

        form.setFieldsValue(body);
        dispatch(setMenuData({ activeMenu, data: body }));
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = (values) => {
    const body = {
      ...values,
      title: getTranslationFields(languages, values, 'title'),
    };

    return SellerGiftCardService.update(id, body);
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchGiftCard(id);
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  return (
    <Card
      title={t('edit.gift.card')}
      extra={<LanguageList />}
      loading={loading}
    >
      {!loading && <GiftCardForm form={form} handleSubmit={handleSubmit} />}
    </Card>
  );
}

export default GiftCardEdit;
