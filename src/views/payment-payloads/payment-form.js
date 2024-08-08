import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Select, Spin, Switch } from 'antd';
import { AsyncSelect } from '../../components/async-select';
import currencyService from '../../services/currency';
import i18n from '../../configs/i18next';
import MediaUpload from '../../components/upload';
import { shallowEqual, useSelector } from 'react-redux';

export default function PaymentPayloadForm({ form, handleSubmit }) {
  const { languages } = useSelector((state) => state.formLang, shallowEqual);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  //states
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [image, setImage] = useState(
    activeMenu.data?.image ? [activeMenu.data?.image] : [],
  );

  //state submit
  const onFinish = (values) => {
    setLoadingBtn(true);
    handleSubmit(values, image).finally(() => setLoadingBtn(false));
  };
  return (
    <Form layout='vertical' name='user-address' form={form} onFinish={onFinish}>
      <Row gutter={12}>
        <Col
          span={
            activePayment?.label === 'Cash' || activePayment?.label === 'Wallet'
              ? 12
              : 24
          }
        >
          <Form.Item
            label={t('payment')}
            name='payment_id'
            rules={[
              {
                required: true,
                message: t('required'),
              },
            ]}
          >
            <Select
              notFoundContent={loading ? <Spin size='small' /> : 'no results'}
              allowClear
              options={paymentList}
              onSelect={handleChangePayment}
            />
          </Form.Item>
        </Col>

        {activePayment?.label === 'Cash' ||
        activePayment?.label === 'Wallet' ? (
          ''
        ) : (
          <>
            <Col span={24} className='d-flex justify-content-center mt-4 mb-5'>
              {handleAddIcon(activePayment?.label)}
            </Col>
            {activePayment?.label === 'Paystack' ? (
              <>
                <Col span={12}>
                  <Form.Item
                    label={t('paystack.pk')}
                    name='paystack_pk'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('paystack.sk')}
                    name='paystack_sk'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>{' '}
                <Col span={12}>
                  <Form.Item
                    label={t('currency')}
                    name='currency'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <AsyncSelect
                      placeholder={t('select.currency')}
                      valuePropName='label'
                      defaultValue={{
                        value: defaultCurrency.id,
                        label: defaultCurrency.title,
                      }}
                      fetchOptions={() =>
                        currencyService.getAll().then(({ data }) => {
                          return data
                            .filter((item) => item.active)
                            .map((item) => ({
                              value: item.id,
                              label: `${item.title}`,
                              key: item.id,
                            }));
                        })
                      }
                    />
                  </Form.Item>
                </Col>
              </>
            ) : activePayment?.label === 'Paypal' ? (
              <>
                <Col span={12}>
                  <Form.Item
                    label={t('paypal.mode')}
                    name='paypal_mode'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Select
                      options={[
                        { value: 'live', label: t('live') },
                        { value: 'sandbox', label: t('sandbox') },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('paypal.sandbox.client.id')}
                    name='paypal_sandbox_client_id'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('paypal.sandbox.client.secret')}
                    name='paypal_sandbox_client_secret'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('paypal.sandbox.app.id')}
                    name='paypal_sandbox_app_id'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('paypal.live.client.id')}
                    name='paypal_live_client_id'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('paypal.live.client.secret')}
                    name='paypal_live_client_secret'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('paypal.live.app.id')}
                    name='paypal_live_app_id'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('paypal.payment.action')}
                    name='paypal_payment_action'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Select
                      options={[
                        { value: 'Sale', label: t('sale') },
                        { value: 'Order', label: t('order') },
                        { value: 'Authorization', label: t('authorization') },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('paypal.currency')}
                    name='paypal_currency'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <AsyncSelect
                      placeholder={t('select.currency')}
                      valuePropName='label'
                      defaultValue={{
                        value: defaultCurrency.id,
                        label: defaultCurrency.title,
                      }}
                      fetchOptions={() =>
                        currencyService.getAll().then(({ data }) => {
                          return data
                            .filter((item) => item.active)
                            .map((item) => ({
                              value: item.id,
                              label: `${item.title}`,
                              key: item.id,
                            }));
                        })
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('paypal.locale')}
                    name='paypal_locale'
                    rules={[{ required: true, message: t('required') }]}
                    valuePropName='value'
                  >
                    <Select
                      placeholder={t('select.locale')}
                      defaultValue={{
                        label: languages.find(
                          (item) => item.locale === i18n.language,
                        )?.title,
                        value: i18n.language,
                      }}
                      options={languages?.map((lang) => ({
                        value: lang.locale,
                        label: lang.locale,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('paypal.validate.ssl')}
                    name='paypal_validate_ssl'
                    valuePropName='checked'
                  >
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
              </>
            ) : activePayment?.label === 'Stripe' ? (
              <>
                <Col span={12}>
                  <Form.Item
                    label={t('stripe.pk')}
                    name='stripe_pk'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('stripe.sk')}
                    name='stripe_sk'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>{' '}
                <Col span={12}>
                  <Form.Item
                    label={t('currency')}
                    name='currency'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <AsyncSelect
                      placeholder={t('select.currency')}
                      valuePropName='label'
                      defaultValue={{
                        value: defaultCurrency.id,
                        label: defaultCurrency.title,
                      }}
                      fetchOptions={() =>
                        currencyService.getAll().then(({ data }) => {
                          return data
                            .filter((item) => item.active)
                            .map((item) => ({
                              value: item.id,
                              label: `${item.title}`,
                              key: item.id,
                            }));
                        })
                      }
                    />
                  </Form.Item>
                </Col>
              </>
            ) : activePayment?.label === 'Razorpay' ? (
              <>
                <Col span={12}>
                  <Form.Item
                    label={t('razorpay.key')}
                    name='razorpay_key'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('razorpay.secret')}
                    name='razorpay_secret'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>{' '}
                <Col span={12}>
                  <Form.Item
                    label={t('currency')}
                    name='currency'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <AsyncSelect
                      placeholder={t('select.currency')}
                      valuePropName='label'
                      defaultValue={{
                        value: defaultCurrency.id,
                        label: defaultCurrency.title,
                      }}
                      fetchOptions={() =>
                        currencyService.getAll().then(({ data }) => {
                          return data
                            .filter((item) => item.active)
                            .map((item) => ({
                              value: item.id,
                              label: `${item.title}`,
                              key: item.id,
                            }));
                        })
                      }
                    />
                  </Form.Item>
                </Col>
              </>
            ) : activePayment?.label === 'FlutterWave' ? (
              <>
                <Col span={12}>
                  <Form.Item
                    label={t('payload.title')}
                    name='title'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('payload.description')}
                    name='description'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('flw_pk')}
                    name='flw_pk'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('flw_sk')}
                    name='flw_sk'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>{' '}
                <Col span={12}>
                  <Form.Item
                    label={t('key')}
                    name='key'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('currency')}
                    name='currency'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <AsyncSelect
                      placeholder={t('select.currency')}
                      valuePropName='label'
                      defaultValue={{
                        value: defaultCurrency.id,
                        label: defaultCurrency.title,
                      }}
                      fetchOptions={() =>
                        currencyService.getAll().then(({ data }) => {
                          return data
                            .filter((item) => item.active)
                            .map((item) => ({
                              value: item.id,
                              label: `${item.title}`,
                              key: item.id,
                            }));
                        })
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item rules={[{ required: true }]} label={t('logo')}>
                    <MediaUpload
                      type='brands'
                      imageList={image}
                      setImageList={setImage}
                      form={form}
                      multiple={false}
                    />
                  </Form.Item>
                </Col>
              </>
            ) : null}
          </>
        )}
      </Row>
      <div className='flex-grow-1 d-flex flex-column justify-content-end'>
        <div className='pb-5'>
          <Button
            type='primary'
            htmlType='submit'
            loading={loadingBtn}
            disabled={loadingBtn}
          >
            {t('submit')}
          </Button>
        </div>
      </div>
    </Form>
  );
}
