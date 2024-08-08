import { Button, Card, Space, Table, Tag, Divider } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import orderService from '../services/seller/order';
import Loading from './loading';
import { shallowEqual, useSelector } from 'react-redux';
import moment from 'moment';
import numberToPrice from '../helpers/numberToPrice';
import { PrinterOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';

const SellerCheck = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [data, setData] = useState(null);
  const { id } = useParams();
  const componentRef = useRef();
  const navigate = useNavigate();
  const { settings } = useSelector((state) => state.globalSettings);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      render: (_, row) => row?.stock?.id,
    },
    {
      title: t('product.name'),
      dataIndex: 'product',
      key: 'product',
      render: (_, row) => row.stock?.product?.translation?.title,
    },
    {
      title: t('price'),
      dataIndex: 'origin_price',
      key: 'origin_price',
      render: (origin_price, row) =>
        numberToPrice(
          origin_price / (row?.quantity ?? 1),
          defaultCurrency?.symbol,
        ),
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: t('tax'),
      dataIndex: 'tax',
      key: 'tax',
      render: (tax) => numberToPrice(tax, defaultCurrency?.symbol),
    },
    {
      title: t('discount'),
      dataIndex: 'discount',
      key: 'discount',
      render: (_, row) =>
        numberToPrice(row?.stock?.discount, defaultCurrency?.symbol),
    },
    {
      title: t('total.price'),
      dataIndex: 'total_price',
      key: 'total_price',
      render: (total_price) =>
        numberToPrice(total_price, defaultCurrency?.symbol),
    },
  ];

  function fetchOrder() {
    setLoading(true);
    orderService
      .getById(id)
      .then(({ data }) => {
        setData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchOrder();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Card
      title={t('invoice')}
      extra={
        <Space wrap>
          <Button type='primary' onClick={() => navigate(-1)}>
            <span className='ml-1'>{t('back')}</span>
          </Button>
          <Button
            type='primary'
            onClick={() => handlePrint()}
            ref={componentRef}
          >
            <PrinterOutlined type='printer' />
            <span className='ml-1'>{t('print')}</span>
          </Button>
        </Space>
      }
    >
      {loading ? (
        <Loading />
      ) : (
        <div className='container_check' ref={componentRef}>
          <header className='check_header'>
            <span>
              <img
                src={settings?.favicon}
                alt='img'
                className='check_icon overflow-hidden w-25 h-25 rounded'
                width={'100%'}
                height={'100%'}
              />
              <h1>Invoice</h1>
            </span>
            <span className='check_companyInfo'>
              <h1>{settings?.title}</h1>
              <h5>{settings?.address}</h5>
            </span>
          </header>
          <main>
            <span>
              <h4>
                {t('order.id')}: {data?.id}
              </h4>
              <h4>
                {t('date')}: {moment(data?.created_at).format('DD-MM-YYYY')}
              </h4>
              <address>
                <p>
                  <span>
                    {t('delivery.type')}: {data?.delivery_type}
                  </span>
                  <br />
                  <span>
                    {t('delivery.address')}: {data?.address?.city}
                  </span>
                  <br />
                  <span>
                    {t('delivery.date')}: {data?.delivery_date}{' '}
                    {data?.delivery_time}
                  </span>
                  <br />
                  <span>
                    {t('status')}: <Tag color='green'>{data?.status}</Tag>
                  </span>
                </p>
              </address>
            </span>
            <span>
              <address>
                <p>
                  <h3 className='shop_data'>{t('user')}</h3>
                  <span>
                    {t('user.id')}: {data?.user?.id}
                  </span>
                  <br />
                  <span>
                    {t('full.name')}:{' '}
                    {`${data?.user?.firstname} ${data?.user?.lastname}`}
                  </span>
                  <br />
                  <span>
                    {t('email')}: {data?.user?.email ?? t('no.email')}
                  </span>
                  <br />
                  <span>
                    {t('phone')}: {data?.user?.phone ?? t('no.phone')}
                  </span>
                </p>
              </address>
            </span>
          </main>
          <Table
            scroll={{ x: true }}
            columns={columns}
            dataSource={
              data?.details?.flatMap((detail) => detail?.products) || []
            }
            loading={loading}
            rowKey={(record) => record.id}
            pagination={false}
            className={'check_table'}
          />
          <footer>
            <span>
              <h3>
                {t('note')}: {data?.note ?? t('no.note')}
              </h3>
            </span>
            <span>
              <span>
                <h5>{t('origin.price')}:</h5>
                <h4>
                  {numberToPrice(data?.origin_price, defaultCurrency?.symbol)}
                </h4>
              </span>
              <span>
                <h5>{t('total.tax')}:</h5>
                <h4>
                  {numberToPrice(data?.total_tax, defaultCurrency?.symbol)}
                </h4>
              </span>
              <span>
                <h5>{t('service.fee')}:</h5>
                <h4>
                  {numberToPrice(data?.service_fee, defaultCurrency?.symbol)}
                </h4>
              </span>
              <span>
                <h5>{t('delivery.fee')}:</h5>
                <h4>
                  {numberToPrice(data?.delivery_fee, defaultCurrency?.symbol)}
                </h4>
              </span>
              <span>
                <h5>{t('total.discount')}:</h5>
                <h4>- {numberToPrice(data?.total_discount)}</h4>
              </span>
              <span>
                <h5>{t('coupon')}:</h5>
                <h4>- {numberToPrice(data?.coupon_price)}</h4>
              </span>
              <Divider />
              <span>
                <h4>{t('total.price')}:</h4>
                <h3>
                  {numberToPrice(data?.total_price, defaultCurrency?.symbol)}
                </h3>
              </span>
            </span>
          </footer>
          <section className='text-center'>
            © {moment(new Date()).format('YYYY')} {settings?.title}.{' '}
            {t('all.rights.reserved')}
          </section>
        </div>
      )}
    </Card>
  );
};

export default SellerCheck;
