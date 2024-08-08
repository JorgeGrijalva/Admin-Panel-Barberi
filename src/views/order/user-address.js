import React, { useState } from 'react';
import { Button, Form, Modal } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Map from '../../components/map';
import getDefaultLocation from '../../helpers/getDefaultLocation';
import { usePlacesWidget } from 'react-google-autocomplete';
import { MAP_API_KEY } from '../../configs/app-global';
import { setMenuData } from '../../redux/slices/menu';
import { setOrderData } from '../../redux/slices/order';

export default function UserAddress({ uuid, handleCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual
  );
  const { google_map_key } = useSelector(
    (state) => state.globalSettings.settings,
    shallowEqual
  );
  const { data } = useSelector((state) => state.order, shallowEqual);

  const { ref } = usePlacesWidget({
    apiKey: google_map_key || MAP_API_KEY,
    onPlaceSelected: (place) => {
      const location = {
        lat: place?.geometry.location.lat(),
        lng: place?.geometry.location.lng(),
      };
      setLocation(location);
    },
  });

  const [location, setLocation] = useState(
    data.address
      ? { lat: data.address.lat, lng: data.address.lng }
      : getDefaultLocation(settings)
  );

  const onFinish = (values) => {
    const address = {
      ...values,
      active: 1,
      lat: location.lat,
      lng: location.lng,
    };
    dispatch(setOrderData({ address }));
    dispatch(
      setMenuData({
        activeMenu,
        data: {
          ...activeMenu.data,
          addressData: address,
        },
      })
    );
    handleCancel();
  };

  return (
    <Modal
      visible={!!uuid}
      title={t('create.address')}
      onCancel={handleCancel}
      footer={[
        <Button type='primary' key={'saveBtn'} onClick={() => form.submit()}>
          {t('save')}
        </Button>,
        <Button type='default' key={'cancelBtn'} onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form
        layout='vertical'
        name='user-address'
        form={form}
        onFinish={onFinish}
        initialValues={{ address: activeMenu?.data?.addressData?.address }}
      >
        <Form.Item
          name='address'
          label={t('address')}
          rules={[{ required: true, message: t('required') }]}
        >
          <input className='address-input' ref={ref} placeholder={''} />
        </Form.Item>
        <Form.Item label={t('map')}>
          <Map
            location={location}
            setLocation={setLocation}
            setAddress={(value) => form.setFieldsValue({ address: value })}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
