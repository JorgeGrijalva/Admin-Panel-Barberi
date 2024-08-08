import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import userService from '../../services/user';
import { toast } from 'react-toastify';
import { removeFromMenu } from '../../redux/slices/menu';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/loading';
import useDemo from '../../helpers/useDemo';

export default function UserEdit({ prev }) {
  const { isDemo } = useDemo();
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  console.log(isDemo);

  const showUserData = (uuid) => {
    setLoading(true);
    userService
      .getById(uuid)
      .then((res) => {
        const data = res.data;
        form.setFieldsValue({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          phone: data.phone,
          password_confirmation: data.password_confirmation,
          password: data.password,
        });
      })
      .finally(() => setLoading(false));
  };

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      phone: values.phone,
      password_confirmation: values.password_confirmation,
      password: values.password,
    };
    const nextUrl = 'restaurants';
    userService
      .update(activeMenu?.data?.seller?.uuid, body)
      .then(() => {
        toast.success(t('successfully.updated'));
        navigate(`/${nextUrl}`);
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu?.data) {
      showUserData(activeMenu?.data?.seller?.uuid);
    }
  }, []);

  return (
    <>
      {!loading ? (
        <Form
          form={form}
          layout='vertical'
          initialValues={{
            gender: 'male',
            role: 'admin',
            ...activeMenu.data,
            birthday: activeMenu.data?.birthday
              ? moment(activeMenu.data.birthday)
              : null,
          }}
          onFinish={onFinish}
          className='py-4'
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={t('firstname')}
                name='firstname'
                help={error?.firstname ? error.firstname[0] : null}
                validateStatus={error?.firstname ? 'error' : 'success'}
                rules={[{ required: false, message: t('required') }]}
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
                rules={[{ required: false, message: t('required') }]}
              >
                <Input className='w-100' />
              </Form.Item>
            </Col>

            {isDemo || (
              <>
                <Col span={12}>
                  <Form.Item
                    label={t('phone')}
                    name='phone'
                    help={error?.phone ? error.phone[0] : null}
                    validateStatus={error?.phone ? 'error' : 'success'}
                    rules={[{ required: false, message: t('required') }]}
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
                    rules={[{ required: false, message: t('required') }]}
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
                  >
                    <Input.Password
                      type='password'
                      className='w-100'
                      autoComplete='off'
                    />
                  </Form.Item>
                </Col>
              </>
            )}

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
        </Form>
      ) : (
        <Loading />
      )}
    </>
  );
}
