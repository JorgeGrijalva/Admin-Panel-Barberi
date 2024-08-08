import FormOptionContextProvider from './form-option-context';
import { useTranslation } from 'react-i18next';
import { Card, Form } from 'antd';
import FormOptionsForm from './form-options-form';
import React from 'react';
import sellerFormOptionService from '../../../services/seller/form-option';
import LanguageList from '../../../components/language-list';

function Component() {
  return (
    <FormOptionContextProvider>
      <AddForm />
    </FormOptionContextProvider>
  );
}

function AddForm() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const handleSubmit = (body) => {
    return sellerFormOptionService.create(body);
  };

  return (
    <Card title={t('add.form.options')} extra={<LanguageList />}>
      <FormOptionsForm onSubmit={handleSubmit} form={form} isCreating />
    </Card>
  );
}

export default Component;
