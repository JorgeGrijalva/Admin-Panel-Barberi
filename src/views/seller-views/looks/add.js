import React from 'react';
import { Form } from 'antd';
import LooksForm from './form';
import getTranslationFields from 'helpers/getTranslationFields';
import { shallowEqual, useSelector } from 'react-redux';
import sellerLooksService from 'services/seller/banner';

export default function AddLook() {
  const [form] = Form.useForm();
  const { languages } = useSelector((state) => state.formLang, shallowEqual);

  const handleSubmit = (values, image) => {
    const body = {
      type: 'look',
      active: Number(values.active),
      title: getTranslationFields(languages, values, 'title'),
      description: getTranslationFields(languages, values, 'description'),
      products: values.products.map((i) => i.value),
      images: image.map((image) => image.name),
    };

    return sellerLooksService.create(body);
  };

  return <LooksForm form={form} handleSubmit={handleSubmit} />;
}
