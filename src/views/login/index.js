import React, { useState } from 'react';
import { Button, Form, Input, Typography, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { setUserData } from 'redux/slices/auth';
import { fetchSettings, fetchRestSettings } from 'redux/slices/globalSettings';
import { useTranslation } from 'react-i18next';
import authService from 'services/auth';
import { notification } from 'antd';
import { setMenu } from 'redux/slices/menu';
import { LeftOutlined } from '@ant-design/icons';
import BarberiLogo from 'assets/icons/logo.webp';

const { Title, Text, Link } = Typography;

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
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      <div className="bg-white p-8 flex flex-col justify-between w-full md:w-2/5 h-full">
        <div className="mb-4">
          <Link href="https://barberi.app/for-business" className="flex items-center text-black hover:text-gray-700">
            <LeftOutlined className="mr-2 " /> {t('Volver')}
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <Title level={2} className="text-2xl font-bold text-center">{t('Barberi para profesionales')}</Title>
          <Text className="text-lg mb-8 text-center">{t('Crea una cuenta o inicia sesión para gestionar tu negocio.')}</Text>
          <Form
            name="login-form"
            form={form}
            onFinish={handleLogin}
            layout="vertical"
            className="w-full max-w-md"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: t('Por favor ingresa tu email') }]}
            >
              <Input 
                placeholder={t('Introduce tu email')}
                size="large"
                className="rounded"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: t('Por favor ingresa tu contraseña') }]}
            >
              <Input.Password
                placeholder={t('Introduce tu contraseña')}
                size="large"
                className="rounded"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="default"
                htmlType="submit"
                className="w-full bg-black border-black hover:bg-gray-800 hover:border-gray-800 text-black rounded invert"
                size="large"
                loading={loading}
              >
                {t('Iniciar sesión')}
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="default"
                className="w-full bg-white border-black text-black hover:bg-gray-100 hover:border-gray-800 rounded"
                size="large"
                onClick={() => {
                  window.location.href = 'https://barberi.app/sign-up';
                }}
              >
                {t('Crear cuenta')}
              </Button>
            </Form.Item>
          </Form>
          <div className="mt-8 text-center">
            <Text>{t('¿Eres cliente y quieres reservar una cita?')}</Text>
            <br />
            <Link href="https://barberi.app/" className="text-blue-500 hover:text-blue-700">{t('Ir a Barberi para clientes')}</Link>
          </div>
        </div>
        <div className="mt-8 text-center">
          <img 
            src={BarberiLogo} 
            alt="Barberi Logo" 
            className="mx-auto mb-4"
            style={{ maxWidth: '100px', maxHeight: '35px' }}
          />
          <div className="flex flex-col items-center gap-2">
            <a href="https://barberi.app/terms" className="text-gray-600 hover:text-gray-800">Términos y condiciones</a>
            <a href="https://barberi.app/privacy" className="text-gray-600 hover:text-gray-800">Política de privacidad</a>
            <a href="https://barberi.app/contact" className="text-gray-600 hover:text-gray-800">Contacto</a>
          </div>
          <div className="text-gray-600 mt-4">© 2024 Barberi. Todos los derechos reservados.</div>
        </div>
      </div>
      <div className="flex-1 bg-cover bg-center min-h-screen" style={{ backgroundImage: 'url(/img/login.jpg)' }}></div>
    </div>
  );
};

export default Login;
