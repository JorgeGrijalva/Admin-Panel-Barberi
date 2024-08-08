import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Form } from 'antd';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import deliveryPriceService from 'services/seller/delivery-price';
import { fetchSellerDeliveryPrice } from 'redux/slices/delivery-price';
import PriceForm from './price-form';

const EditDeliveryPrice = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    const { area, city, country, region, price, fitting_rooms, active } =
      values;
    const body = {
      price,
      fitting_rooms,
      active: Number(active),
      area_id: area?.value,
      city_id: city?.value,
      country_id: country?.value,
      region_id: region?.value,
      shop_id: myShop?.id,
    };
    const nextUrl = 'seller/delivery-price';
    return deliveryPriceService.update(id, body).then(() => {
      toast.success(t('successfully.updated'));
      batch(() => {
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        dispatch(fetchSellerDeliveryPrice({}));
      });
      navigate(`/${nextUrl}`);
    });
  };

  return <PriceForm form={form} handleSubmit={onFinish} />;
};

export default EditDeliveryPrice;
