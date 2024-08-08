import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Form } from 'antd';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu, setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import getTranslationFields from 'helpers/getTranslationFields';
import deliveryPriceService from 'services/seller/delivery-price';
import { fetchSellerDeliveryPrice } from 'redux/slices/delivery-price';
import PriceForm from './price-form';

const AddDeliveryPrice = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { languages } = useSelector((state) => state.formLang, shallowEqual);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

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
      address: getTranslationFields(languages, values, 'address'),
      shop_id: myShop?.id,
    };
    const nextUrl = 'seller/delivery-price';

    return deliveryPriceService.create(body).then(() => {
      toast.success(t('successfully.created'));
      batch(() => {
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        dispatch(fetchSellerDeliveryPrice({}));
      });
      navigate(`/${nextUrl}`);
    });
  };

  return <PriceForm form={form} handleSubmit={onFinish} />;
};

export default AddDeliveryPrice;
