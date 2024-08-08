import React, { useState } from 'react';
import { Form, Input, Card, Row, Col, Button } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import installationService from '../../services/installation';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../redux/slices/auth';
import { data } from '../../configs/menu-config';

export default function UserInfo() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onFinish = (values) => {
    setLoading(true);
    installationService
      .createAdmin(values)
      .then((res) => {
        const user = {
          fullName: res.data.user.firstname + ' ' + res.data.user.lastname,
          role: res.data.user.role,
          urls: data[res.data.user.role],
          img: '',
          token: res.data.access_token,
          email: res.data.user.email,
          id: res.data.user.id,
        };
        dispatch(setUserData(user));
        localStorage.setItem('token', res.data.access_token);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card
      title='User info'
      extra={<p>Fill admin credentials</p>}
      className='w-100'
    >
      <Form form={form} onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label='First name'
              name='firstname'
              rules={[{ required: true, message: 'Missing user firstname' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='Last name'
              name='lastname'
              rules={[{ required: true, message: 'Missing user lastname' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='Email'
              name='email'
              rules={[{ required: true, message: 'Missing user email' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='Phone'
              name='phone'
              rules={[{ required: true, message: 'Missing user phone' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='Password'
              name='password'
              rules={[{ required: true, message: 'Missing password' }]}
            >
              <Input.Password
                id='password'
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item
              label='Password confirmation'
              name='password_confirmation'
              rules={[
                { required: true, message: 'Missing password confirmation' },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Password does not match!');
                  },
                }),
              ]}
            >
              <Input.Password
                id='password_confirmation'
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Button
          type='primary'
          htmlType='submit'
          loading={loading}
          className='mt-4'
        >
          Submit
        </Button>
      </Form>
    </Card>
  );
}
