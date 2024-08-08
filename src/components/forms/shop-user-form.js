import React from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const ShopUserForm = ({ prev, loadingBtn, error }) => {
  const { t } = useTranslation();
  return (
    <Row gutter={12}>
      <Col span={12}>
        <Form.Item
          label={t('firstname')}
          name='firstname'
          help={error?.firstname ? error.firstname[0] : null}
          validateStatus={error?.firstname ? 'error' : 'success'}
          rules={[{ required: true, message: t('required') }]}
        >
          <Input className='w-100' />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label={t('lastname')}
          name='lastname'
          help={error?.lastname ? error.lastname[0] : null}
          validateStatus={error?.lastname ? 'error' : 'success'}
          rules={[{ required: true, message: t('required') }]}
        >
          <Input className='w-100' />
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
          <Input type='email' className='w-100' />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label={t('password')}
          name='password'
          help={error?.password ? error.password[0] : null}
          validateStatus={error?.password ? 'error' : 'success'}
          rules={[
            { required: false, message: t('required') },
            {
              type: 'string',
              min: 6,
              message: t('min.6.letters'),
            },
          ]}
          normalize={(value) => (value?.trim() === '' ? value?.trim() : value)}
        >
          <Input.Password
            type='password'
            className='w-100'
            autoComplete='off'
          />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label={t('password.confirmation')}
          help={
            error?.password_confirmation ? error.password_confirmation[0] : null
          }
          validateStatus={error?.password_confirmation ? 'error' : 'success'}
          name='password_confirmation'
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: false,
              message: t('required'),
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(t('passwords.do.not.match'));
              },
            }),
          ]}
          normalize={(value) => (value?.trim() === '' ? value?.trim() : value)}
        >
          <Input.Password
            type='password'
            className='w-100'
            autoComplete='off'
          />
        </Form.Item>
      </Col>

      <Col span={24}>
        <Space>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('save')}
          </Button>
          <Button htmlType='submit' onClick={() => prev()}>
            {t('prev')}
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default ShopUserForm;
