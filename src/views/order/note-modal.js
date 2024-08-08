import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col, Input, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

const { TextArea } = Input;

export default function NoteModal({
  showModal,
  setShowModal,
  handleSubmit,
  userData,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { before_order_phone_required } = useSelector(
    (state) => state.globalSettings.settings,
    shallowEqual,
  );

  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    handleSubmit(values).finally(() => setLoading(false));
  };

  return (
    <Modal
      visible={showModal}
      title={t('note')}
      onCancel={() => setShowModal(false)}
      footer={[
        <Button
          key={'submit-modal'}
          type='primary'
          onClick={() => form.submit()}
          loading={loading}
        >
          {t('submit')}
        </Button>,
        <Button
          key={'cancel-modal'}
          type='default'
          onClick={() => setShowModal(null)}
        >
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout={'vertical'}
        onFinish={onFinish}
        initialValues={{ phone: userData?.phone }}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              label={t('note')}
              name='note'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
                {
                  validator(_, value) {
                    if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value && value?.trim().length < 3) {
                      return Promise.reject(new Error(t('must.be.at.least.3')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <TextArea rows={4} className={'w-100'} />
            </Form.Item>
          </Col>
          {before_order_phone_required === '1' && (
            <Col span={24}>
              <Form.Item
                label={t('phone.number')}
                name='phone'
                rules={[
                  { required: true, message: t('required') },
                  {
                    validator(_, value) {
                      if (value < 0) {
                        return Promise.reject(new Error(t('must.be.positive')));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  className='w-100'
                  addonBefore={'+'}
                  parser={(value) => parseInt(value, 10)}
                  disabled={!!userData?.phone}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </Modal>
  );
}
