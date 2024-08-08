import React, { useEffect, useState } from 'react';
import { Form, PageHeader, Row, Col, Button, Spin } from 'antd';

import UserInfo from './user-info';
import ProductInfo from './product-info';
import PreviewInfo from './preview-info';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import orderService from 'services/order';
import moment from 'moment';
import {
  clearOrder,
  setOrderCurrency,
  setOrderData,
  setOrderItems,
} from 'redux/slices/order';
import { useNavigate, useParams } from 'react-router-dom';
import getImageFromStock from 'helpers/getImageFromStock';
import { disableRefetch, removeFromMenu } from 'redux/slices/menu';
import { fetchOrders } from 'redux/slices/orders';
import { useTranslation } from 'react-i18next';
import transactionService from 'services/transaction';

export default function SellerOrderEdit() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadingBtn, setLoadingBtn] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { orderItems, data, total, coupon } = useSelector(
    (state) => state.order,
    shallowEqual,
  );
  const { currencies } = useSelector((state) => state.currency, shallowEqual);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  useEffect(() => {
    return () => {
      const formData = form.getFieldsValue(true);
      const data = {
        ...formData,
        deliveries: formData?.deliveries?.map((item) => ({
          ...item,
          delivery_date: item?.delivery_date
            ? moment(item?.delivery_date).format('YYYY-MM-DD')
            : undefined,
        })),
      };
      dispatch(setOrderData(data));
    };
  }, []);

  function formatUser(user) {
    return {
      label: `${user?.firstname || ''} ${user.lastname || ''}`,
      value: user?.id,
    };
  }
  function formatAddress(item) {
    if (!item) return null;
    return {
      label: item?.address,
      value: item?.id,
    };
  }
  function formatPayment(item) {
    if (!item) return null;
    return {
      label: item?.tag,
      value: item.id,
    };
  }

  function fetchOrder() {
    setLoading(true);
    orderService
      .getById(id)
      .then((res) => {
        const order = res.data;
        dispatch(setOrderCurrency(order.currency));
        const items = order.details?.map((el) => ({
          ...el.stock.product,
          ...el.stock,
          quantity: el.quantity,
          stock: el.stock,
          img: getImageFromStock(el.stock) || el.stock.product.img,
          product: undefined,
        }));
        dispatch(setOrderItems(items));
        form.setFieldsValue({
          user: formatUser(order.user),
          currency_id: order.currency.id,
          address: formatAddress(order.details[0].delivery_address),
          payment_type: formatPayment(order?.transaction?.payment_system),
          note: order.note,
        });
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  }

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchOrder();
    }
  }, [activeMenu.refetch]);

  function createTransaction(id, data) {
    transactionService
      .create(id, data)
      .then((res) => {
        setOrderId(res.data.id);
        dispatch(clearOrder());
      })
      .finally(() => setLoadingBtn(false));
  }

  const orderUpdate = (data, paymentId) => {
    const payment = {
      payment_sys_id: paymentId,
    };
    setLoadingBtn(true);
    orderService
      .update(id, data)
      .then((res) => createTransaction(res.data.id, payment))
      .catch(() => setLoadingBtn(false));
  };

  function formatProducts(list) {
    const addons = list?.map((item) => ({
      quantity: item.quantity,
      stock_id: item.stockID ? item.stockID?.id : item.stock?.id,
    }));

    const products = list?.flatMap((item) =>
      item.addons?.map((addon) => ({
        quantity: addon.quantity,
        stock_id: addon.stock_id,
        parent_id: item.stockID ? item.stockID?.id : item.stock?.id,
      })),
    );

    return addons.concat(products);
  }

  const onFinish = (values) => {
    const products = formatProducts(orderItems);
    const body = {
      currency_id: values.currency_id,
      rate: currencies.find((item) => item.id === values.currency_id)?.rate,
      // shop_id: data.shop.value,
      delivery_fee: data.delivery_fee,
      coupon: coupon.coupon,
      tax: total.order_tax,
      payment_type: values.payment_type?.label,
      note: values.note,
      delivery_date:
        moment(values.delivery_date).format('YYYY-MM-DD') +
        ' ' +
        moment(values.delivery_time).format('HH:mm'),
      user_id: values.user.value,
      products: products?.filter((item) => !!item),
      status: data?.status,
    };
    orderUpdate(body, values?.payment_type?.value);
  };

  const handleCloseInvoice = () => {
    setOrderId(null);
    const nextUrl = 'orders';
    dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
    navigate(`/${nextUrl}`);
    dispatch(fetchOrders());
  };

  return (
    <>
      <PageHeader
        title={t('edit.order')}
        extra={
          <Button
            type='primary'
            loading={loadingBtn}
            onClick={() => form.submit()}
          >
            {t('save')}
          </Button>
        }
      />
      <Form
        name='order-form'
        form={form}
        layout='vertical'
        onFinish={onFinish}
        className='order-add'
        initialValues={{
          user: data.user || null,
          address: data.address || null,
          currency_id: data.currency.id,
          payment_type: data.payment_type || null,
          note: data.note,
        }}
      >
        <Row gutter={24} hidden={loading}>
          <Col span={16}>
            <ProductInfo form={form} />
          </Col>
          <Col span={8}>
            <UserInfo form={form} />
          </Col>
        </Row>
        {loading && (
          <div className='loader'>
            <Spin />
          </div>
        )}
      </Form>
      {orderId ? (
        <PreviewInfo orderId={orderId} handleClose={handleCloseInvoice} />
      ) : (
        ''
      )}
    </>
  );
}
