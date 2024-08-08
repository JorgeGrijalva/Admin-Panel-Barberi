import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
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
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  disableRefetch,
  removeFromMenu,
  setMenuData,
} from '../../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import paymentService from '../../../services/seller/payment';
import { fetchSellerPayments } from '../../../redux/slices/payment';
import Paystack from '../../../assets/images/paystack.svg';
import { FaPaypal } from 'react-icons/fa';
import { SiStripe, SiRazorpay } from 'react-icons/si';

const SellerPaymentEdit = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentList, setPaymentList] = useState([]);
  const [activePayment, setActivePayment] = useState(null);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const getPayment = (id) => {
    setLoading(true);
    paymentService
      .getById(id)
      .then(({ data }) => {
        setActivePayment({
          label: data.payment.tag,
          value: data.payment.id,
        });
        form.setFieldsValue({
          ...data,
          payment_id: data.payment.tag,
        });
      })
      .finally(() => dispatch(disableRefetch(activeMenu)));
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

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      ...values,
      payment_id: activePayment.value,
    };
    paymentService
      .update(id, body)
      .then(() => {
        const nextUrl = 'seller/payments';
        toast.success(t('successfully.updated'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(fetchSellerPayments());
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      getPayment(id);
      fetchPayment();
    }
  }, [activeMenu.refetch]);

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
    <Card title={t('edit.payment')} className='h-100'>
      {!loading ? (
        <Form
          name='edit.payment'
          layout='vertical'
          onFinish={onFinish}
          form={form}
          initialValues={{ status: true, ...activeMenu.data }}
          className='d-flex flex-column h-100'
        >
          <Row gutter={12}>
            <Col
              span={
                activePayment?.label === 'cash' ||
                activePayment?.label === 'wallet'
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
                  notFoundContent={
                    loading ? <Spin size='small' /> : 'no results'
                  }
                  allowClear
                  disabled
                />
              </Form.Item>
            </Col>

            {activePayment?.label === 'cash' ||
            activePayment?.label === 'wallet' ? (
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
                        <Input type='email' />
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
      ) : (
        <div className='d-flex justify-content-center align-items-center'>
          <Spin size='large' className='py-5' />
        </div>
      )}
    </Card>
  );
};

export default SellerPaymentEdit;
