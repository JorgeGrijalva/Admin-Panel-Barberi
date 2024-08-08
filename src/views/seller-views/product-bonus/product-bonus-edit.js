import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, Form } from 'antd';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, removeFromMenu, setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { fetchBonus } from 'redux/slices/product-bonus';
import bonusService from 'services/seller/bonus';
import Loading from 'components/loading';
import ProductBonusForm from './product-bonus-form';

const ProductBonusAdd = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  function getProducts(bonus) {
    const data = {
      status: bonus?.status,
      expired_at: moment(bonus?.expired_at, 'YYYY-MM-DD'),
      stock: {
        label:
          bonus?.stock?.product?.translation?.title +
          `${
            bonus?.stock?.extras?.length > 0
              ? `: ${bonus?.stock?.extras
                  ?.map((ext) => ext?.value?.value)
                  .join(', ')}`
              : ''
          }`,
        value: bonus?.stock?.id,
        key: bonus?.stock?.id,
      },
      stock_quantity: bonus?.value,
      bonus_stock: {
        label:
          bonus?.bonusStock?.product?.translation?.title +
          `${
            bonus?.bonusStock?.extras?.length > 0
              ? `: ${bonus?.bonusStock?.extras
                  ?.map((ext) => ext?.value?.value)
                  .join(', ')}`
              : ''
          }`,
        value: bonus?.bonusStock?.id,
        key: bonus?.bonusStock?.id,
      },
      bonus_stock_quantity: bonus?.bonus_quantity,
    };
    console.log('data', data);
    form.setFieldsValue(data);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, expired_at: bonus?.expired_at },
      }),
    );
    setLoading(false);
  }

  const getBonus = (id) => {
    setLoading(true);
    bonusService
      .getById(id)
      .then((res) => getProducts(res.data))
      .finally(() => dispatch(disableRefetch(activeMenu)));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      getBonus(id);
    }
  }, [activeMenu.refetch]);

  const onFinish = (values) => {
    const nextUrl = 'seller/bonus/product';

    return bonusService.update(id, values).then(() => {
      toast.success(t('successfully.created'));
      batch(() => {
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        dispatch(fetchBonus({}));
      });
      navigate(`/${nextUrl}`);
    });
  };

  return (
    <Card title={t('edit.bonus')} className='h-100'>
      {!loading ? (
        <ProductBonusForm form={form} handleSubmit={onFinish} />
      ) : (
        <Loading />
      )}
    </Card>
  );
};

export default ProductBonusAdd;
