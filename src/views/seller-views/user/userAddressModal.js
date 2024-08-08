import React, { useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import userService from '../../../services/seller/user';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Map from '../../../components/map';
import getDefaultLocation from '../../../helpers/getDefaultLocation';
import AddressInput from '../../../components/address-input';
import AddressInputLocale from '../../../components/address-input-locale';

export default function UserAddressModal({ uuid, handleCancel, refetch }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual
  );
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(getDefaultLocation(settings));

  function createAddress(uuid, body) {
    setLoading(true);
    userService
      .addUserAddress(uuid, body)
      .then(() => {
        toast.success(t('successfully.added'));
        refetch(true);
        handleCancel();
      })
      .finally(() => setLoading(false));
  }

  const onFinish = (values) => {
    const body = {
      ...values,
      active: 1,
      location: `${location.lat}, ${location.lng}`,
    };
    createAddress(uuid, body);
  };

  return (
    <Modal
      visible={!!uuid}
      title={t('create.address')}
      onCancel={handleCancel}
      footer={[
        <Button
          type='primary'
          key={'saveBtn'}
          onClick={() => form.submit()}
          loading={loading}
        >
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
      >
        <Form.Item
          name='title'
          label={t('title')}
          rules={[{ required: true, message: 'required' }]}
        >
          <Input />
        </Form.Item>

        <AddressInputLocale setLocation={setLocation} form={form} />

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
