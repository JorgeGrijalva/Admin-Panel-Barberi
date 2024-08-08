import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, InputNumber, Modal, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { fetchRestPayments } from '../../../redux/slices/payment';
import Loading from '../../../components/loading';
import { toast } from 'react-toastify';
import Paystack from '../../../assets/images/paystack.svg';
import { FaPaypal } from 'react-icons/fa';
import { SiStripe, SiRazorpay } from 'react-icons/si';
import { AiOutlineWallet } from 'react-icons/ai';
import restPaymentService from '../../../services/rest/payment';
import walletService from 'services/seller/wallet';

export default function WalletTopUp({ open, handleCancel, refetch }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { payments, loading } = useSelector(
    (state) => state.payment,
    shallowEqual,
  );
  const { myShop: shop } = useSelector((state) => state.myShop, shallowEqual);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const walletId = useSelector((state) => state.auth.user.walledId);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [paymentType, setPaymentType] = useState({});
  const [paymentData, setPaymentData] = useState(null);
  const [paymentData2, setPaymentData2] = useState(null);

  const { payment_type } = useSelector(
    (state) => state.globalSettings.settings,
    shallowEqual,
  );
  const [form] = Form.useForm();

  async function fetchSellerPaymentList() {
    return await restPaymentService.getById(shop.id).then(({ data }) =>
      setPaymentData(
        data.map((item) => ({
          label: item.payment.tag || 'no name',
          value: item.payment.id,
          key: item.payment.id,
        })),
      ),
    );
  }

  async function fetchPaymentList() {
    return restPaymentService.getAll().then(({ data }) =>
      setPaymentData2(
        data.map((item) => ({
          label: item.tag || 'no name',
          value: item.id,
          key: item.id,
        })),
      ),
    );
  }

  useEffect(() => {
    if (!payments.length) {
      dispatch(fetchRestPayments());
    }
    fetchSellerPaymentList();
    fetchPaymentList().then();
  }, []);

  const handleSubmit = (values) => {
    if (!paymentType.value) {
      toast.warning(t('please.select.payment.type'));
      return;
    }

    const data = {
      wallet_id: walletId,
      total_price: values.price,
      currency_id: defaultCurrency?.id,
    };

    setLoadingBtn(true);
    walletService
      .topUp(paymentType.label, data)
      .then(({ data }) => {
        form.resetFields();
        setPaymentType({});
        handleCancel();
        refetch();
        window.open(data.data.url);
      })
      .finally(() => setLoadingBtn(false));
  };

  const selectPayment = (type) => {
    setPaymentType(type);
  };

  const handleAddIcon = (data) => {
    switch (data) {
      case 'wallet':
        return <AiOutlineWallet size={80} />;
      case 'paypal':
        return <FaPaypal size={80} />;
      case 'stripe':
        return <SiStripe size={80} />;
      case 'razorpay':
        return <SiRazorpay size={80} />;
      case 'paystack':
        return <img src={Paystack} alt='img' width='80' height='80' />;
    }
  };

  return (
    <Modal
      visible={open}
      title={t('wallet.topup')}
      onCancel={handleCancel}
      footer={[
        <Button
          type='primary'
          disabled={loading}
          htmlType='submit'
          form='payment'
          loading={loadingBtn}
          key='save-btn'
        >
          {t('save')}
        </Button>,
        <Button type='default' onClick={handleCancel} key='cancel-btn'>
          {t('cancel')}
        </Button>,
      ]}
    >
      {!loading ? (
        <Form layout='vertical' id='payment' onFinish={handleSubmit}>
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                name='price'
                label={t('price')}
                rules={[
                  { required: true, message: t('required') },
                  {
                    type: 'number',
                    min: 0,
                    message: t('should.be.greater.than.0'),
                  },
                ]}
              >
                <InputNumber className='w-100' />
              </Form.Item>
            </Col>
            {(payment_type === 'admin' ? paymentData2 : paymentData)
              ?.filter(
                (item) => item?.label !== 'cash' && item?.label !== 'wallet',
              )
              ?.map((item, index) => (
                <Col span={8} key={index}>
                  <Card
                    className={`payment-card ${
                      paymentType?.label === item.label ? 'active' : ''
                    }`}
                    onClick={() => selectPayment(item)}
                  >
                    <div className='payment-icon'>
                      {handleAddIcon(item?.label)}
                    </div>
                    <div className='font-weight-bold mt-2'>
                      {t(item?.label)}
                    </div>
                  </Card>
                </Col>
              ))}
          </Row>
        </Form>
      ) : (
        <Loading />
      )}
    </Modal>
  );
}
