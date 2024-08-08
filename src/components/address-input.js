import { Form } from 'antd';
import React from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import { MAP_API_KEY } from '../configs/app-global';

export default function AddressInput({
  setLocation,
  form,
  item,
  idx,
  defaultLang,
}) {
  const { t } = useTranslation();
  const { google_map_key } = useSelector(
    (state) => state.globalSettings.settings,
    shallowEqual
  );

  const { ref } = usePlacesWidget({
    apiKey: google_map_key || MAP_API_KEY,
    onPlaceSelected: (place) => {
      const location = {
        lat: place?.geometry.location.lat(),
        lng: place?.geometry.location.lng(),
      };
      setLocation(location);
      form.setFieldsValue({
        [`address[${defaultLang}]`]: place?.formatted_address,
      });
    },
  });

  return (
    <Form.Item
      key={'address' + idx}
      label={t('address')}
      name={`address[${item?.locale}]`}
      rules={[
        {
          required: item?.locale === defaultLang,
          message: t('required'),
        },
      ]}
      hidden={item?.locale !== defaultLang}
    >
      <input className='address-input' ref={ref} placeholder={''} />
    </Form.Item>
  );
}
