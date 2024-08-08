import React, { useEffect, useState } from 'react';
import { Button, Form, Space } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import RestaurantAddData from './restaurant-add-data';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { replaceMenu, setMenuData } from '../../redux/slices/menu';
import restaurantService from '../../services/restaurant';
import { useTranslation } from 'react-i18next';
import getDefaultLocation from '../../helpers/getDefaultLocation';

const RestaurantMain = ({ next, action_type = '', user }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { uuid } = useParams();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [logoImage, setLogoImage] = useState(
    activeMenu.data?.logo_img ? [activeMenu.data?.logo_img] : []
  );
  const [backImage, setBackImage] = useState(
    activeMenu.data?.background_img ? [activeMenu.data?.background_img] : []
  );
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual
  );
  const [location, setLocation] = useState(
    activeMenu?.data?.location
      ? {
          lat: parseFloat(activeMenu?.data?.location?.latitude),
          lng: parseFloat(activeMenu?.data?.location?.longitude),
        }
      : getDefaultLocation(settings)
  );

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      data.open_time = JSON.stringify(data?.open_time);
      data.close_time = JSON.stringify(data?.close_time);
      dispatch(
        setMenuData({ activeMenu, data: { ...activeMenu.data, ...data } })
      );
    };
  }, []);

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      ...values,
      'images[0]': logoImage[0]?.name,
      'images[1]': backImage[0]?.name,
      delivery_time_type: values.delivery_time_type,
      delivery_time_to: values.delivery_time_to,
      delivery_time_from: values.delivery_time_from,
      categories: values.categories.map((e) => e.value),
      tags: values?.tags?.map((e) => e.value),
      user_id: values.user.value,
      open: undefined,
      'location[latitude]': location.lat,
      'location[longitude]': location.lng,
      user: undefined,
      delivery_time: 0,
      type: 'restaurant',
    };
    if (action_type === 'edit') {
      restaurantUpdate(values, body);
    } else {
      restaurantCreate(values, body);
    }
  };

  function restaurantCreate(values, params) {
    restaurantService
      .create(params)
      .then(({ data }) => {
        dispatch(
          replaceMenu({
            id: `restaurant-${data.uuid}`,
            url: `restaurant/${data.uuid}`,
            name: t('add.restaurant'),
            data: {
              ...data,
              background_img: { name: data?.background_img },
              logo_img: { name: data?.logo_img },
              ...values,
            },
            refetch: false,
          })
        );
        navigate(`/restaurant/${data.uuid}?step=1`);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingBtn(false));
  }

  function restaurantUpdate(values, params) {
    restaurantService
      .update(uuid, params)
      .then(() => {
        dispatch(
          setMenuData({
            activeMenu,
            data: values,
          })
        );
        next();
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingBtn(false));
  }

  return (
    <>
      <Form
        form={form}
        name='basic'
        layout='vertical'
        onFinish={onFinish}
        initialValues={{
          open: false,
          status: 'new',
          ...activeMenu.data,
        }}
      >
        <RestaurantAddData
          logoImage={logoImage}
          setLogoImage={setLogoImage}
          backImage={backImage}
          setBackImage={setBackImage}
          form={form}
          location={location}
          setLocation={setLocation}
          user={user}
        />
        <Space>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('next')}
          </Button>
        </Space>
      </Form>
    </>
  );
};
export default RestaurantMain;
