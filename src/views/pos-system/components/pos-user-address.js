import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'antd';
import { shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Map from 'components/map';
import getDefaultLocation from 'helpers/getDefaultLocation';
import AddressForm from 'components/forms/address-form';

export default function PosUserAddress({ uuid, handleCancel, parentForm }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { currentBag } = useSelector((state) => state.cart, shallowEqual);
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual,
  );
  const { defaultLang } = useSelector((state) => state.formLang, shallowEqual);
  const parentFormValues = parentForm.getFieldsValue();
  const [location, setLocation] = useState(
    parentFormValues.location?.latitude
      ? {
          lat: parentFormValues.location?.latitude,
          lng: parentFormValues.location?.longitude,
        }
      : getDefaultLocation(settings),
  );

  const [value, setValue] = useState(parentFormValues?.address?.address);

  const onFinish = (values) => {
    const body = {
      address: { address: values?.[`address[${defaultLang}]`] },
      location: {
        latitude: location.lat,
        longitude: location.lng,
      },
    };
    parentForm.setFieldsValue(body);
    handleCancel();
  };

  useEffect(() => {
    form.setFieldsValue({
      address: parentFormValues.address.address || null,
    });
  }, [currentBag]);

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
        initialValues={{
          [`address[${defaultLang}]`]: parentFormValues.address.address,
        }}
      >
        <AddressForm
          value={value}
          setValue={setValue}
          setLocation={setLocation}
        />
        <Form.Item label={t('map')}>
          <Map
            location={location}
            setLocation={setLocation}
            setAddress={(value) =>
              form.setFieldsValue({ [`address[${defaultLang}]`]: value })
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
