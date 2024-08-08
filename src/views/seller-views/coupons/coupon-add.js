import React, { useState } from 'react';
import { Form, Card } from 'antd';
import LanguageList from 'components/language-list';
import { useNavigate } from 'react-router-dom';
import couponService from 'services/seller/coupon';
import moment from 'moment';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import { fetchCoupon } from 'redux/slices/sellerCoupons';
import CouponForm from './coupon-form';
import { toast } from 'react-toastify';

const CouponAdd = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);

  const handleSubmit = (values) => {
    const nextUrl = 'seller/coupons';

    const params = {
      ...values,
      shop_id: myShop?.id,
      expired_at: moment(values.expired_at).format('YYYY-MM-DD'),
      qty: Number(values.qty),
      price: Number(values.price),
    };

    return couponService.create(params).then((res) => {
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
      <CouponForm form={form} handleSubmit={handleSubmit} />
    </Card>
  );
};

export default CouponAdd;
