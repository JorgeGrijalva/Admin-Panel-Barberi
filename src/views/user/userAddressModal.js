import React, { useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import userService from '../../services/user';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Map from '../../components/map';
import { setRefetch } from '../../redux/slices/menu';
import getDefaultLocation from '../../helpers/getDefaultLocation';

export default function UserAddressModal({ uuid, handleCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual
  );
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(getDefaultLocation(settings));

  function createAddress(uuid, body) {
    setLoading(true);
    userService
      .createAddress(uuid, body)
      .then(() => {
        toast.success(t('successfully.created'));
        dispatch(setRefetch(activeMenu));
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
          rules={[{ required: true, message: t('required') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='address'
          label={t('address')}
          rules={[{ required: true, message: t('required') }]}
        >
          <Input />
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
