import React, { useEffect, useState } from 'react';
import { Form, Card } from 'antd';
import LanguageList from 'components/language-list';
import { useNavigate, useParams } from 'react-router-dom';
import couponService from 'services/seller/coupon';
import moment from 'moment';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, removeFromMenu } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import { fetchCoupon } from 'redux/slices/sellerCoupons';
import CouponForm from './coupon-form';
import { toast } from 'react-toastify';

const CouponEdit = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { languages } = useSelector((state) => state.formLang, shallowEqual);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);

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

  function getCoupon(id) {
    setLoading(true);
    couponService
      .getById(id)
      .then(({ data }) => {
        const body = {
          ...data,
          ...getLanguageFields(data),
          expired_at: moment(data.expired_at, 'YYYY-MM-DD'),
        };
        form.setFieldsValue(body);
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  }

  const handleSubmit = (values) => {
    const nextUrl = 'seller/coupons';

    const params = {
      ...values,
      shop_id: myShop?.id,
      expired_at: moment(values.expired_at).format('YYYY-MM-DD'),
      qty: Number(values.qty),
      price: Number(values.price),
    };

    return couponService.update(id, params).then((res) => {
      toast.success(t('successfully.updated'));
      batch(() => {
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        dispatch(fetchCoupon({ shop_id: myShop?.id }));
      });
      navigate(`/${nextUrl}`);
    });
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      getCoupon(id);
    }
  }, [activeMenu.refetch]);

  return (
    <Card title={t('edit.coupon')} extra={<LanguageList />} loading={loading}>
      <CouponForm form={form} handleSubmit={handleSubmit} />
    </Card>
  );
};

export default CouponEdit;
