import React from 'react';
import { Card, Form } from 'antd';
import FormDeliveryman from './form';
import { useTranslation } from 'react-i18next';
import sellerUserServices from 'services/seller/user';

function AddDeliveryman() {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = (body) => {
    return sellerUserServices.create(body);
  };

  return (
    <Card title={t('add.deliveryman')}>
      <FormDeliveryman handleSubmit={handleSubmit} form={form} />
    </Card>
  );
}

export default AddDeliveryman;
