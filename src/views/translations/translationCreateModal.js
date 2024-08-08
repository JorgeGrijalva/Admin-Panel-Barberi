import React, { useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import translationService from 'services/translation';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function TranslationCreateModal({
  visible,
  setVisible,
  languages,
  refetch,
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    setLoading(true);
    translationService
      .create(values)
      .then(() => {
        toast.success(t('successfully.created'));
        setVisible(false);
        refetch();
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      visible={visible}
      title={t('add.translation')}
      onCancel={handleCancel}
      footer={[
        <Button
          key='create-translation'
          type='primary'
          form='translation-form'
          htmlType='submit'
          loading={loading}
        >
          {t('create')}
        </Button>,
        <Button
          key='create-translation-cancel'
          type='default'
          onClick={handleCancel}
        >
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form
        id='translation-form'
        name='translation'
        layout='vertical'
        onFinish={onFinish}
        form={form}
        initialValues={{ group: 'web' }}
      >
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label={t('name')}
              name='key'
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value && value?.trim().length < 2) {
                      return Promise.reject(new Error(t('must.be.at.least.2')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('group')}
              name='group'
              rules={[{ required: true, message: '' }]}
            >
              <Select>
                <Select.Option value='web'>{t('web')}</Select.Option>
                <Select.Option value='mobile'>{t('mobile')}</Select.Option>
                <Select.Option value='errors'>{t('errors')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          {languages.map((item, index) => (
            <Col key={index} span={24}>
              <Form.Item
                label={`${t('translation')} (${item.locale})`}
                name={`value[${item.locale}]`}
                rules={[
                  {
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject(new Error(t('required')));
                      } else if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value && value?.trim().length < 2) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.2')),
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
}
