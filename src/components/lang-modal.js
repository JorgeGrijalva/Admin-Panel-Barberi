import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import i18n from '../configs/i18next';
import informationService from '../services/rest/information';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { directionChange } from '../redux/slices/theme';
import { setLangugages } from '../redux/slices/formLang';
import languagesService from '../services/languages';

export default function LangModal({ visible, handleCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { languages } = useSelector((state) => state.formLang, shallowEqual);
  const dispatch = useDispatch();

  const onFinish = (values) => {
    const { lang } = values;
    const locale = languages.find((item) => item.locale === lang);
    const direction = locale.backward ? 'rtl' : 'ltr';
    setLoading(true);
    informationService
      .translations(values)
      .then(({ data }) => {
        i18n.addResourceBundle(lang, 'translation', data);
        handleCancel();
        i18n.changeLanguage(lang);
        dispatch(directionChange(direction));
      })
      .finally(() => setLoading(false));
  };

  const fetchLanguages = () => {
    languagesService.getAllActive().then(({ data }) => {
      dispatch(setLangugages(data));
    });
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return (
    <Modal
      title={t('change.language')}
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button
          key='ok-button'
          type='primary'
          onClick={() => form.submit()}
          loading={loading}
        >
          {t('save')}
        </Button>,
        <Button key='cancel-button' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form
        layout='vertical'
        name='lang-form'
        form={form}
        onFinish={onFinish}
        initialValues={{ lang: i18n.language }}
      >
        <Form.Item label={t('language')} name='lang'>
          <Select>
            {languages.map((item, idx) => (
              <Select.Option key={item.locale + idx} value={item.locale}>
                {item.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
