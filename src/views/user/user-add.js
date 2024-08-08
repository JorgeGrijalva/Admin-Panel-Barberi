import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { batch, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu, setMenuData } from '../../redux/slices/menu';
import userService from '../../services/user';
import { fetchClients } from '../../redux/slices/client';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import MediaUpload from '../../components/upload';

export default function UserAdd() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const navigate = useNavigate();

  const activeMenu = useSelector((list) => list.menu.activeMenu);
  const dispatch = useDispatch();
  const [image, setImage] = useState(
    activeMenu?.data?.image ? [activeMenu?.data?.image] : [],
  );

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      data.birthday = JSON.stringify(data?.birthday);
      dispatch(
        setMenuData({ activeMenu, data: { ...activeMenu.data, ...data } }),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.user_email,
      phone: values.phone,
      birthday: moment(values.birthday).format('YYYY-MM-DD'),
      gender: values.gender,
      password_confirmation: values.password_confirmation,
      password: values.password,
      images: image[0] ? [image[0]?.name] : undefined,
    };
    const nextUrl = 'users/user';
    userService
      .create(body)
      .then(() => {
        toast.success(t('successfully.created'));
        batch(() => {
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          dispatch(fetchClients({}));
        });
        navigate(`/${nextUrl}`);
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  };

  const getInitialTimes = () => {
    if (!activeMenu.data?.birthday) {
      return {};
    }
    const birthday = JSON.parse(activeMenu.data?.birthday);
    return {
      birthday: moment(birthday),
    };
  };

  return (
    <Card title={t('add.user')}>
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          gender: 'male',
          ...activeMenu.data,
          ...getInitialTimes(),
        }}
        onFinish={onFinish}
      >
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              rules={[
                {
                  validator() {
                    if (image?.length === 0) {
                      return Promise.reject(new Error(t('required')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              label={t('avatar')}
              name='images'
            >
              <MediaUpload
                type='users'
                imageList={image}
                setImageList={setImage}
                form={form}
                multiple={false}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t('firstname')}
              name='firstname'
              help={error?.firstname ? error.firstname[0] : null}
              validateStatus={error?.firstname ? 'error' : 'success'}
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value && value?.trim().length < 2) {
                      return Promise.reject(new Error(t('must.be.at.least.2')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
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
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value && value?.trim().length < 2) {
                      return Promise.reject(new Error(t('must.be.at.least.2')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
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
              label={t('birthday')}
              name='birthday'
              rules={[{ required: true, message: t('required') }]}
            >
              <DatePicker
                className='w-100'
                disabledDate={(current) =>
                  moment().add(-18, 'years') <= current
                }
                defaultPickerValue={moment().add(-18, 'years')}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t('gender')}
              name='gender'
              rules={[{ required: true, message: t('required') }]}
            >
              <Select picker='dayTime' className='w-100'>
                <Select.Option value='male'>{t('male')}</Select.Option>
                <Select.Option value='female'>{t('female')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t('email')}
              name='user_email'
              help={error?.email ? error.email[0] : null}
              validateStatus={error?.email ? 'error' : 'success'}
              rules={[
                { required: true, message: t('required') },
                {
                  type: 'email',
                  message: t('invalid.email'),
                },
              ]}
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
              rules={[
                { required: true, message: t('required') },
                {
                  validator(_, value) {
                    if (value && value?.toString().length < 6) {
                      return Promise.reject(new Error(t('min.6.letters')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              normalize={(value) =>
                value?.trim() === '' ? value?.trim() : value
              }
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
              normalize={(value) =>
                value?.trim() === '' ? value?.trim() : value
              }
            >
              <Input.Password type='password' />
            </Form.Item>
          </Col>

          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Card>
  );
}
