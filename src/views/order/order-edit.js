import React, { useEffect, useState } from 'react';
import { Button, Col, Form, PageHeader, Row, Spin } from 'antd';

import UserInfo from './user-info';
import DeliveryInfo from './delivery-info';
import ProductInfo from './product-info';
import PreviewInfo from './preview-info';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import orderService from 'services/order';
import moment from 'moment';
import {
  clearOrder,
  setOrderCurrency,
  setOrderData,
  setOrderItems,
  setOrderProducts,
  setOrderTotal,
} from 'redux/slices/order';
import { useNavigate, useParams } from 'react-router-dom';
import { disableRefetch, removeFromMenu, setMenuData } from 'redux/slices/menu';
import { fetchOrders } from 'redux/slices/orders';
import { useTranslation } from 'react-i18next';
import transactionService from 'services/transaction';
import TransactionDetails from './transaction-details';

export default function OrderEdit() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadingBtn, setLoadingBtn] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data, total, orderProducts, orderItems } = useSelector(
    (state) => state.order,
    shallowEqual,
  );
  const { currencies } = useSelector((state) => state.currency, shallowEqual);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  function formatUser(user) {
    return {
      label: user.firstname + ' ' + (user.lastname || ''),
      value: user.id,
      uuid: user.uuid,
      key: user.id,
    };
  }

  function fetchOrder() {
    setLoading(true);
    orderService
      .getById(id)
      .then((res) => {
        const order = res.data;

        const calculate = true;
        dispatch(setOrderData({ calculate }));
        const items = order.details.map((item) => ({
          ...item?.stock?.product,
          stocks: item?.stock?.extras,
          stock: item?.stock,
          stockID: item?.stock,
          quantity: item?.quantity,
          img: item?.stock?.product?.img,
          price: item?.stock?.price,
          bonus: item?.bonus,
          addons: item?.addons,
        }));
        const orderData = {
          product_tax: order?.details
            ?.flatMap((e) => e?.total_price)
            ?.reduce((sum, e) => sum + e, 0),
          shop_tax: order?.tax,
          order_total: order?.total_price,
        };
        batch(() => {
          dispatch(setOrderProducts(items));
          dispatch(setOrderItems(items));
          dispatch(setOrderTotal(orderData));
          dispatch(setOrderCurrency(order?.currency));
          dispatch(
            setMenuData({
              activeMenu,
              data: {
                ...activeMenu.data,
                addressData: {
                  address: order?.address?.address,
                  lat: order?.location?.latitude,
                  lng: order?.location?.longitude,
                },
              },
            }),
          );
          dispatch(
            setOrderData({
              userUuid: order?.user?.uuid,
              shop: getFirstShopFromList(order?.shop),
              delivery_type: order?.delivery_type,
              delivery_fee: order?.delivery_fee,
              delivery_date: JSON.stringify(order?.delivery_date),
              delivery_time: order?.delivery_time,
              address: {
                address: order?.address?.address,
                lat: order?.location?.latitude,
                lng: order?.location?.longitude,
              },
              currency: { id: order?.currency.payment_system },
              payment_type: order?.transaction,
              deliveries: { label: order?.delivery_type },
              status: order?.status,
            }),
          );
        });
        form.setFieldsValue({
          delivery_time: moment(order?.delivery_date, 'HH:mm'),
          delivery_date: moment(order?.delivery_date, 'YYYY-MM-DD'),
          user: formatUser(order?.user),
          currency_id: order?.currency?.id,
          payment_type: {
            label: order?.transaction?.payment_system?.tag || 'cash',
            value: order?.transaction?.payment_system?.id || 1,
          },
          note: order?.note,
          delivery: {
            label: order?.delivery_type,
            value: order?.shop?.price,
          },
          transactionStatus: order.transaction.status,
        });
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  }

  function getFirstShopFromList(shops) {
    if (!shops) {
      return null;
    }
    return {
      label: shops.translation?.title,
      value: shops.id,
      open_time: shops.open_time,
      close_time: shops.close_time,
    };
  }

  function createTransaction(id, data) {
    transactionService
      .create(id, data)
      .then((res) => {
        setOrderId(res.data.id);
        dispatch(clearOrder());
      })
      .finally(() => setLoadingBtn(false));
  }

  const orderUpdate = (body, paymentData) => {
    const payment = {
      payment_sys_id: paymentData.value,
    };
    setLoadingBtn(true);
    orderService
      .update(id, body)
      .then((response) => {
        createTransaction(response.data.id, payment);
      })
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
      tax: total.order_tax,
      payment_type: values.payment_type?.label,
      note: values.note,
      address: {
        address: activeMenu.data.addressData?.address,
        office: null,
        house: null,
        floor: null,
      },
      location: {
        latitude: activeMenu.data.addressData?.lat,
        longitude: activeMenu.data.addressData?.lng,
      },
      delivery_date:
        moment(values.delivery_date).format('YYYY-MM-DD') +
        ' ' +
        moment(values.delivery_time).format('HH:mm'),
      user_id: values.user.value,
      products: products?.filter((item) => !!item),
      status: data?.status,
    };

    orderUpdate(body, values.payment_type);
  };

  const handleCloseInvoice = () => {
    setOrderId(null);
    const nextUrl = 'orders-board';
    batch(() => {
      dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
      dispatch(fetchOrders({}));
    });
    navigate(`/${nextUrl}`);
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchOrder();
    }
  }, [activeMenu.refetch]);

  return (
    <>
      <PageHeader
        title={t('edit.order')}
        extra={
          <Button
            type='primary'
            loading={loadingBtn}
            onClick={() => form.submit()}
            disabled={!orderProducts?.length}
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
          user: data.user || undefined,
          address: data.address || null,
          currency_id: data?.currency?.id,
          payment_type: data.payment_type || null,
        }}
      >
        <Row gutter={24} hidden={loading}>
          <Col span={16}>
            <ProductInfo form={form} />
          </Col>
          <Col span={8}>
            <UserInfo form={form} />
            <DeliveryInfo form={form} />
            <TransactionDetails form={form} />
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
