import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
} from 'antd';
import { useTranslation } from 'react-i18next';
import smsService from '../../services/smsPayloads';
import { fetchSms } from '../../redux/slices/sms-geteways';
import { shallowEqual, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { disableRefetch, removeFromMenu } from '../../redux/slices/menu';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '../../components/loading';
const options = [
  { title: 'firebase', value: 'firebase' },
  { title: 'twilio', value: 'twilio' },
];

export default function SmsPayloadEdit() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { type } = useParams();
  const [typeList, setTypeList] = useState(null);
  const { smsGatewaysList } = useSelector((state) => state.sms, shallowEqual);

  const fetchSmsPayload = (type) => {
    setLoading(true);
    smsService
      .getById(type)
      .then((res) => {
        console.log('res', res.data);
        const data = res.data;
        form.setFieldsValue({
          default: Boolean(data.default),
          ...data.payload,
        });
        setTypeList(data.type);
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  const onFinish = (values) => {
    setLoadingBtn(true);
    const data = {
      type: typeList,
      default: Number(values.default),
      payload: {
        type: undefined,
        default: undefined,
        ...values,
      },
    };
    const nextUrl = 'settings/sms-payload';
    smsService
      .update(type, data)
      .then(() => {
        dispatch(fetchSms());
        toast.success(t('successfully.updated'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchSmsPayload(type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu.refetch]);

  const handleChange = (value) => setTypeList(value);

  return (
    <Card title={t('edit.sms.payload')} className='h-100'>
      {loading ? (
        <Loading />
      ) : (
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <Card title={t('add.sms.payload')}>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  label={t('select.type')}
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <Select
                    disabled
                    className='w-100'
                    onChange={handleChange}
                    value={typeList}
                    options={options.filter(
                      (i) => !smsGatewaysList.some((e) => e.type === i.value)
                    )}
                  />
                </Form.Item>
              </Col>

              {type === 'firebase' && (
                <>
                  <Col span={12}>
                    <Form.Item
                      label={t('android_api_key')}
                      name='android_api_key'
                      rules={[
                        {
                          required: true,
                          message: t('required'),
                        },
                      ]}
                    >
                      <Input className='w-100' />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={t('api_key')}
                      name='api_key'
                      rules={[
                        {
                          required: true,
                          message: t('required'),
                        },
                      ]}
                    >
                      <Input className='w-100' />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={t('app_id')}
                      name='app_id'
                      rules={[
                        {
                          required: true,
                          message: t('required'),
                        },
                      ]}
                    >
                      <Input className='w-100' />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={t('auth_domain')}
                      name='auth_domain'
                      rules={[
                        {
                          required: true,
                          message: t('required'),
                        },
                      ]}
                    >
                      <Input className='w-100' />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={t('ios_api_key')}
                      name='ios_api_key'
                      rules={[
                        {
                          required: true,
                          message: t('required'),
                        },
                      ]}
                    >
                      <Input className='w-100' />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={t('measurement_id')}
                      name='measurement_id'
                      rules={[
                        {
                          required: true,
                          message: t('required'),
                        },
                      ]}
                    >
                      <Input className='w-100' />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={t('message_sender_id')}
                      name='message_sender_id'
                      rules={[
                        {
                          required: true,
                          message: t('required'),
                        },
                      ]}
                    >
                      <Input className='w-100' />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={t('project_id')}
                      name='project_id'
                      rules={[
                        {
                          required: true,
                          message: t('required'),
                        },
                      ]}
                    >
                      <Input className='w-100' />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={t('server_key')}
                      name='server_key'
                      rules={[
                        {
                          required: true,
                          message: t('required'),
                        },
                      ]}
                    >
                      <Input className='w-100' />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={t('storage_bucket')}
                      name='storage_bucket'
                      rules={[
                        {
                          required: true,
                          message: t('required'),
                        },
                      ]}
                    >
                      <Input className='w-100' />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={t('vapid_key')}
                      name='vapid_key'
                      rules={[
                        {
                          required: true,
                          message: t('required'),
                        },
                      ]}
                    >
                      <Input className='w-100' />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={t('default')}
                      name='default'
                      valuePropName='checked'
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </>
              )}

              {type === 'twilio' && (
                <>
                  <Col span={12}>
                    <Form.Item
                      label={t('twilio_auth_token')}
                      name='twilio_auth_token'
                      rules={[
                        {
                          required: true,
                          message: t('required'),
                        },
                      ]}
                    >
                      <Input min={0} className='w-100' />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={t('twilio_account_id')}
                      name='twilio_account_id'
                      rules={[
                        {
                          required: true,
                          message: t('required'),
                        },
                      ]}
                    >
                      <Input className='w-100' />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={t('twilio_number')}
                      name='twilio_number'
                      rules={[
                        {
                          required: true,
                          message: t('required'),
                        },
                      ]}
                    >
                      <Input className='w-100' />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={t('default')}
                      name='default'
                      valuePropName='checked'
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>

            <Space>
              <Button type='primary' htmlType='submit' loading={loadingBtn}>
                {t('submit')}
              </Button>
            </Space>
          </Card>
        </Form>
      )}
    </Card>
  );
}
