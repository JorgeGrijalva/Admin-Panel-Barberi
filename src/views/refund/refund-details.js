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
import getImage from 'helpers/getImage';
import { shallowEqual, useDispatch, useSelector, batch } from 'react-redux';
import { disableRefetch, setMenuData } from 'redux/slices/menu';
import OrderStatusModal from './status-modal';

import { fetchDeliverymans } from 'redux/slices/deliveryman';
import { useTranslation } from 'react-i18next';
import numberToPrice from 'helpers/numberToPrice';
import { fetchOrderStatus } from 'redux/slices/orderStatus';
import { MdEmail } from 'react-icons/md';
import { FiShoppingCart } from 'react-icons/fi';
import { IMG_URL } from 'configs/app-global';
import { BsCalendarDay, BsFillTelephoneFill } from 'react-icons/bs';
import { BiMessageDots, BiMoney } from 'react-icons/bi';
import moment from 'moment';
import { useRef } from 'react';
import refundService from 'services/refund';
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
  const products = data?.details;
  console.log('refund data => ', data);

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      render: (_, row) => row.stock?.product_id,
    },
    {
      title: t('product.name'),
      dataIndex: 'product',
      key: 'product',
      render: (_, row) => row.stock?.product?.translation?.title,
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
          row?.stock?.price,
          defaultCurrency?.symbol,
          defaultCurrency?.position,
        ),
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: t('discount'),
      dataIndex: 'discount',
      key: 'discount',
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
      render: (tax, row) =>
        numberToPrice(
          row?.stock?.tax,
          defaultCurrency?.symbol,
          defaultCurrency?.position,
        ),
    },
    {
      title: t('total.price'),
      dataIndex: 'total_price',
      key: 'total_price',
      render: (_, row) =>
        numberToPrice(
          row?.stock?.total_price,
          defaultCurrency?.symbol,
          defaultCurrency?.position,
        ),
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
      price: numberToPrice(
        data?.total_price,
        defaultCurrency?.symbol,
        defaultCurrency?.position,
      ),
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
      document: t('delivery.receipt'),
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
      batch(() => {
        dispatch(fetchOrderStatus({}));
        dispatch(fetchDeliverymans({}));
      });
    }
  }, [activeMenu.refetch]);

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
                        defaultCurrency?.position,
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
                      {data?.details?.reduce(
                        (total, item) => (total += item.quantity),
                        0,
                      )}
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
                      {moment(data?.created_at).format('YYYY-MM-DD HH:mm')}{' '}
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
                      {activeMenu.data?.status !== 'canceled' &&
                        activeMenu.data?.status !== 'accepted' && (
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
                  <br />
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
              dataSource={products || []}
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
                <span>{t('coupon')}:</span>
                <br />
                <span>{t('discount')}:</span>
                <br />
                <h3>{t('total.price')}:</h3>
              </div>
              <div>
                <span>
                  {numberToPrice(
                    data?.delivery_fee,
                    defaultCurrency?.symbol,
                    defaultCurrency?.position,
                  )}
                </span>
                <br />
                <span>
                  {numberToPrice(
                    data?.tax,
                    defaultCurrency?.symbol,
                    defaultCurrency?.position,
                  )}
                </span>
                <br />
                <span>
                  {numberToPrice(
                    data?.origin_price,
                    defaultCurrency?.symbol,
                    defaultCurrency?.position,
                  )}
                </span>
                <br />
                <span>
                  {numberToPrice(
                    data?.coupon?.price,
                    defaultCurrency?.symbol,
                    defaultCurrency?.position,
                  )}
                </span>
                <br />
                <span>
                  {numberToPrice(
                    data?.total_discount,
                    defaultCurrency?.symbol,
                    defaultCurrency?.position,
                  )}
                </span>
                <br />
                <h3 ref={totalPriceRef}>
                  {numberToPrice(
                    data?.total_price,
                    defaultCurrency?.symbol,
                    defaultCurrency?.position,
                  )}
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
                      {`${data?.deliveryman?.firstname || ''}
                      ${data?.deliveryman?.lastname || ''}`}
                    </h5>
                    <span className='delivery-info'>
                      <BsFillTelephoneFill />
                      {data?.deliveryman?.phone || t('none')}
                    </span>

                    <div className='delivery-info'>
                      <b>
                        <MdEmail size={16} />
                      </b>
                      <span>{data?.deliveryman?.email || t('none')}</span>
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
                  `${data?.user?.firstname || ''} ${data?.user?.lastname || ''}`
                )}
              </h5>

              <Row gutter={12}>
                <Col
                  span={24}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    columnGap: '15px',
                  }}
                >
                  <h4>{t('phone')}:</h4>
                  <h5>
                    <BsFillTelephoneFill />
                    {loading ? (
                      <Skeleton.Button size={16} />
                    ) : (
                      ' ' + data?.user?.phone || t('none')
                    )}
                  </h5>
                </Col>

                <Col
                  span={24}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    columnGap: '15px',
                  }}
                >
                  <h4>{t('email')}:</h4>
                  <h5>
                    <MdEmail />
                    {loading ? (
                      <Skeleton.Button size={16} />
                    ) : (
                      ' ' + (data?.user?.email || t('none'))
                    )}
                  </h5>
                </Col>
                <Col
                  span={24}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    columnGap: '15px',
                  }}
                >
                  <h4>{t('registration.date')}:</h4>
                  <h5>
                    <BsCalendarDay />
                    {loading ? (
                      <Skeleton.Button size={16} />
                    ) : (
                      ' ' +
                      moment(data?.user?.created_at).format('DD-MM-YYYY, HH:mm')
                    )}
                  </h5>
                </Col>
                <Col
                  span={24}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    columnGap: '15px',
                  }}
                >
                  <h4>{t('orders.count')}:</h4>
                  <h5>
                    {loading ? (
                      <Skeleton.Button size={16} />
                    ) : (
                      <Badge
                        showZero
                        style={{ backgroundColor: '#3d7de3' }}
                        count={data?.user?.o_count || 0}
                      />
                    )}
                  </h5>
                </Col>
                <Col
                  span={24}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    columnGap: '15px',
                  }}
                >
                  <h4>{t('spent.since.registration')}:</h4>
                  <h5>
                    {loading ? (
                      <Skeleton.Button size={16} />
                    ) : (
                      <Badge
                        showZero
                        style={{ backgroundColor: '#48e33d' }}
                        count={numberToPrice(
                          data?.user?.o_sum,
                          defaultCurrency?.symbol,
                          defaultCurrency?.position,
                        )}
                      />
                    )}
                  </h5>
                </Col>
              </Row>
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
          <Card title={t('store.information')}>
            {loading ? (
              <Skeleton avatar shape='square' paragraph={{ rows: 2 }} />
            ) : (
              <>
                <Space className='w-100'>
                  <Avatar
                    shape='square'
                    size={64}
                    src={IMG_URL + data?.shop?.logo_img}
                  />
                  <div>
                    <h5>{data?.shop?.translation.title}</h5>
                    <div className='delivery-info'>
                      <b>
                        <BsFillTelephoneFill />
                      </b>
                      <span>{data?.shop?.phone}</span>
                    </div>
                  </div>
                </Space>
              </>
            )}
          </Card>
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
