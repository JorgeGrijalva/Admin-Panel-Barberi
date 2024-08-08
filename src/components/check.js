import { Button, Card, Space, Table, Tag, Divider } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import orderService from 'services/order';
import Loading from './loading';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import numberToPrice from 'helpers/numberToPrice';
import { PrinterOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import QrCode from 'components/qr-code';
import { disableRefetch } from 'redux/slices/menu';
import hideEmail from 'components/hideEmail';
import hideNumber from './hideNumber';
import useDemo from 'helpers/useDemo';
const ReactAppIsDemo = process.env.REACT_APP_IS_DEMO;

const Check = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();
  const navigate = useNavigate();
  const { id } = useParams();
  const { settings } = useSelector((state) => state.globalSettings);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const { isDemo } = useDemo();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [loading, setLoading] = useState(null);
  const [data, setData] = useState(null);

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
      render: (_, row) => (
        <Space direction='vertical' className='relative'>
          {row?.stock?.product?.translation?.title}
          {row?.stock?.extras?.map((extra) => (
            <Tag key={extra?.id}>
              {extra.group?.translation?.title}: {extra.value?.value}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      render: (_, row) =>
        numberToPrice(
          row?.stock?.price - (row?.stock?.tax ?? 0),
          defaultCurrency?.symbol,
        ),
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, row) => quantity * (row.stock.product.interval || 0),
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
    dispatch(disableRefetch(activeMenu));
  }, []);

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchOrder();
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

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
                {t('date')}:{' '}
                {moment(data?.created_at).format('YYYY-MM-DD HH:mm')}
              </h4>
              <address>
                <p>
                  <span>
                    {t('delivery.type')}: {data?.delivery_type}
                  </span>
                  {data?.address?.city && (
                    <>
                      <br />
                      <span>
                        {t('delivery.address')}: {data?.address?.city}
                      </span>
                    </>
                  )}
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
                    {`${data?.user?.firstname || ''} ${
                      data?.user?.lastname || ''
                    }`}
                  </span>
                  <br />
                  <span>
                    {t('email')}:{' '}
                    {!!data?.user?.email || ReactAppIsDemo === 'true' || isDemo
                      ? hideEmail(data?.user?.email)
                      : data?.user?.email}
                  </span>
                  <br />
                  <span>
                    {t('phone')}:{' '}
                    {data?.user?.phone
                      ? ReactAppIsDemo === 'true' || isDemo
                        ? hideNumber(data?.user?.phone)
                        : data?.user?.phone
                      : t('no.phone')}
                  </span>
                </p>
              </address>
            </span>
            <span>
              <QrCode orderId={id} showLink={false} size={1.5} />
            </span>
          </main>
          <Table
            scroll={{ x: true }}
            columns={columns}
            dataSource={data?.details || []}
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
                <h4>{numberToPrice(data?.tax, defaultCurrency?.symbol)}</h4>
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

export default Check;
