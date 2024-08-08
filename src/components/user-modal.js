import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from 'antd';
import { useTranslation } from 'react-i18next';
import userService from '../services/user';
import Loading from './loading';
import moment from 'moment';
import createImage from '../helpers/createImage';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../redux/slices/auth';
import useDemo from '../helpers/useDemo';
import MediaUpload from './upload';
import LanguageList from './language-list';
import TextArea from 'antd/es/input/TextArea';

export default function UserModal({ visible, handleCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { defaultLang, languages } = useSelector((state) => state.formLang);
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [data, setData] = useState({});
  const [image, setImage] = useState([]);
  const [error, setError] = useState(null);
  const { isDemo, demoDeliveryman, demoSeller } = useDemo();

  function getLanguageFields(data) {
    if (!data?.translations) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.title,
      [`description[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.description,
      [`address[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.address,
    }));
    return Object.assign({}, ...result);
  }

  function fetchProfile() {
    setLoading(true);
    userService
      .profileShow()
      .then((res) => {
        const obj = {
          ...res.data,
          ...getLanguageFields(res.data),
          birthday: moment(res.data.birthday),
        };
        setImage(res.data.img ? [createImage(res.data.img)] : []);
        setData(obj);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const onFinish = (values) => {
    const payload = {
      images: image[0] ? [image[0]?.name] : undefined,
      firstname: values.firstname,
      lastname: values.lastname,
      phone: values.phone,
      email: values.email,
      birthday: moment(values.birthday).format('YYYY-MM-DD'),
      gender: values.gender,
      password: values.password,
      password_confirmation: values.password_confirmation,
    };

    if (data.role === 'master') {
      payload.title = {};
      payload.description = {};
      languages.forEach((language) => {
        const lang = language.locale;
        payload.title[lang] = values[`title[${lang}]`];
        payload.description[lang] = values[`description[${lang}]`];
      });
    }
    setLoadingBtn(true);
    userService
      .profileUpdate(payload)
      .then((res) => {
        dispatch(updateUser(res.data));
        handleCancel();
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Modal
      title={t('edit.profile')}
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button
          key='ok-button'
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
          disabled={
            (isDemo && data?.id == demoDeliveryman) ||
            (isDemo && data?.id == demoSeller) ||
            (isDemo && data?.role === 'admin')
          }
        >
          {t('save')}
        </Button>,
        <Button key='cancel-button' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      {!loading ? (
        <>
          {data.role === 'master' ? (
            <div className='flex justify-content-end'>
              <LanguageList />
            </div>
          ) : null}
          <Form
            layout='vertical'
            name='lang-form'
            form={form}
            onFinish={onFinish}
            initialValues={{ ...data }}
          >
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item label={t('avatar')}>
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
                  rules={[{ required: true, message: t('required') }]}
                >
                  <Input />
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
                  <InputNumber min={0} className='w-100' disabled={isDemo} />
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
                  <Input type='email' disabled={isDemo} />
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
                    placeholder=''
                    disabledDate={(current) =>
                      moment().add(-1, 'days') <= current
                    }
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
              {data.role === 'master' && (
                <>
                  <Col span={12}>
                    {languages.map((item, idx) => (
                      <Form.Item
                        key={'title' + idx}
                        label={t('title')}
                        name={`title[${item.locale}]`}
                        rules={[
                          {
                            validator(_, value) {
                              if (!value && item?.locale === defaultLang) {
                                return Promise.reject(new Error(t('required')));
                              } else if (value && value?.trim() === '') {
                                return Promise.reject(
                                  new Error(t('no.empty.space')),
                                );
                              } else if (value && value?.length < 2) {
                                return Promise.reject(
                                  new Error(t('must.be.at.least.2')),
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                        hidden={item.locale !== defaultLang}
                      >
                        <Input />
                      </Form.Item>
                    ))}
                  </Col>
                  <Col span={12}>
                    {languages.map((item, idx) => (
                      <Form.Item
                        key={'desc' + idx}
                        label={t('description')}
                        name={`description[${item.locale}]`}
                        rules={[
                          {
                            validator(_, value) {
                              if (!value && item?.locale === defaultLang) {
                                return Promise.reject(new Error(t('required')));
                              } else if (value && value?.trim() === '') {
                                return Promise.reject(
                                  new Error(t('no.empty.space')),
                                );
                              } else if (value && value?.length < 5) {
                                return Promise.reject(
                                  new Error(t('must.be.at.least.5')),
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                        hidden={item.locale !== defaultLang}
                      >
                        <TextArea rows={4} />
                      </Form.Item>
                    ))}
                  </Col>
                </>
              )}
              <Col span={12}>
                <Form.Item
                  label={t('password')}
                  name='password'
                  help={error?.password ? error.password[0] : null}
                  validateStatus={error?.password ? 'error' : 'success'}
                  rules={[{ required: false, message: t('required') }]}
                >
                  <Input
                    autocomplete='new-password'
                    type='password'
                    className='w-100'
                    disabled={isDemo}
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
                        return Promise.reject(t('two.passwords.dont.match'));
                      },
                    }),
                  ]}
                >
                  <Input
                    autocomplete='new-password'
                    type='password'
                    disabled={isDemo}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      ) : (
        <Loading />
      )}
    </Modal>
  );
}
