import React, { useState } from 'react';
import { Button, Form, Input, Typography, Space, Row, Col } from 'antd';
import { useDispatch } from 'react-redux';
import { setUserData } from 'redux/slices/auth';
import { fetchSettings, fetchRestSettings } from 'redux/slices/globalSettings';
import { useTranslation } from 'react-i18next';
import authService from 'services/auth';
import BarberiLogo from 'assets/icons/logo.webp';
import { notification } from 'antd';
import { setMenu } from 'redux/slices/menu';
import { LeftOutlined } from '@ant-design/icons';
import { Typography as AntTypography } from 'antd';

const { Title, Text, Link } = AntTypography;

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = (values) => {
    setLoading(true);
    const body = {
      password: values.password,
      email: values.email.includes('@') ? values.email : undefined,
      phone: !values.email.includes('@') ? values.email.replace(/[^0-9]/g, '') : undefined,
    };

    authService
      .login(body)
      .then((res) => {
        const user = {
          fullName: res.data.user.firstname + ' ' + res.data.user.lastname,
          role: res.data.user.role,
          urls: res.data[res.data.user.role],
          img: res.data.user.img,
          token: res.data.access_token,
          email: res.data.user.email,
          id: res.data.user.id,
          shop_id: res.data.user?.shop?.id,
          walletId: res.data?.user?.wallet?.id,
        };

        if (user.role === 'waiter') {
          dispatch(setMenu({
            icon: 'user',
            id: 'orders-board',
            name: 'my.orders',
            url: 'waiter/orders-board',
          }));
        }

        if (user.role === 'user') {
          notification.error({ message: t('ERROR_101') });
          return;
        }

        localStorage.setItem('token', res.data.access_token);
        dispatch(setUserData(user));

        if (user.role === 'admin') {
          dispatch(fetchSettings());
        } else {
          dispatch(fetchRestSettings());
        }
      })
      .catch((err) => {
        notification.error({
          message: t('Error de inicio de sesión'),
          description: err.message,
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className='login-container'>
      <div className='login-content'>
        <div className='back-button'>
          <Link href='https://barberi.app/for-business'>
            <LeftOutlined /> {t('Volver')}
          </Link>
        </div>
        <div className='login-form'>
          <Title level={2}>{t('Barberi para profesionales')}</Title>
          <Text className='subtitle'>{t('Crea una cuenta o inicia sesión para gestionar tu negocio.')}</Text>
          
          <Form
            name='login-form'
            form={form}
            onFinish={handleLogin}
            layout='vertical'
          >
            <Form.Item
              name='email'
              rules={[{ required: true, message: t('Por favor ingresa tu email') }]}
            >
              <Input 
                placeholder={t('Introduce tu email')}
                size='large'
              />
            </Form.Item>
            
            <Form.Item
              name='password'
              rules={[{ required: true, message: t('Por favor ingresa tu contraseña') }]}
            >
              <Input.Password
                placeholder={t('Introduce tu contraseña')}
                size='large'
              />
            </Form.Item>
            
            <Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Button
                    type='primary'
                    htmlType='submit'
                    className='login-form-button'
                    size='large'
                    loading={loading}
                    block
                  >
                    {t('Iniciar sesión')}
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type='default'
                    className='create-account-button'
                    size='large'
                    block
                    onClick={() => {
                      window.location.href = 'https://barberi.app/sign-up';
                      }}
                  >
                    {t('Crear cuenta')}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>

          <div className='client-link'>
            <Text>{t('¿Eres cliente y quieres reservar una cita?')}</Text>
            <br />
            <Link href='https://barberi.app/' className='client-button'>{t('Ir a Barberi para clientes')}</Link>
          </div>
        </div>
        <div className='footer'>
          <img src={BarberiLogo} alt="Barberi Logo" className='app-brand' />
          <Space>
            <Link href='https://barberi.app/faq'>{t('Ayuda')}</Link>
            <Link href='https://barberi.app/privacy'>{t('Política de Privacidad')}</Link>
          </Space>
        </div>
      </div>
      <div className='login-background'></div>
    </div>
  );
};

export default Login;
