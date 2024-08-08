import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Modal, Row, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Paystack from '../../assets/images/paystack.svg';
import { FaPaypal } from 'react-icons/fa';
import { SiStripe, SiRazorpay } from 'react-icons/si';
import { AiOutlineWallet } from 'react-icons/ai';
import restPaymentService from '../../services/rest/payment';
import { BsCoin } from 'react-icons/bs';

export default function PaymentPartnersConfirmation({
  open,
  onCancel,
  onConfirm,
  isPaying,
}) {
  const { t } = useTranslation();
  const [paymentType, setPaymentType] = useState({});
  const [paymentData, setPaymentData] = useState(null);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  async function fetchPaymentList() {
    setPaymentsLoading(true);
    return restPaymentService
      .getAll()
      .then(({ data }) =>
        setPaymentData(
          data.map((item) => ({
            label: item.tag || 'no name',
            value: item.id,
            key: item.id,
          }))
        )
      )
      .finally(() => {
        setPaymentsLoading(false);
      });
  }

  useEffect(() => {
    fetchPaymentList();
  }, []);

  const handleSubmit = () => {
    if (!paymentType.value) {
      toast.warning(t('please.select.payment.type'));
      return;
    }
    onConfirm(paymentType.value);
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
      default:
        return <BsCoin size={80} />;
    }
  };

  return (
    <Modal
      visible={open}
      title={t('pay.to.partner')}
      onCancel={onCancel}
      footer={[
        <Button
          type='primary'
          disabled={paymentsLoading || !paymentType.value}
          key='save-btn'
          loading={isPaying}
          onClick={handleSubmit}
        >
          {t('confirm')}
        </Button>,
        <Button type='default' onClick={onCancel} key='cancel-btn'>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Spin spinning={paymentsLoading}>
        <Row gutter={12}>
          {paymentData?.map((item, index) =>
            item.label === 'cash' || item.label === 'wallet' ? (
              <Col span={12} key={index}>
                <Card
                  style={{ display: 'flex', justifyContent: 'center' }}
                  className={`payment-card ${
                    paymentType?.label === item.label ? 'active' : ''
                  }`}
                  onClick={() => selectPayment(item)}
                >
                  <div className='payment-icon'>
                    {handleAddIcon(item?.label)}
                  </div>
                  <div className='font-weight-bold mt-2 text-center'>
                    {t(item?.label)}
                  </div>
                </Card>
              </Col>
            ) : null
          )}
        </Row>
      </Spin>
    </Modal>
  );
}
