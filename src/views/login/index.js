import React, { useEffect, useState } from 'react';
import { data } from 'configs/menu-config';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  notification,
  Row,
  Typography,
} from 'antd';
import authService from 'services/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData, updateUser } from 'redux/slices/auth';
import { fetchRestSettings, fetchSettings } from 'redux/slices/globalSettings';
import { useTranslation } from 'react-i18next';
import { PROJECT_NAME } from 'configs/app-global';
import Recaptcha from 'components/recaptcha';
import { setMenu } from 'redux/slices/menu';
import serviceMasterService from 'services/master/serviceMaster';

const { Title } = Typography;

const credentials = [
  {
    login: 'owner@githubit.com',
    password: 'githubit',
  },
  {
    login: 'manager@githubit.com',
    password: 'manager',
  },
  {
    login: 'sellers@githubit.com',
    password: 'seller',
  },
  {
    login: 'moderator@githubit.com',
    password: 'moderator',
  },
  {
    login: 'delivery@githubit.com',
    password: 'delivery',
  },
  {
    login: 'master@githubit.com',
    password: 'master',
  },
];

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { settings } = useSelector((state) => state.globalSettings);
  const [recaptcha, setRecaptcha] = useState(null);
  const handleRecaptchaChange = (value) => {
    setRecaptcha(value);
  };
  const isDemo = Boolean(Number(settings?.is_demo));

  const handleLogin = (values) => {
    const body = {
      password: values.password,
    };
    if (values.email.includes('@')) {
      body.email = values.email;
    } else {
      body.phone = values.email.replace(/[^0-9]/g, '');
    }
    setLoading(true);
    authService
      .login(body)
      .then((res) => {
        const user = {
          fullName: res.data.user.firstname + ' ' + res.data.user.lastname,
          role: res.data.user.role,
          urls: data[res.data.user.role],
          img: res.data.user.img,
          token: res.data.access_token,
          email: res.data.user.email,
          id: res.data.user.id,
          shop_id: res.data.user?.shop?.id,
          walletId: res.data?.user?.wallet?.id,
        };
        if (user.role === 'waiter') {
          dispatch(
            setMenu({
              icon: 'user',
              id: 'orders-board',
              name: 'my.orders',
              url: 'waiter/orders-board',
            }),
          );
        }
        if (user.role === 'user') {
          notification.error({
            message: t('ERROR_101'),
          });
          return;
        }
        localStorage.setItem('token', res.data.access_token);
        dispatch(setUserData(user));
        if (user.role === 'master') {
          serviceMasterService
            .show(user.id)
            .then((res) => {
              dispatch(updateUser(res.data));
            })
            .catch((err) => {
              throw err;
            });
        }

        if (user.role === 'admin') {
          dispatch(fetchSettings());
        } else {
          dispatch(fetchRestSettings());
        }
      })
      .finally(() => setLoading(false));
  };

  const copyCredentials = (event, item) => {
    event.preventDefault();
    form.setFieldsValue({ email: item.login, password: item.password });
  };

  useEffect(() => {
    dispatch(fetchRestSettings());
  }, []);

  return (
    <div className='login-container'>
      <div className='container d-flex flex-column justify-content-center h-100 align-items-end'>
        <Row justify='center'>
          <Col>
            <Card className='card'>
              <div className='my-4 pl-4 pr-4 w-100'>
                <div className='app-brand text-center'>
                  <Title className='brand-logo'>
                    {settings.title || PROJECT_NAME}
                  </Title>
                </div>
                <Row justify='center'>
                  <Col>
                    <Form
                      name='login-form'
                      layout='vertical'
                      form={form}
                      onFinish={handleLogin}
                      style={{ width: '420px' }}
                    >
                      <Form.Item
                        name='email'
                        label='Email'
                        rules={[
                          {
                            required: true,
                            message: 'Please input your Email!',
                          },
                        ]}
                      >
                        <Input
                          prefix={
                            <MailOutlined className='site-form-item-icon' />
                          }
                          placeholder='Email or phone'
                        />
                      </Form.Item>
                      <Form.Item
                        name='password'
                        label='Password'
                        rules={[
                          {
                            required: true,
                            message: 'Please input your password!',
                          },
                        ]}
                      >
                        <Input.Password
                          prefix={
                            <LockOutlined className='site-form-item-icon' />
                          }
                          placeholder='Password'
                        />
                      </Form.Item>
                      <Recaptcha onChange={handleRecaptchaChange} />
                      <Form.Item className='login-input mt-4'>
                        <Button
                          type='primary'
                          htmlType='submit'
                          className='login-form-button'
                          loading={loading}
                          disabled={!Boolean(recaptcha)}
                        >
                          {t('Login')}
                        </Button>
                      </Form.Item>
                      {isDemo && (
                        <Descriptions bordered size='small'>
                          {credentials.map((item, idx) => (
                            <React.Fragment key={idx}>
                              <Descriptions.Item span={2} label={item.login}>
                                {item.password}
                              </Descriptions.Item>
                              <Descriptions.Item span={1}>
                                <a
                                  href='/'
                                  className='copy-link'
                                  onClick={(event) =>
                                    copyCredentials(event, item)
                                  }
                                >
                                  {t('Copy')}
                                </a>
                              </Descriptions.Item>
                            </React.Fragment>
                          ))}
                        </Descriptions>
                      )}
                      {!isDemo && process.env.REACT_APP_IS_DEMO === 'true' && (
                        <Descriptions size='small'>
                          <Descriptions.Item span={4} label='Login'>
                            {credentials[0].login}
                          </Descriptions.Item>
                          <Descriptions.Item span={4} label='Password'>
                            {credentials[0].password}
                          </Descriptions.Item>
                        </Descriptions>
                      )}
                    </Form>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default Login;
