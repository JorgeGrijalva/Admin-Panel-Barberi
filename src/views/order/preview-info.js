import React, { useEffect, useState } from 'react';
import { Button, Card, Image, Modal, Space, Table, Tag } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import moment from 'moment';
import numberToPrice from 'helpers/numberToPrice';
import { useTranslation } from 'react-i18next';
import 'assets/scss/components/print.scss';
import getImage from 'helpers/getImage';
import { shallowEqual, useSelector } from 'react-redux';
import { GetColorName } from 'hex-color-to-color-name';
import hideNumber from 'components/hideNumber';
import hideEmail from 'components/hideEmail';
import useDemo from 'helpers/useDemo';

const ReactAppIsDemo = process.env.REACT_APP_IS_DEMO;

const PreviewInfo = ({ handleClose }) => {
  const { t } = useTranslation();
  const { cartOrder } = useSelector((state) => state.cart, shallowEqual);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const { defaultLang } = useSelector((state) => state.formLang, shallowEqual);
  const { isDemo } = useDemo();

  const [parentOrder, setParentOrder] = useState();
  const [data, setData] = useState();
  const [list, setList] = useState();

  useEffect(() => {
    if (cartOrder) {
      const data = cartOrder?.filter((item) => !item?.parent_id)?.[0];
      setParentOrder(data);
      setList(cartOrder?.map((item) => item?.details).flat());
      setData(data);
    }
  }, [cartOrder]);

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      render: (_, row) => row.stock?.id,
    },
    {
      title: t('product.name'),
      dataIndex: 'product',
      key: 'product',
      render: (_, row) => (
        <Space direction='vertical' className='relative'>
          {row.stock?.product?.translation?.title}
          {row.stock?.extras?.map((extra) =>
            extra.group?.type === 'color' ? (
              <Tag key={extra?.id}>
                {extra.group?.translation?.title}:{' '}
                {GetColorName(extra.value?.value)}
              </Tag>
            ) : (
              <Tag key={extra?.id}>
                {extra.group?.translation?.title}: {extra.value?.value}
              </Tag>
            ),
          )}
        </Space>
      ),
    },
    {
      title: t('image'),
      dataIndex: 'img',
      key: 'img',
      render: (_, row) => (
        <Image
          src={getImage(row.stock?.product?.img)}
          alt='product'
          width={100}
          height='auto'
          className='rounded'
          preview
          placeholder
        />
      ),
    },
    {
      title: t('price'),
      dataIndex: 'origin_price',
      key: 'origin_price',
      render: (_, row) =>
        numberToPrice(
          row?.stock?.price - (row?.stock?.tax ?? 0),
          defaultCurrency?.symbol,
          defaultCurrency?.position,
        ),
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text) => <span>{text}</span>,
    },
    {
      title: t('discount'),
      dataIndex: 'rate_discount',
      key: 'rate_discount',
      render: (_, row) =>
        numberToPrice(
          row?.stock?.discount,
          defaultCurrency?.symbol,
          defaultCurrency?.position,
        ),
    },
    {
      title: t('tax'),
      dataIndex: 'tax',
      key: 'tax',
      render: (tax) =>
        numberToPrice(tax, defaultCurrency?.symbol, defaultCurrency?.position),
    },
    {
      title: t('total.price'),
      dataIndex: 'total_price',
      key: 'total_price',
      render: (_, row) => {
        return numberToPrice(
          row?.total_price,
          defaultCurrency?.symbol,
          defaultCurrency?.position,
        );
      },
    },
  ];

  const totalPrices = {
    products:
      cartOrder?.reduce(
        (total, item) => (total += item?.origin_price ?? 0),
        0,
      ) ?? 0,
    deliveryFee:
      cartOrder?.reduce(
        (total, item) => (total += item?.delivery_fee ?? 0),
        0,
      ) ?? 0,
    serviceFee:
      cartOrder?.reduce(
        (total, item) => (total += item?.service_fee ?? 0),
        0,
      ) ?? 0,
    tax: cartOrder?.reduce((total, item) => (total += item?.tax ?? 0), 0) ?? 0,
    discount: cartOrder?.reduce(
      (total, item) => (total += item?.total_discount ?? 0),
      0,
    ),
    couponPrice: cartOrder?.reduce(
      (total, item) => (total += item?.coupon?.price ?? 0),
      0,
    ),
    totalPrice: cartOrder?.reduce(
      (total, item) => (total += item?.total_price ?? 0),
      0,
    ),
  };

  return (
    <Modal
      visible={!!cartOrder}
      title={t('order.created.successfully')}
      onOk={handleClose}
      onCancel={handleClose}
      footer={[
        <Button onClick={handleClose} className='buttons'>
          {t('back')}
        </Button>,
        <Button
          type='primary'
          onClick={() => window.print()}
          className='buttons'
        >
          <PrinterOutlined type='printer' />
          <span className='ml-1'>{t('print')}</span>
        </Button>,
      ]}
      width={1000}
    >
      <div className='py-4 order-preview'>
        <Card>
          <div className='d-flex justify-content-between mt-3'>
            <div>
              <h2 className='mb-1 font-weight-semibold'>
                {t('invoice')} #{parentOrder?.id}
              </h2>
              <p>{moment(data?.created_at).format('YYYY-MM-DD HH:mm')}</p>
              <address>
                <p>
                  <span>
                    {t('delivery.type')}: {data?.delivery_type}
                  </span>
                  <br />
                  {data?.delivery_type === 'point' && (
                    <>
                      <span>
                        {t('point')}:{' '}
                        {data?.delivery_point?.address?.[defaultLang]}
                      </span>
                      <br />
                    </>
                  )}{' '}
                  {data?.delivery_type === 'delivery' && (
                    <>
                      <span>
                        {t('delivery.address')}: {data?.address?.address}
                      </span>
                      <br />
                    </>
                  )}
                  <span>
                    {t('delivery.date')}: {data?.delivery_date}{' '}
                    {data?.delivery_time}
                  </span>
                  <br />
                  <span>
                    {t('note')}: {data?.note ?? '--'}
                  </span>
                </p>
              </address>
            </div>
            <address>
              <h2 className='mb-1 font-weight-semibold'>
                {t('user')} #{data?.user?.id}
              </h2>
              <p>
                <span className='font-weight-semibold text-dark font-size-md'>
                  {data?.user?.firstname} {data?.user?.lastname}
                </span>
                <br />
                <span>
                  {t('phone')}:{' '}
                  {data?.phone
                    ? ReactAppIsDemo === 'true' || isDemo
                      ? hideNumber(data?.phone)
                      : data?.phone
                    : t('no.phone')}
                </span>
                <br />
                <span>
                  {t('email')}:{' '}
                  {data?.user?.email
                    ? ReactAppIsDemo === 'true' || isDemo
                      ? hideEmail(data?.user?.email)
                      : data?.user?.email
                    : t('no.email')}
                </span>
              </p>
            </address>
          </div>
          <div className='mt-4'>
            <Table
              scroll={{ x: true }}
              columns={columns}
              dataSource={list || []}
              rowKey={(record) => record.id}
              pagination={false}
            />
            <br />
            <div className='d-flex justify-content-end'>
              <div className='text-right '>
                <div className='border-bottom'>
                  <p className='mb-2'>
                    <span>{t('products')}: </span>
                    {numberToPrice(
                      totalPrices?.products,
                      defaultCurrency?.symbol,
                      defaultCurrency?.position,
                    )}
                  </p>
                  <p>
                    {t('delivery.fee')} :{' '}
                    {numberToPrice(
                      totalPrices?.deliveryFee,
                      defaultCurrency?.symbol,
                      defaultCurrency?.position,
                    )}
                  </p>
                  <p>
                    {t('service.fee')} :{' '}
                    {numberToPrice(
                      totalPrices?.serviceFee,
                      defaultCurrency?.symbol,
                      defaultCurrency?.position,
                    )}
                  </p>
                  <p>
                    {t('tax')} :{' '}
                    {numberToPrice(
                      totalPrices?.tax,
                      defaultCurrency?.symbol,
                      defaultCurrency?.position,
                    )}
                  </p>
                  <p>
                    {t('discount')} : -
                    {numberToPrice(
                      totalPrices?.discount,
                      defaultCurrency?.symbol,
                      defaultCurrency?.position,
                    )}
                  </p>
                  <p>
                    {t('coupon')} : -
                    {numberToPrice(
                      totalPrices?.couponPrice,
                      defaultCurrency?.symbol,
                      defaultCurrency?.position,
                    )}
                  </p>
                </div>
                <h2 className='font-weight-semibold mt-3'>
                  <span className='mr-1'>
                    {t('grand.total')}:{' '}
                    <div className='ml-2 font-weight-bold'>
                      {numberToPrice(
                        totalPrices?.totalPrice,
                        defaultCurrency?.symbol,
                        defaultCurrency?.position,
                      )}
                    </div>
                  </span>
                </h2>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Modal>
  );
};

export default PreviewInfo;
