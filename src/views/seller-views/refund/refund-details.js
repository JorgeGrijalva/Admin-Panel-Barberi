import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Image,
  Tag,
  Button,
  Space,
  Row,
  Col,
  Avatar,
  Typography,
  Skeleton,
  Spin,
  Badge,
  Steps,
} from 'antd';
import { CalendarOutlined, EditOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import getImage from '../../../helpers/getImage';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, setMenuData } from '../../../redux/slices/menu';
import OrderStatusModal from './status-modal';

import { fetchSellerDeliverymans } from '../../../redux/slices/deliveryman';
import { useTranslation } from 'react-i18next';
import numberToPrice from '../../../helpers/numberToPrice';
import { fetchRestOrderStatus } from '../../../redux/slices/orderStatus';
import { MdEmail } from 'react-icons/md';
import { FiShoppingCart } from 'react-icons/fi';
import { IMG_URL } from '../../../configs/app-global';
import { BsCalendarDay, BsFillTelephoneFill } from 'react-icons/bs';
import { BiMessageDots, BiMoney } from 'react-icons/bi';
import moment from 'moment';
import { useRef } from 'react';
import refundService from '../../../services/seller/refund';
const status = ['pending', 'accepted', 'canceled'];

export default function OrderDetails() {
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const { defaultLang } = useSelector((state) => state.formLang, shallowEqual);

  const data = activeMenu?.data?.order;
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const productListRef = useRef();
  const totalPriceRef = useRef();

  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const { statusList } = useSelector(
    (state) => state.orderStatus,
    shallowEqual,
  );

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
            {row.stock?.extras?.map((extra) => (
              <Tag key={extra?.id}>
                {extra.group?.translation?.title}: {extra.value?.value}
              </Tag>
            ))}
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
          numberToPrice(row?.stock?.price, defaultCurrency?.symbol),
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
          numberToPrice(row?.stock?.discount, defaultCurrency?.symbol),
      },
      {
        title: t('tax'),
        dataIndex: 'tax',
        key: 'tax',
        render: (_, row) => numberToPrice(row?.stock?.tax, defaultCurrency?.symbol),
      },
      {
        title: t('total.price'),
        dataIndex: 'total_price',
        key: 'total_price',
        render: (_, row) => {
          return numberToPrice(row?.stock?.total_price, defaultCurrency?.symbol);
        },
      },
    ];


  const documentColumns = [
    {
      title: t('date'),
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: t('document'),
      dataIndex: 'document',
      key: 'document',
    },
    {
      title: t('number'),
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: t('total.price'),
      dataIndex: 'price',
      key: 'price',
    },
  ];

  const documents = [
    {
      price: numberToPrice(data?.total_price, defaultCurrency?.symbol),
      number: (
        <Link to={`/orders/generate-invoice/${data?.id}`}>#{data?.id}</Link>
      ),
      document: t('invoice'),
      date: data?.delivery_date,
    },
    {
      price: '-',
      number: (
        <Link to={`/orders/generate-invoice/${data?.id}`}>#{data?.id}</Link>
      ),
      document: t('delivery.reciept'),
      date: data?.delivery_date,
    },
  ];

  const handleCloseModal = () => setOrderDetails(null);

  function fetchOrder() {
    setLoading(true);
    refundService
      .getById(id)
      .then(({ data }) => {
        dispatch(setMenuData({ activeMenu, data }));
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  }

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchOrder();
      dispatch(fetchRestOrderStatus({}));
      dispatch(fetchSellerDeliverymans({}));
    }
  }, [activeMenu.refetch]);
  console.log('data', data);

  return (
    <div className='order_details'>
      <Card
        className='order-details-info'
        title={
          <>
            <FiShoppingCart className='mr-2 icon' />
            {`${t('order')} ${data?.id ? `#${data?.id} ` : ''}`}{' '}
            {t('from.order')} {data?.user?.firstname}{' '}
            {data?.user?.lastname || ''}
          </>
        }
        extra={
          data?.status !== 'delivered' && data?.status !== 'canceled' ? (
            <Space>
              {data?.status !== 'delivered' && data?.status !== 'canceled' ? (
                <Button type='primary' onClick={() => setOrderDetails(data)}>
                  {t('change.status')}
                </Button>
              ) : null}
            </Space>
          ) : (
            ''
          )
        }
      />

      <Row gutter={24}>
        <Col span={24}>
          <Card>
            <Space className='justify-content-between w-100'>
              <Space className='align-items-start'>
                <CalendarOutlined className='order-card-icon' />
                <div className='d-flex flex-column'>
                  <Typography.Text>{t('delivery.date')}</Typography.Text>
                  {loading ? (
                    <Skeleton.Button size={16} />
                  ) : (
                    <Typography.Text className='order-card-title'>
                      {data?.delivery_date} {data?.delivery_time}
                    </Typography.Text>
                  )}
                </div>
              </Space>
              <Space
                className='align-items-start'
                onClick={() =>
                  totalPriceRef.current.scrollIntoView({ behavior: 'smooth' })
                }
              >
                <BiMoney className='order-card-icon' />

                <div className='d-flex flex-column'>
                  <Typography.Text>{t('total.price')}</Typography.Text>
                  {loading ? (
                    <Skeleton.Button size={16} loading={loading} />
                  ) : (
                    <Typography.Text className='order-card-title'>
                      {numberToPrice(
                        data?.total_price,
                        defaultCurrency?.symbol,
                      )}
                    </Typography.Text>
                  )}
                </div>
              </Space>
              <Space className='align-items-start'>
                <BiMessageDots className='order-card-icon' />
                <div className='d-flex flex-column'>
                  <Typography.Text>{t('messages')}</Typography.Text>
                  {loading ? (
                    <Skeleton.Button size={16} />
                  ) : (
                    <Typography.Text className='order-card-title'>
                      {data?.review ? 1 : 0}
                    </Typography.Text>
                  )}
                </div>
              </Space>
              <Space
                className='align-items-start'
                onClick={() =>
                  productListRef.current.scrollIntoView({ behavior: 'smooth' })
                }
              >
                <FiShoppingCart className='order-card-icon' />
                <div className='d-flex flex-column'>
                  <Typography.Text>{t('products')}</Typography.Text>
                  {loading ? (
                    <Skeleton.Button size={16} />
                  ) : (
                    <Typography.Text className='order-card-title'>
                      {data?.details
                        ?.reduce((total, item) => (total += item.quantity), 0)}
                    </Typography.Text>
                  )}
                </div>
              </Space>
            </Space>
          </Card>
        </Col>
        {data?.status !== 'canceled' && (
          <Col span={24}>
            <Card>
              <Steps
                current={statusList?.findIndex(
                  (item) => item.name === data?.status,
                )}
              >
                {statusList?.slice(0, -1).map((item) => (
                  <Steps.Step key={item.id} title={t(item.name)} />
                ))}
              </Steps>
            </Card>
          </Col>
        )}
        <Col span={16}>
          <Spin spinning={loading}>
            <Card style={{ minHeight: '200px' }}>
              <h3>{t('details')}:</h3>
              <Row hidden={loading} className='mb-3 order_detail'>
                <Col span={12}>
                  <div>
                    {t('created.date.&.time')}:
                    <span className='ml-2'>
                      <BsCalendarDay className='mr-1' />{' '}
                      {moment(data?.created_at).format('YYYY-MM-DD hh:mm')}{' '}
                    </span>
                  </div>
                  <br />
                  <div>
                    {t('delivery.date.&.time')}:
                    <span className='ml-2'>
                      <BsCalendarDay className='mr-1' /> {data?.delivery_date}{' '}
                      {data?.delivery_time}
                    </span>
                  </div>
                  <br />
                  <div>
                    {t('payment.status')}:
                    <span className='ml-2'>{t(data?.transaction?.status)}</span>
                  </div>
                  <br />
                  <div>
                    {t('cause')}:
                    <span className='ml-2' style={{ color: 'red' }}>
                      {activeMenu.data?.cause}
                    </span>
                  </div>
                  <br />
                  <div>
                    {t('answer')}:
                    <span className='ml-2'>
                      {activeMenu.data?.answer ?? t('no.answer')}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    {t('status')}:
                    <span className='ml-2'>
                      {activeMenu.data?.status === 'pending' ? (
                        <Tag color='blue'>{t(activeMenu.data?.status)}</Tag>
                      ) : activeMenu.data?.status === 'canceled' ? (
                        <Tag color='error'>{t(activeMenu.data?.status)}</Tag>
                      ) : (
                        <Tag color='cyan'>{t(activeMenu.data?.status)}</Tag>
                      )}
                      {activeMenu.data?.status !== 'canceled' && (
                        <EditOutlined
                          onClick={() => setOrderDetails(activeMenu?.data)}
                        />
                      )}
                    </span>
                  </div>
                  <br />
                  <div>
                    {t('delivery.type')}:
                    <span className='ml-2'>{data?.delivery_type}</span>
                  </div>
                  <br />
                  <div>
                    {t('payment.type')}:
                    <span className='ml-2'>
                      {t(data?.transaction?.payment_system?.tag)}
                    </span>
                  </div>
                </Col>
              </Row>
              <Row hidden={loading} className='mb-3 order_detail'>
                <Col span={12}>
                  <h3>{t('delivery.address')}:</h3>
                  <div>
                    {data?.delivery_type === 'delivery' ? (
                      <>
                        <div>
                          {t('street.house.number')}:{' '}
                          {data?.my_address?.street_house_number ??
                            t('not.given')}
                        </div>
                        <br />
                        <div>
                          {t('zipcode')}:{' '}
                          {data?.my_address?.zipcode ?? t('not.given')}
                        </div>
                      </>
                    ) : data?.delivery_type === 'point' ? (
                      <>
                        <div>
                          {t('address')}:{' '}
                          {data?.delivery_point?.address?.[defaultLang] ??
                            t('no.address')}
                        </div>
                      </>
                    ) : data?.delivery_type === 'digital' ? (
                      <div>{t('digital.delivery')}</div>
                    ) : (
                      <div>{t('no.address')}</div>
                    )}
                  </div>
                </Col>
              </Row>
            </Card>
          </Spin>
          <Card title={t('documents')}>
            <Table
              columns={documentColumns}
              dataSource={documents || []}
              pagination={false}
              loading={loading}
            />
          </Card>
          <Card className='w-100 order-table'>
            <Table
              ref={productListRef}
              scroll={{ x: true }}
              columns={columns}
              dataSource={activeMenu.data?.order?.details || []}
              loading={loading}
              rowKey={(record) => record.id}
              pagination={false}
            />
            <Space
              size={100}
              className='d-flex justify-content-end w-100 order-table__summary'
            >
              <div>
                <span>{t('delivery.fee')}:</span>
                <br />
                <span>{t('order.tax')}:</span>
                <br />
                <span>{t('product')}:</span>
                <br />

                <span>{t('service.fee')}:</span>
                <br />
                <span>{t('discount')}:</span>
                <br />
                <span>{t('coupon.price')}:</span>
                <br />
                <h3>{t('total.price')}:</h3>
              </div>
              <div>
                <span>
                  {numberToPrice(
                    data?.delivery_fee ?? 0,
                    defaultCurrency?.symbol,
                  )}
                </span>
                <br />
                <span>
                  {numberToPrice(data?.tax, defaultCurrency?.symbol)}
                </span>
                <br />
                <span>
                  {numberToPrice(data?.origin_price, defaultCurrency?.symbol)}
                </span>
                <br />
                <span>
                  {numberToPrice(data?.service_fee, defaultCurrency?.symbol)}
                </span>
                <br />
                <span>
                  -{' '}
                  {numberToPrice(data?.total_discount, defaultCurrency?.symbol)}
                </span>
                <br />
                <span>
                  - {numberToPrice(data?.coupon_price, defaultCurrency?.symbol)}
                </span>
                <br />
                <h3 ref={totalPriceRef}>
                  {numberToPrice(data?.total_price, defaultCurrency?.symbol)}
                </h3>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={8} className='order_info'>
          {data?.status === 'ready' && data?.delivery_type !== 'pickup' && (
            <Card
              title={t('deliveryman')}
              extra={
                data?.status === 'ready' &&
                data?.delivery_type !== 'pickup' && (
                  <Button>
                    {t('change')}
                    <EditOutlined />
                  </Button>
                )
              }
            >
              {data?.deliveryman && (
                <Space>
                  <Avatar
                    shape='square'
                    size={64}
                    src={IMG_URL + data?.deliveryman?.img}
                  />
                  <div>
                    <h5>
                      {data?.deliveryman?.firstname}{' '}
                      {data?.deliveryman?.lastname || ''}
                    </h5>
                    <span className='delivery-info'>
                      <BsFillTelephoneFill />
                      {data?.deliveryman?.phone}
                    </span>

                    <div className='delivery-info'>
                      <b>
                        <MdEmail size={16} />
                      </b>
                      <span>{data?.deliveryman?.email}</span>
                    </div>
                  </div>
                </Space>
              )}
            </Card>
          )}

          <Card title={<Space>{t('customer.info')}</Space>}>
            <div className='d-flex w-100 customer-info-container'>
              {loading ? (
                <Skeleton.Avatar size={64} shape='square' />
              ) : (
                <Avatar
                  shape='square'
                  size={64}
                  src={IMG_URL + data?.user?.img}
                />
              )}

              <h5 className='customer-name'>
                {loading ? (
                  <Skeleton.Button size={20} style={{ width: 70 }} />
                ) : (
                  data?.user?.firstname + ' ' + (data?.user?.lastname || '')
                )}
              </h5>

              <div className='customer-info-detail'>
                <div className='customer-info'>
                  <span className='title'>{t('phone')}</span>
                  <span className='description'>
                    <BsFillTelephoneFill />
                    {loading ? (
                      <Skeleton.Button size={16} />
                    ) : (
                      data?.user?.phone || 'none'
                    )}
                  </span>
                </div>

                <div className='customer-info'>
                  <span className='title'>{t('email')}</span>
                  <span className='description'>
                    <MdEmail />
                    {loading ? (
                      <Skeleton.Button size={16} />
                    ) : (
                      data?.user?.email
                    )}
                  </span>
                </div>
                <div className='customer-info'>
                  <span className='title'>{t('registration.date')}</span>
                  <span className='description'>
                    <BsCalendarDay />
                    {loading ? (
                      <Skeleton.Button size={16} />
                    ) : (
                      moment(data?.user?.created_at).format('DD-MM-YYYY, hh:mm')
                    )}
                  </span>
                </div>
                <div className='customer-info'>
                  <span className='title'>{t('orders.count')}</span>
                  <span className='description'>
                    {loading ? (
                      <Skeleton.Button size={16} />
                    ) : (
                      <Badge
                        showZero
                        style={{ backgroundColor: '#3d7de3' }}
                        count={data?.user?.o_count || 0}
                      />
                    )}
                  </span>
                </div>
                <div className='customer-info'>
                  <span className='title'>{t('spent.since.registration')}</span>
                  <span className='description'>
                    {loading ? (
                      <Skeleton.Button size={16} />
                    ) : (
                      <Badge
                        showZero
                        style={{ backgroundColor: '#48e33d' }}
                        count={numberToPrice(
                          data?.user?.o_sum,
                          defaultCurrency?.symbol,
                        )}
                      />
                    )}
                  </span>
                </div>
              </div>
            </div>
          </Card>
          {data?.review && !loading && (
            <Card title={t('messages')}>
              <div className='order-message'>
                <span className='message'>{data?.review.comment}</span>
                <Space className='w-100 justify-content-end'>
                  <span className='date'>
                    {moment(data?.review.created_at).format('YYYY-MM-DD hh:mm')}
                  </span>
                </Space>
              </div>
            </Card>
          )}
        </Col>
      </Row>
      {orderDetails && (
        <OrderStatusModal
          orderDetails={orderDetails}
          handleCancel={handleCloseModal}
          status={status}
        />
      )}
    </div>
  );
}
