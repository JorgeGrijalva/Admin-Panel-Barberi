import React from 'react';
import { Card, Form } from 'antd';
import FormMaster from './form';
import { useTranslation } from 'react-i18next';
import sellerUserServices from 'services/seller/user';

export default function AddMasterInvitation() {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = (body) => {
    return sellerUserServices.create(body);
  };

  return (
    <Card title={t('add.master')}>
      <FormMaster form={form} handleSubmit={handleSubmit} />
    </Card>
  );
}
