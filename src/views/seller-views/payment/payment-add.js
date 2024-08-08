import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Switch,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { removeFromMenu, setRefetch } from '../../../redux/slices/menu';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { fetchSellerPayments } from '../../../redux/slices/payment';
import paymentService from '../../../services/seller/payment';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Paystack from '../../../assets/images/paystack.svg';
import { FaPaypal } from 'react-icons/fa';
import { SiStripe, SiRazorpay } from 'react-icons/si';

export default function SellerPaymentAdd() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentList, setPaymentList] = useState([]);
  const [activePayment, setActivePayment] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoadingBtn(true);
    paymentService
      .create(values)
      .then(() => {
        const nextUrl = 'seller/payments';
        toast.success(t('successfully.created'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(fetchSellerPayments());
        dispatch(setRefetch(activeMenu));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingBtn(false));
  };

  async function fetchPayment() {
    setLoading(true);
    return paymentService
      .allPayment()
      .then(({ data }) => {
        const body = data.map((item) => ({
          label: item.tag[0].toUpperCase() + item.tag.substring(1),
          value: item.id,
          key: item.id,
        }));
        setPaymentList(body);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchPayment();
  }, []);

  const handleAddIcon = (data) => {
    switch (data) {
      case 'Paypal':
        return <FaPaypal size={80} />;
      case 'Stripe':
        return <SiStripe size={80} />;
      case 'Razorpay':
        return <SiRazorpay size={80} />;
      case 'Paystack':
        return <img src={Paystack} alt='img' width='80' height='80' />;
    }
  };

  return (
    <Card title={t('add.payment')} className='h-100'>
      <Form
        layout='vertical'
        name='user-address'
        form={form}
        onFinish={onFinish}
        initialValues={{ status: true }}
      >
        <Row gutter={12}>
          <Col
            span={
              activePayment?.label === 'Cash' ||
              activePayment?.label === 'Wallet'
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
                onSelect={(e) =>
                  setActivePayment(
                    paymentList.find((payment) => payment.value === e)
                  )
                }
              />
            </Form.Item>
          </Col>

          {activePayment?.label === 'Cash' ||
          activePayment?.label === 'Wallet' ? (
            ''
          ) : (
            <>
              <Col span={12}>
                <Form.Item
                  label={t('client.id')}
                  name={'client_id'}
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('secret.id')}
                  name={'secret_id'}
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              {activePayment?.label === 'Paystack' ? (
                <>
                  <Col span={12}>
                    <Form.Item
                      label={t('payment.id')}
                      name={'payment_key'}
                      rules={[
                        {
                          required: true,
                          message: t('required'),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={t('merchant.email')}
                      name={'merchant_email'}
                      rules={[
                        {
                          required: true,
                          message: t('required'),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </>
              ) : (
                ''
              )}
            </>
          )}
          <Col span={12}>
            <Form.Item
              label={t('status')}
              name='status'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
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
    </Card>
  );
}
