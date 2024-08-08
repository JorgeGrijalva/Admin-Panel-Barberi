import React, { useState } from 'react';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import userService from '../../services/user';
import { useTranslation } from 'react-i18next';

export default function UserPassword() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { uuid } = useParams();

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      password: values.password ? values.password : undefined,
      password_confirmation: values.password_confirmation,
    };
    userService
      .updatePassword(uuid, body)
      .then(() => {
        toast.success(t('successfully.created'));
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Card title={t('user.password.change')}>
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label={t('password')}
              name='password'
              help={error?.password ? error.password[0] : null}
              validateStatus={error?.password ? 'error' : 'success'}
              rules={[{ required: true, message: t('required') }]}
            >
              <Input.Password
                type='password'
                className='w-100'
                placeholder='********'
              />
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
              <Input.Password type='password' placeholder='********' />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Button type='primary' htmlType='submit' loading={loadingBtn}>
              {t('save')}
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
