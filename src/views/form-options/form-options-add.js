import FormOptionContextProvider from './form-option-context';
import FormOptionsForm from './form-options-form';
import formOptionService from '../../services/form-option';
import { Card, Form } from 'antd';
import LanguageList from '../../components/language-list';
import React from 'react';
import { useTranslation } from 'react-i18next';

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
    console.log('body', body);
    return formOptionService.create(body);
  };

  return (
    <Card title={t('add.form.options')} extra={<LanguageList />}>
      <FormOptionsForm onSubmit={handleSubmit} form={form} isCreating />
    </Card>
  );
}

export default Component;
