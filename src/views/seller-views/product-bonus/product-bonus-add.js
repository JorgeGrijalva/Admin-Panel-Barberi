import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, Form } from 'antd';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import { fetchBonus } from 'redux/slices/product-bonus';
import bonusService from 'services/seller/bonus';
import ProductBonusForm from './product-bonus-form';

const ProductBonusAdd = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = (values) => {
    const nextUrl = 'seller/bonus/product';

    return bonusService.create(values).then(() => {
      toast.success(t('successfully.created'));
      batch(() => {
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        dispatch(fetchBonus({}));
      });
      navigate(`/${nextUrl}`);
    });
  };

  return (
    <Card title={t('add.bonus')} className='h-100'>
      <ProductBonusForm form={form} handleSubmit={onFinish} />
    </Card>
  );
};

export default ProductBonusAdd;
