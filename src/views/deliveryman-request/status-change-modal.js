import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Modal, Row, Col, Select, Input } from 'antd';

const statuses = ['pending', 'approved', 'canceled'];

export default function StatusChangeModal({ data, handleClose, handleChange }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(data?.status);

  const onFinish = (values) => {
    setLoading(true);
    handleChange(data?.id, values).finally(() => setLoading(false));
  };

  return (
    <>
      <Modal
        title={t('status.change')}
        visible={!!data}
        onCancel={handleClose}
        footer={
          <>
            <Button type='default' onClick={handleClose}>
              {t('cancel')}
            </Button>
            <Button
              type='primary'
              onClick={() => form.submit()}
              loading={loading}
            >
              {t('save')}
            </Button>
          </>
        }
      >
        <Form
          form={form}
          layout={'vertical'}
          onFinish={onFinish}
          initialValues={{ status: data?.status }}
        >
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                label={t('status')}
                name={'status'}
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                ]}
              >
                <Select onChange={(status) => setStatus(status)}>
                  {statuses.map((item, idx) => (
                    <Select.Option key={item + idx} value={item}>
                      {t(item)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {status === 'canceled' ? (
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
                            new Error(t('must.be.at.least.2')),
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input.TextArea maxLength={250} showCount />
                </Form.Item>
              ) : (
                ''
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
