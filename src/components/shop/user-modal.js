import React, { useState } from 'react';
import { Button, Col, Form, Input, InputNumber, Modal, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import userService from '../../services/user';

export default function UserModal({ visible, handleCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = (values) => {
    const payload = {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      phone: values.phone,
      password_confirmation: values.password_confirmation,
      password: values.password,
      role: 'user',
    };
    setLoadingBtn(true);
    userService
      .create(payload)
      .then(() => {
        toast.success(t('successfully.added'));
        handleCancel();
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Modal
      title={t('add.client')}
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button
          key='ok-button'
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
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
        name='user-add-form'
        form={form}
        onFinish={onFinish}
      >
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label={t('firstname')}
              name='firstname'
              help={error?.firstname ? error.firstname[0] : null}
              validateStatus={error?.firstname ? 'error' : 'success'}
              rules={[{ required: true, message: t('required') }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={'lastname'}
              name='lastname'
              help={error?.lastname ? error.lastname[0] : null}
              validateStatus={error?.lastname ? 'error' : 'success'}
              rules={[{ required: true, message: t('required') }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t('phone')}
              name='phone'
              help={error?.phone ? error.phone[0] : null}
              validateStatus={error?.phone ? 'error' : 'success'}
              rules={[{ required: true, message: t('required') }]}
            >
              <InputNumber min={0} className='w-100' />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t('email')}
              name='email'
              help={error?.email ? error.email[0] : null}
              validateStatus={error?.email ? 'error' : 'success'}
              rules={[{ required: true, message: t('required') }]}
            >
              <Input type='email' />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t('password')}
              name='password'
              help={error?.password ? error.password[0] : null}
              validateStatus={error?.password ? 'error' : 'success'}
              rules={[{ required: true, message: t('required') }]}
            >
              <Input.Password type='password' className='w-100' />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t('password.confirmation')}
              help={
                error?.password_confirmation
                  ? error.password_confirmation[0]
                  : null
              }
              validateStatus={
                error?.password_confirmation ? 'error' : 'success'
              }
              name='password_confirmation'
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(t('two.passwords.dont.match'));
                  },
                }),
              ]}
            >
              <Input.Password type='password' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
