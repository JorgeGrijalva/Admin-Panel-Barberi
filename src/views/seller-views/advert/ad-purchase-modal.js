import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { fetchRestPayments } from 'redux/slices/payment';
import { toast } from 'react-toastify';
import subscriptionService from 'services/seller/subscriptions';
import paymentService from 'services/seller/payment';
import { fetchMyShop } from 'redux/slices/myShop';
import { AiOutlineWallet } from 'react-icons/ai';
import { FaPaypal } from 'react-icons/fa';
import { SiRazorpay, SiStripe } from 'react-icons/si';
import Paystack from 'assets/images/paystack.svg';
import { Button, Card, Col, Modal, Row } from 'antd';
import Loading from 'components/loading';
import advertService from 'services/seller/advert';
import { fetchShopAdverts } from 'redux/slices/advert';

export default function AdPurchaseModal({ buyingAd, handleCancel }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.myShop.myShop, shallowEqual);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [paymentType, setPaymentType] = useState({});

  const { payments, loading } = useSelector(
    (state) => state.payment,
    shallowEqual,
  );

  useEffect(() => {
    dispatch(fetchRestPayments({}));
  }, []);

  console.log('buyingAd', buyingAd);

  const handleSubmit = () => {
    if (!paymentType.id) {
      toast.warning(t('please.select.payment.type'));
      return;
    }
    // ! for wallet
    if (paymentType.tag === 'wallet') {
      if (seller?.wallet?.price < buyingAd.ads_package.price) {
        toast.warning(t('insufficient.balance'));
        return;
      }
      return advertService
        .purchase(buyingAd.id, { payment_sys_id: paymentType?.id })
        .then(() => {
          toast.success(t('purchased.successfully'));
        })
        .finally(() => {
          dispatch(fetchShopAdverts({}));
          setLoadingBtn(false);
        });
    }
    // ! for any other payment type
    externalPay();
  };

  const externalPay = () => {
    setLoadingBtn(true);
    paymentService
      .payExternal(paymentType.tag, {
        ads_package_id: buyingAd.ads_package_id,
      })
      .then(({ data }) => {
        window.location.replace(data?.data?.url);
        handleCancel();
        // toast.success(t('successfully.purchased'));
        dispatch(fetchMyShop({}));
      })
      .finally(() => setLoadingBtn(false));
  };

  function transactionCreate(id) {
    const payload = {
      payment_sys_id: paymentType.id,
    };
    subscriptionService
      .transactionCreate(id, payload)
      .then(() => {
        handleCancel();
        toast.success(t('successfully.purchased'));
        dispatch(fetchMyShop({}));
      })
      .finally(() => setLoadingBtn(false));
  }

  const selectPayment = (type) => {
    // if (!acceptedPayments.includes(type.tag)) {
    //   toast.warning(t('cannot.work.demo'));
    //   return;
    // }
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
        return <AiOutlineWallet size={80} />;
    }
  };

  return (
    <Modal
      visible={!!buyingAd}
      title={t('purchase.ad')}
      onCancel={handleCancel}
      footer={[
        <Button
          type='primary'
          onClick={handleSubmit}
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
        <Row gutter={12}>
          {payments
            ?.filter((item) => item?.tag !== 'cash')
            ?.map((item, index) => (
              <Col span={8} key={index}>
                <Card
                  className={`payment-card ${
                    paymentType?.tag === item.tag ? 'active' : ''
                  }`}
                  onClick={() => selectPayment(item)}
                >
                  <div className='payment-icon'>{handleAddIcon(item?.tag)}</div>
                  <div className='font-weight-bold mt-2'>{t(item?.tag)}</div>
                </Card>
              </Col>
            ))}
        </Row>
      ) : (
        <Loading />
      )}
    </Modal>
  );
}
