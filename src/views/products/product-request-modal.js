import React, { useState } from 'react';
import { Modal, Form, Col, Row, Input, Button } from 'antd';
import { useTranslation } from 'react-i18next';

export default function ProductRequestModal({
  data,
  handleCancel,
  handleOk,
  visible,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    const params = { ...values, status: 'canceled' };
    handleOk(params);
  };

  return (
    <Modal
      title={t(data.title)}
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button type='primary' onClick={() => form.submit()} loading={loading}>
          {t('save')}
        </Button>,
        <Button type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form layout='vertical' onFinish={onFinish} form={form}>
        <Form.Item>
          <Row className='mt-4'>
            <Col span={24}>
              <Form.Item
                name='status_note'
                label={t('note')}
                rules={[
                  {
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject(new Error(t('required')));
                      } else if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value && value?.trim().length < 2) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.2'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input.TextArea maxLength={250} showCount />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
}
