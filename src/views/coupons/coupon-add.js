import React from 'react';
import { Form, Card } from 'antd';
import LanguageList from 'components/language-list';
import { useNavigate } from 'react-router-dom';
import couponService from 'services/coupon';
import moment from 'moment';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import { fetchCoupon } from 'redux/slices/coupon';
import CouponForm from './coupon-form';
import { toast } from 'react-toastify';

const CouponAdd = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const onFinish = (values) => {
    const params = {
      ...values,
      expired_at: moment(values.expired_at).format('YYYY-MM-DD'),
      qty: Number(values.qty),
      price: Number(values.price),
    };
    const nextUrl = 'coupons';

    return couponService.create(params).then(() => {
      toast.success(t('successfully.added'));
      batch(() => {
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        dispatch(fetchCoupon({}));
      });
      navigate(`/${nextUrl}`);
    });
  };

  return (
    <Card title={t('add.coupon')} extra={<LanguageList />}>
      <CouponForm form={form} handleSubmit={onFinish} />
    </Card>
  );
};

export default CouponAdd;
