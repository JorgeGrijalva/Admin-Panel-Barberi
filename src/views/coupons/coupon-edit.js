import React, { useEffect, useState } from 'react';
import { Form, Card } from 'antd';
import LanguageList from 'components/language-list';
import { useNavigate, useParams } from 'react-router-dom';
import couponService from 'services/coupon';
import moment from 'moment';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, removeFromMenu, setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import { fetchCoupon } from 'redux/slices/coupon';
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
          shop_id: {
            label: data?.shop?.translation?.title,
            value: data?.shop?.id,
            key: data?.shop?.id,
          },
          ...getLanguageFields(data),
          expired_at: moment(data.expired_at, 'YYYY-MM-DD'),
        };

        form.setFieldsValue({
          ...body,
        });

        dispatch(
          setMenuData({
            activeMenu,
            data: { ...body, expired_at: JSON.stringify(body?.expired_at) },
          }),
        );
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  }

  const onFinish = (values) => {
    const params = {
      ...values,
      expired_at: moment(values.expired_at).format('YYYY-MM-DD'),
      qty: Number(values.qty),
      price: Number(values.price),
    };
    const nextUrl = 'coupons';

    couponService.update(id, params).then(() => {
      toast.success(t('toast.updated'));
      batch(() => {
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        dispatch(fetchCoupon({}));
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
      <CouponForm form={form} handleSubmit={onFinish} />
    </Card>
  );
};

export default CouponEdit;
