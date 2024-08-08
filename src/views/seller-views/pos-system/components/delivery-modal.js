import React, { useState } from 'react';
import { Button, Col, DatePicker, Form, Modal, Row, Select, Spin } from 'antd';
import { shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import orderService from '../../../../services/seller/order';
import transactionService from '../../../../services/transaction';
import { getCartData } from '../../../../redux/selectors/cartSelector';

export default function DeliveryModal({
  visibility,
  handleCancel,
  handleSave,
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { myShop: shop } = useSelector((state) => state.myShop, shallowEqual);
  const { cartShops, total, coupons, currency } = useSelector(
    (state) => state.cart,
    shallowEqual
  );
  const data = useSelector((state) => getCartData(state.cart));
  const { currencies } = useSelector((state) => state.currency, shallowEqual);
  const [form] = Form.useForm();

  const delivery = [
    {
      label: t('delivery'),
      value: 'delivery',
    },
    {
      label: t('pickup'),
      value: 'pickup',
    },
  ];

  const orderCreate = (body, paymentData) => {
    const payment = {
      payment_sys_id: paymentData.value,
    };
    setLoading(true);
    orderService
      .create(body)
      .then((response) => {
        createTransaction(response.data.id, payment);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  function createTransaction(id, data) {
    transactionService
      .create(id, data)
      .then((res) => {
        handleSave(res.data.id);
        form.resetFields();
      })
      .finally(() => setLoading(false));
  }

  const onFinish = (values) => {
    const body = {
      delivery_address_id: data.address.value,
      payment_type: data.paymentType.value,
      user_id: data.user?.value,
      shop_id: shop.id,
      delivery_date: moment(values?.delivery_date).format('YYYY-MM-DD'),
      delivery_time: values?.delivery_time.value,
      currency_id: currency.id,
      coupon: coupons.coupon,
      delivery_type_id: values?.delivery.value,
      tax: total.order_tax,
      total: total.order_total,
      rate: currencies.find((item) => item.id === currency.id)?.rate,
      products: cartShops[0].products?.map((product) => ({
        shop_product_id: product.id,
        price: product.price,
        qty: product.qty,
        tax: product.tax,
        discount: product.discount,
        total_price: product.total_price,
      })),
    };

    orderCreate(body, data.paymentType);
  };

  function getHours(shop) {
    let hours = [];
    const timeFrom = moment(shop.open_time, 'HH:mm').hour();
    const timeTo = moment(shop.close_time, 'HH:mm').hour();
    if (timeFrom === timeTo) {
      for (let index = 0; index < 24; index++) {
        const hour = {
          label: moment(index, 'HH').format('HH:mm'),
          value: moment(index, 'HH').format('HH:mm'),
        };
        hours.push(hour);
      }
      return hours;
    }
    for (let index = timeFrom + 1; index < timeTo; index++) {
      const hour = {
        label: moment(index, 'HH').format('HH:mm'),
        value: moment(index, 'HH').format('HH:mm'),
      };
      hours.push(hour);
    }
    return hours;
  }

  return (
    <Modal
      visible={visibility}
      title={t('shipping.info')}
      onCancel={handleCancel}
      footer={[
        <Button type='primary' onClick={() => form.submit()}>
          {t('save')}
        </Button>,
        <Button type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
      className='large-modal'
    >
      <Form form={form} layout='vertical' onFinish={onFinish}>
        {loading && (
          <div className='loader'>
            <Spin />
          </div>
        )}
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name='delivery'
              label={t('delivery')}
              rules={[{ required: true, message: t('required') }]}
            >
              <Select options={delivery} labelInValue />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name='delivery_date'
                  label={t('delivery.date')}
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <DatePicker
                    placeholder={t('delivery.date')}
                    className='w-100'
                    disabledDate={(current) =>
                      moment().add(-1, 'days') >= current
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={`${t('delivery.time')} (${t('up.to')})`}
                  name='delivery_time'
                  rules={[
                    {
                      required: false,
                      message: t('required'),
                    },
                  ]}
                >
                  <Select options={getHours(shop)} labelInValue />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
