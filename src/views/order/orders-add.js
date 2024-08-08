import React, { useEffect, useState } from 'react';
import { Form, PageHeader, Row, Col, Button } from 'antd';

import UserInfo from './user-info';
import DeliveryInfo from './delivery-info';
import ProductInfo from './product-info';
import PreviewInfo from './preview-info';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import orderService from '../../services/order';
import moment from 'moment';
import {
  clearOrder,
  setCurrentShop,
  setOrderCurrency,
  setOrderData,
} from '../../redux/slices/order';
import { useNavigate } from 'react-router-dom';
import { disableRefetch, removeFromMenu } from '../../redux/slices/menu';
import { fetchOrders } from '../../redux/slices/orders';
import transactionService from '../../services/transaction';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export default function OrderAdd() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const { orderProducts, data, total, coupon } = useSelector(
    (state) => state.order,
    shallowEqual,
  );

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { currencies } = useSelector((state) => state.currency, shallowEqual);
  const { allShops } = useSelector((state) => state.allShops, shallowEqual);

  useEffect(() => {
    return () => {
      const formData = form.getFieldsValue(true);
      const data = {
        ...formData,
        delivery_date: formData.delivery_date
          ? moment(formData.delivery_date).format('YYYY-MM-DD')
          : undefined,
      };
      dispatch(setOrderData(data));
    };
  }, []);

  function getFirstShopFromList(shops) {
    if (!shops.length) {
      return null;
    }
    return {
      label: shops[0].translation?.title,
      value: shops[0].id,
    };
  }

  useEffect(() => {
    if (activeMenu.refetch) {
      const currency = currencies.find((item) => item.default);
      dispatch(setCurrentShop(getFirstShopFromList(allShops)));
      dispatch(setOrderCurrency(currency));
      form.setFieldsValue({
        currency_id: currency.id,
      });
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  function createTransaction(id, data) {
    transactionService
      .create(id, data)
      .then((res) => {
        setOrderId(res.data.id);
        dispatch(clearOrder());
        form.resetFields();
      })
      .finally(() => setLoading(false));
  }

  const orderCreate = (body, payment_type) => {
    const payment = {
      payment_sys_id: data.paymentType?.value,
    };
    setLoading(true);
    orderService
      .create(body)
      .then((response) => {
        createTransaction(response.data.id, payment);
      })
      .catch(() => setLoading(false));
  };

  const onFinish = (values) => {
    const body = {
      user_id: data.user?.value,
      currency_id: values.currency_id,
      rate: currencies.find((item) => item.id === values.currency_id)?.rate,
      shop_id: data?.shop?.value,
      delivery_id: values.delivery.label,
      delivery_fee: data.delivery_fee,
      coupon: coupon.coupon,
      tax: total.order_tax,
      payment_type: values.payment_type?.label,
      note: values.note,
      delivery_date: moment(values.delivery_date).format('YYYY-MM-DD HH:mm'),
      delivery_address_id: activeMenu.data.addressData?.address,
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
      delivery_time: moment(data.delivery_time, 'HH:mm').format('HH:mm'),
      delivery_type: values.delivery.label?.toLowerCase(),
      delivery_type_id: values.delivery.value,
      products: orderProducts.map((product) => ({
        stock_id: product.stockID.id,
        quantity: product.quantity,
        bonus: product.bonus,
      })),
    };
    orderCreate(body, values.payment_type);
  };

  const handleCloseInvoice = () => {
    setOrderId(null);
    const nextUrl = 'orders';
    dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
    navigate(`/${nextUrl}`);
    dispatch(fetchOrders());
  };

  const workDayCheck = () => {
    const time = moment(data.delivery_time).format('HH:mm');
    if (!data.userUuid) {
      toast.warning(t('please.select.client'));
      return;
    } else if (!time) {
      toast.warning(t('shop.closed'));
    } else {
      form.submit();
    }
  };

  return (
    <>
      <PageHeader
        title={t('new.order')}
        extra={
          <Button
            type='primary'
            loading={loading}
            onClick={() => workDayCheck()}
            disabled={!orderProducts.length}
          >
            {t('create')}
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
          user: data?.user || null,
          currency_id: data?.currency?.id,
        }}
      >
        <Row gutter={24}>
          <Col span={16}>
            <ProductInfo form={form} />
          </Col>
          <Col span={8}>
            <UserInfo form={form} />
            <DeliveryInfo form={form} />
          </Col>
        </Row>

        {orderId ? (
          <PreviewInfo orderId={orderId} handleClose={handleCloseInvoice} />
        ) : (
          ''
        )}
      </Form>
    </>
  );
}
