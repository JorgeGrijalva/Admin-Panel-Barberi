import React, { useEffect, useState } from 'react';
import { Card, Table, Image, Tag, Descriptions, Row } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import orderService from '../../services/deliveryman/order';
import getImage from '../../helpers/getImage';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, setMenuData } from '../../redux/slices/menu';
import OrderStatusModal from './orderStatusModal';
import { useTranslation } from 'react-i18next';
import numberToPrice from '../../helpers/numberToPrice';

export default function DeliverymanOrderDetails() {
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const data = activeMenu.data;
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('shop.name'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      render: (status, row) => (
        <div>
          {status === 'new' ? (
            <Tag color='blue'>{t(status)}</Tag>
          ) : status === 'canceled' ? (
            <Tag color='error'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
          {status === 'ready' || status === 'on_a_way' ? (
            <EditOutlined onClick={() => setOrderDetails(row)} />
          ) : (
            ''
          )}
        </div>
      ),
    },
    {
      title: t('delivery.type'),
      dataIndex: 'delivery_type',
      key: 'delivery_type',
      render: (delivery_type) => delivery_type?.translation?.title,
    },
    {
      title: t('delivery.date.&.time'),
      dataIndex: 'delivery',
      key: 'delivery',
      render: (delivery, row) => (
        <div>
          {row.delivery_date} {row.delivery_time}
        </div>
      ),
    },
    {
      title: t('amount'),
      dataIndex: 'price',
      key: 'price',
      render: (price, row) =>
        numberToPrice(price + (row.coupon?.price ?? 0), defaultCurrency.symbol),
    },
    {
      title: t('shop.tax'),
      dataIndex: 'tax',
      key: 'tax',
      render: (tax) => numberToPrice(tax, defaultCurrency.symbol),
    },
    {
      title: t('delivery.fee'),
      dataIndex: 'delivery_fee',
      key: 'delivery_fee',
      render: (delivery_fee) =>
        numberToPrice(delivery_fee, defaultCurrency.symbol),
    },
    {
      title: t('coupon'),
      dataIndex: 'coupon',
      key: 'coupon',
      render: (coupon) => numberToPrice(coupon?.price, defaultCurrency.symbol),
    },
    {
      title: t('payment.status'),
      dataIndex: 'tax',
      key: 'tax',
      render: (tax, row) =>
        row.transaction ? (
          <div>
            {row.transaction?.status === 'progress' ? (
              <Tag color='gold'>{t(row.transaction?.status)}</Tag>
            ) : row.transaction?.status === 'rejected' ? (
              <Tag color='error'>{t(row.transaction?.status)}</Tag>
            ) : (
              <Tag color='cyan'>{t(row.transaction?.status)}</Tag>
            )}
          </div>
        ) : (
          '-'
        ),
    },
    {
      title: t('total.amount'),
      dataIndex: 'price',
      key: 'price',
      render: (price, row) =>
        numberToPrice(
          price + row.tax + row.delivery_fee,
          defaultCurrency.symbol,
        ),
    },
  ];

  const handleCloseModal = () => {
    setOrderDetails(null);
  };

  function fetchOrder() {
    setLoading(true);
    orderService
      .getById(id)
      .then(({ data }) => {
        const currency = data.currency;
        const user = data.user;
        const id = data.id;
        const price = data.price;
        const createdAt = data.created_at;
        const details = data.details.map((item) => ({
          ...item,
          title: item.shop?.translation?.title,
        }));
        dispatch(
          setMenuData({
            activeMenu,
            data: { details, currency, user, id, createdAt, price },
          }),
        );
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

  function getImageFromStock(stock) {
    const stockImage = stock.extras.find((item) => item.group.type === 'image');
    if (!!stockImage) {
      return stockImage.value;
    }
    return stock.product.img;
  }

  const expandedRowRender = (row) => {
    const columns = [
      {
        title: t('id'),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: t('product.name'),
        dataIndex: 'stock',
        key: 'stock',
        render: (stock) => stock?.product?.translation?.title,
      },
      {
        title: t('image'),
        dataIndex: 'img',
        key: 'img',
        render: (img, row) => (
          <Image
            src={getImage(getImageFromStock(row.stock))}
            alt='product'
            width={100}
            height='auto'
            className='rounded'
            preview
            placeholder
            key={img + row.id}
          />
        ),
      },
      {
        title: t('price'),
        dataIndex: 'origin_price',
        key: 'origin_price',
        render: (origin_price) =>
          numberToPrice(origin_price, defaultCurrency.symbol),
      },
      {
        title: t('quantity'),
        dataIndex: 'quantity',
        key: 'quantity',
        render: (_, row) => (
          <span>
            {row.quantity * (row?.stock?.product?.interval || 1)}
            {row?.stock?.product?.unit?.translation?.title}
          </span>
        ),
      },
      {
        title: t('discount'),
        dataIndex: 'discount',
        key: 'discount',
        render: (discount, row) =>
          numberToPrice(discount / row.quantity, defaultCurrency.symbol),
      },
      {
        title: t('tax'),
        dataIndex: 'tax',
        key: 'tax',
        render: (tax, row) =>
          numberToPrice(tax / row.quantity, defaultCurrency.symbol),
      },
      {
        title: t('total.price'),
        dataIndex: 'total_price',
        key: 'total_price',
        render: (total_price) =>
          numberToPrice(total_price, defaultCurrency.symbol),
      },
    ];
    const dataSource = row.order_stocks;

    return (
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowKey={(record) => record?.id}
      />
    );
  };

  const calculateSellerTotal = (details) => {
    const item = details[0];
    const totalPrice = item.price + item.tax + item.delivery_fee;
    return numberToPrice(totalPrice, defaultCurrency.symbol);
  };

  return (
    <Card title={`${t('order.details')} ${data?.id ? `#${data?.id}` : ''}`}>
      <Row hidden={loading} className='mb-3'>
        {data?.details?.length ? (
          <Descriptions>
            <Descriptions.Item label={t('client')} span={3}>
              {data?.user?.firstname} {data?.user?.lastname}
            </Descriptions.Item>
            <Descriptions.Item label={t('phone')} span={3}>
              {data?.user?.phone}
            </Descriptions.Item>
            <Descriptions.Item label={t('email')} span={3}>
              {data?.user?.email}
            </Descriptions.Item>
            <Descriptions.Item label={t('address')} span={3}>
              {data?.details[0]?.delivery_address?.address}
            </Descriptions.Item>
            <Descriptions.Item label={t('created.at')} span={3}>
              {data?.createdAt}
            </Descriptions.Item>
            <Descriptions.Item label={t('payment.type')} span={3}>
              {t(data?.details[0]?.transaction?.payment_system?.tag)}
            </Descriptions.Item>
            <Descriptions.Item label={t('amount')} span={3}>
              {calculateSellerTotal(data?.details)}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          ''
        )}
      </Row>
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={activeMenu.data?.details || []}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ['0'],
        }}
        loading={loading}
        rowKey={(record) => record?.id}
        pagination={false}
      />
      {orderDetails && (
        <OrderStatusModal
          orderDetails={orderDetails}
          handleCancel={handleCloseModal}
        />
      )}
    </Card>
  );
}
