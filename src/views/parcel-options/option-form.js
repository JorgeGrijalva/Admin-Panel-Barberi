import { Button, Card, Col, Form, Input, Row } from 'antd';
import LanguageList from 'components/language-list';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

export default function ParcelOptionForm({ data, onFinish, isSubmitting }) {
  const { t } = useTranslation();
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );
  const [form] = Form.useForm();
  function getLanguageFields(data) {
    if (!data) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.title,
    }));
    return Object.assign({}, ...result);
  }
  return (
    <Card
      title={!!data ? t('edit.option') : t('add.option')}
      extra={<LanguageList />}
    >
      <Form form={form} layout='vertical' onFinish={onFinish} initialValues={{...getLanguageFields(data)}}>
        <Row gutter={12}>
          <Col span={24}>
            {languages.map((item) => (
              <Form.Item
                key={'title' + item.locale}
                label={t('title')}
                name={`title[${item.locale}]`}
                rules={[
                  {
                    required: item.locale === defaultLang,
                    message: t('requried'),
                  },
                ]}
                hidden={item.locale !== defaultLang}
              >
                <Input />
              </Form.Item>
            ))}
          </Col>
          <Col span={4}>
            <Button htmlType='submit' type="primary" loading={isSubmitting}>{t('save')}</Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
