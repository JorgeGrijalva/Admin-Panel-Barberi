import React, { useEffect, useState, useCallback } from 'react';
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
  Divider,
} from 'antd';
import {
  CalendarOutlined,
  EditOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import orderService from 'services/order';
import getImage from 'helpers/getImage';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import OrderStatusModal from './orderStatusModal';
import OrderDeliveryman from './orderDeliveryman';
import { useTranslation } from 'react-i18next';
import numberToPrice from 'helpers/numberToPrice';
import { clearOrder } from 'redux/slices/order';
import { MdEmail, MdLocationOn } from 'react-icons/md';
import ShowLocationsMap from './show-locations.map';
import { FiShoppingCart } from 'react-icons/fi';
import { IMG_URL } from 'configs/app-global';
import {
  BsCalendarDay,
  BsFillTelephoneFill,
  BsFillPersonFill,
} from 'react-icons/bs';
import { BiMessageDots, BiMoney } from 'react-icons/bi';
import moment from 'moment';
import { useRef } from 'react';
import { fetchOrderStatus } from 'redux/slices/orderStatus';
import useDemo from 'helpers/useDemo';
import hideEmail from 'components/hideEmail';
import QrCode from 'components/qr-code';
import { TrackingInfo } from 'components/tracking-info';
import { toast } from 'react-toastify';
import TransactionStatusModal from './transaction-status-modal';

export default function OrderDetails() {
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const { defaultLang } = useSelector((state) => state.formLang, shallowEqual);
  const data = activeMenu.data;
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productListRef = useRef();
  const totalPriceRef = useRef();
  const { isDemo } = useDemo();
  const [locationsMap, setLocationsMap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [transactionStatusModal, setTransactionStatusModal] = useState(false);
  const [orderDeliveryDetails, setOrderDeliveryDetails] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { statusList } = useSelector(
    (state) => state.orderStatus,
    shallowEqual,
  );

  const expandedRowRender = (record) => {
    if (!record?.replace_stock) return;
    const columns = [
      {
        title: t('id'),
        dataIndex: 'id',
        key: 'id',
        render: (_, row) => row?.replace_stock?.id,
      },
      {
        title: t('product.name'),
        dataIndex: 'product',
        key: 'product',
        render: (_, row) => (
          <Space direction='vertical' className='relative'>
            {row.replace_stock?.product?.translation?.title}
            {row.replace_stock?.extras?.map((extra) => {
              return (
                <Tag
                  key={extra?.id}
                  style={{
                    display: 'flex',
                    width: 'fit-content',
                    justifyContent: 'start',
                    alignItems: 'center',
                    columnGap: '5px',
                  }}
                >
                  {extra.group?.translation?.title}:{' '}
                  {extra.group?.type === 'color' ? (
                    <span
                      style={{
                        display: 'block',
                        width: '19px',
                        height: '19px',
                        backgroundColor: extra.value?.value,
                        border: '1px solid #080136',
                        borderRadius: '50%',
                      }}
                    />
                  ) : (
                    extra.value?.value
                  )}
                </Tag>
              );
            })}
          </Space>
        ),
      },
      {
        title: t('image'),
        dataIndex: 'img',
        key: 'img',
        render: (_, row) => (
          <Image
            src={getImage(row?.replace_stock?.product?.img)}
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
        dataIndex: 'price',
        key: 'price',
        render: (_, row) =>
          numberToPrice(
            row?.replace_stock?.price,
            data?.currency?.symbol,
            data?.currency?.position,
          ),
      },
      {
        title: t('quantity'),
        dataIndex: 'replace_quantity',
        key: 'replace_quantity',
        render: (quantity, row) => {
          return (
            <span>
              {quantity * (row?.replace_stock?.product?.interval || 1)}
            </span>
          );
        },
      },
      {
        title: t('discount'),
        dataIndex: 'discount',
        key: 'discount',
        render: (_, row) =>
          numberToPrice(
            row?.replace_stock?.discount ?? 0,
            data?.currency?.symbol,
            data?.currency?.position,
          ),
      },
      {
        title: t('tax'),
        dataIndex: 'tax',
        key: 'tax',
        render: (_, row) =>
          numberToPrice(
            row?.replace_stock?.tax,
            data?.currency?.symbol,
            data?.currency?.position,
          ),
      },
      {
        title: t('total.price'),
        dataIndex: 'total_price',
        key: 'total_price',
        render: (_, row) => {
          return numberToPrice(
            row?.replace_stock?.total_price,
            data?.currency?.symbol,
            data?.currency?.position,
          );
        },
      },
      {
        title: t('note'),
        dataIndex: 'note',
        key: 'note',
        render: (note) => note || '--',
      },
    ];

    return (
      <>
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SwapOutlined
            style={{
              padding: '10px',
              margin: '10px 0 50px 0',
              border: '2px solid #cad2de',
              borderRadius: '30%',
            }}
            rotate={90}
          />
        </span>
        <Table columns={columns} dataSource={[record]} pagination={false} />
      </>
    );
  };

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      render: (_, row) => {
        return row?.stock?.id;
      },
    },
    {
      title: t('product.name'),
      dataIndex: 'product',
      key: 'product',
      render: (_, row) => (
        <Space direction='vertical' className='relative'>
          {row.stock?.product?.translation?.title}
          {row.stock?.extras?.map((extra) => {
            return (
              <Tag
                key={extra?.id}
                style={{
                  display: 'flex',
                  width: 'fit-content',
                  justifyContent: 'start',
                  alignItems: 'center',
                  columnGap: '5px',
                }}
              >
                {extra.group?.translation?.title}:{' '}
                {extra.group?.type === 'color' ? (
                  <span
                    style={{
                      display: 'block',
                      width: '19px',
                      height: '19px',
                      backgroundColor: extra.value?.value,
                      border: '1px solid #080136',
                      borderRadius: '50%',
                    }}
                  />
                ) : (
                  extra.value?.value
                )}
              </Tag>
            );
          })}
        </Space>
      ),
    },
    {
      title: t('image'),
      dataIndex: 'img',
      key: 'img',
      render: (_, row) => (
        <Image
          src={getImage(row?.stock?.product?.img)}
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
          data?.currency?.symbol,
          data?.currency?.position,
        ),
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, row) => {
        return row?.bonus ? (
          <Tag color='green'>{t('bonus')}</Tag>
        ) : (
          <span>{quantity * (row?.stock?.product?.interval || 1)}</span>
        );
      },
    },
    {
      title: t('discount'),
      dataIndex: 'rate_discount',
      key: 'rate_discount',
      render: (_, row) =>
        numberToPrice(
          row?.stock?.discount,
          data?.currency?.symbol,
          data?.currency?.position,
        ),
    },
    {
      title: t('tax'),
      dataIndex: 'tax',
      key: 'tax',
      render: (_, row) =>
        numberToPrice(
          row?.tax,
          data?.currency?.symbol,
          data?.currency?.position,
        ),
    },
    {
      title: t('total.price'),
      dataIndex: 'total_price',
      key: 'total_price',
      render: (_, row) => {
        return numberToPrice(
          row?.total_price,
          data?.currency?.symbol,
          data?.currency?.position,
        );
      },
    },
    {
      title: t('actions'),
      dataIndex: 'actions',
      key: 'actions',
      render: (_, row) => (
        <Space>
          <Button
            type={'primary'}
            icon={<SwapOutlined />}
            onClick={() => goToReplaceProduct(row)}
            disabled={
              (data?.status !== 'new' && data?.status !== 'accepted') ||
              row?.bonus
            }
          />
        </Space>
      ),
    },
  ];

  const documentColumns = [
    {
      title: t('date'),
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('YYYY-MM-DD HH:mm'),
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
        data?.currency?.symbol,
        data?.currency?.position,
      ),
      number: (
        <Link to={`/orders/generate-invoice/${data?.id}`}>#{data?.id}</Link>
      ),
      document: t('invoice'),
      date: moment(data?.created_at).format('YYYY-MM-DD HH:mm'),
    },
    {
      price: '-',
      number: (
        <Link to={`/orders/generate-invoice/${data?.id}`}>#{data?.id}</Link>
      ),
      document: t('delivery.receipt'),
      date: moment(data?.created_at).format('YYYY-MM-DD HH:mm'),
    },
  ];

  const handleCloseModal = () => {
    setOrderId(null);
    setOrderDeliveryDetails(null);
    setLocationsMap(null);
  };

  function fetchOrder() {
    setLoading(true);
    orderService
      .getById(id)
      .then(({ data }) => {
        dispatch(setMenuData({ activeMenu, data }));
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  }

  const goToEdit = () => {
    dispatch(clearOrder());
    dispatch(
      addMenu({
        url: `order/${id}`,
        id: 'order_edit',
        name: t('edit.order'),
      }),
    );
    navigate(`/order/${id}`);
  };

  const handleUpdateTracking = useCallback(
    (body) => {
      setIsUpdating(true);
      orderService
        .updateTracking(data?.id, body)
        .then(() => {
          toast.success(t('successfully.updated'));
          fetchOrder();
        })
        .finally(() => {
          setIsUpdating(false);
        });
    },
    [data?.id],
  );

  const goToUser = () => {
    dispatch(
      addMenu({
        url: `users/user/${data?.user.uuid}`,
        id: 'user_info',
        name: t('user.info'),
      }),
    );
    navigate(`/users/user/${data?.user.uuid}`, {
      state: { user_id: data?.user.id },
    });
  };

  const goToReplaceProduct = (row) => {
    dispatch(
      addMenu({
        url: `order/details/${data?.id}/replace/${row?.stock?.id}`,
        id: 'replace_product',
        name: t('replace.product'),
      }),
    );
    navigate(`/order/details/${data?.id}/replace/${row?.stock?.id}`, {
      state: { data },
    });
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchOrder();
      if (statusList.length === 0) {
        dispatch(fetchOrderStatus({}));
      }
    }
  }, [activeMenu.refetch]);

  const handleShowModal = () => setLocationsMap(id);

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
              {data?.status !== 'delivered' &&
              data?.status !== 'canceled' &&
              data?.type !== 1 ? (
                <Button type='primary' onClick={() => setOrderId(data?.id)}>
                  {t('change.status')}
                </Button>
              ) : null}
              <Button type='primary' icon={<EditOutlined />} onClick={goToEdit}>
                {t('edit')}
              </Button>
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
                        data?.currency?.symbol,
                        data?.currency?.position,
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
                        (total, item) => (total += item?.quantity || 0),
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
                {statusList
                  ?.slice(0, -1)
                  ?.filter((item) => item?.active)
                  ?.map((item) => (
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
              <Row hidden={loading} className='mb-3 order_detail' gutter={10}>
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
                    <span
                      style={{ cursor: 'pointer' }}
                      className='ml-2'
                      onClick={() => setTransactionStatusModal(true)}
                    >
                      {t(data?.transaction?.status)} <EditOutlined />
                    </span>
                  </div>
                  <br />
                  <div>
                    {t('note')}:
                    <span className='ml-2'>
                      {t(!!data?.note ? data?.note : '')}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    {t('status')}:
                    <span className='ml-2'>
                      {data?.status === 'new' ? (
                        <Tag color='blue'>{t(data?.status)}</Tag>
                      ) : data?.status === 'canceled' ? (
                        <Tag color='error'>{t(data?.status)}</Tag>
                      ) : (
                        <Tag color='cyan'>{t(data?.status)}</Tag>
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
                    {!!data?.address ? (
                      <>
                        <div>
                          {t('street.house.number')}:{' '}
                          {data?.address?.street_house_number ?? t('not.given')}
                        </div>
                        <br />
                        <div>
                          {t('zipcode')}:{' '}
                          {data?.address?.zipcode ??
                            data?.address?.zip_code ??
                            t('not.given')}
                        </div>
                      </>
                    ) : !!data?.my_address ? (
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
                    ) : data?.delivery_point ? (
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
                  <Button className='map_show mt-3' onClick={handleShowModal}>
                    <MdLocationOn style={{ marginRight: '8px' }} />{' '}
                    {t('show.locations')}
                  </Button>
                </Col>
                <Col span={12}>
                  <QrCode orderId={id} />
                </Col>
              </Row>
            </Card>
          </Spin>
          <Card title={t('documents')}>
            <Table
              columns={documentColumns}
              dataSource={documents}
              pagination={false}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8} className='order_info'>
          {data?.delivery_type === 'delivery' && (
            <Card
              title={t('deliveryman')}
              extra={
                data?.status === 'ready' &&
                data?.delivery_type !== 'pickup' && (
                  <Button onClick={() => setOrderDeliveryDetails(data)}>
                    {t('change')}
                    <EditOutlined />
                  </Button>
                )
              }
            >
              {data?.status === 'new' || data?.status === 'accepted' ? (
                <p>{t('order_status_ready')}</p>
              ) : (
                ''
              )}
              {data?.status !== 'new' &&
              data?.status !== 'accepted' &&
              !data?.deliveryman ? (
                <p>
                  {t('The supplier is not assigned or delivery type pickup')}
                </p>
              ) : (
                ''
              )}

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
                      <span>
                        {isDemo
                          ? hideEmail(data?.deliveryman?.email)
                          : data?.deliveryman?.email}
                      </span>
                    </div>
                  </div>
                </Space>
              )}
            </Card>
          )}

          {data?.type === 2 && data?.delivery_type === 'delivery' && (
            <Card title={t('tracking.info')}>
              <TrackingInfo
                onSubmit={handleUpdateTracking}
                isSubmitting={isUpdating}
                initialData={{
                  track_name: data?.track_name,
                  track_id: data?.track_id,
                  track_url: data?.track_url,
                }}
              />
            </Card>
          )}

          {!!data?.username && (
            <Card title={t('order.receiver')}>
              <div className='customer-info'>
                <span className='title'>{t('name')}</span>
                <span className='description'>
                  <BsFillPersonFill />
                  {data?.username}
                </span>
              </div>
              <div className='customer-info'>
                <span className='title'>{t('phone')}</span>
                <span className='description'>
                  <BsFillTelephoneFill />
                  {data?.phone}
                </span>
              </div>
            </Card>
          )}

          {!!data?.user && (
            <Card
              title={
                <Space>
                  {t('customer.info')}
                  <EditOutlined onClick={() => goToUser()} />
                </Space>
              }
            >
              <div className='d-flex w-100 customer-info-container'>
                {loading ? (
                  <Skeleton.Avatar size={64} shape='square' />
                ) : (
                  <Avatar shape='square' size={64} src={data?.user?.img} />
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
                      ) : isDemo ? (
                        hideEmail(data?.user?.email)
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
                        moment(data?.user?.created_at).format(
                          'DD-MM-YYYY, HH:mm',
                        )
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
                          count={data?.user?.orders_count || 0}
                        />
                      )}
                    </span>
                  </div>
                  <div className='customer-info'>
                    <span className='title'>
                      {t('spent.since.registration')}
                    </span>
                    <span className='description'>
                      {loading ? (
                        <Skeleton.Button size={16} />
                      ) : (
                        <Badge
                          showZero
                          style={{ backgroundColor: '#48e33d' }}
                          count={numberToPrice(
                            data?.user?.orders_sum_price,
                            data?.currency?.symbol,
                            data?.currency?.position,
                          )}
                        />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}
          {data?.shop && (
            <Card
              title={`${t('shop.details')}: #${data?.shop?.id}`}
              loading={loading}
            >
              <Row gutter={12}>
                <Col
                  span={24}
                  style={{
                    display: 'flex',
                    columnGap: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      backgroundColor: '#f5f5f5',
                      overflow: 'hidden',
                      borderRadius: '10px',
                      position: 'relative',
                    }}
                  >
                    <Image
                      alt={t('shop.logo')}
                      style={{ objectFit: 'contain' }}
                      src={
                        data?.shop?.logo_img ||
                        'https://via.placeholder.com/150'
                      }
                      width={100}
                      height={100}
                      preview={false}
                    />
                  </div>
                  <div
                    style={{
                      width: `calc(100% - 100px - 20px)`,
                    }}
                  >
                    <h5
                      style={{
                        maxWidth: '100%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {data?.shop?.translation?.title || '--'}
                    </h5>
                    <p>
                      {data?.shop?.open ? (
                        <Tag color='green'>{t('open')}</Tag>
                      ) : (
                        <Tag color='red'>{t('closed')}</Tag>
                      )}
                    </p>
                  </div>
                </Col>
                <Col span={24}>
                  {data?.shop?.phone && (
                    <p>
                      <strong>{t('phone')}:</strong> {data?.shop?.phone}
                    </p>
                  )}
                  {data?.shop?.translation?.address && (
                    <p>
                      <strong>{t('address')}:</strong>{' '}
                      {data?.shop?.translation?.address}
                    </p>
                  )}
                </Col>
              </Row>
            </Card>
          )}
          {data?.review && !loading && (
            <Card title={t('messages')}>
              <div className='order-message'>
                <span className='message'>{data?.review?.comment}</span>
                <Space className='w-100 justify-content-end'>
                  <span className='date'>
                    {moment(data?.review?.created_at).format(
                      'YYYY-MM-DD HH:mm',
                    )}
                  </span>
                </Space>
              </div>
            </Card>
          )}
        </Col>
        <Col span={24}>
          <Card className='w-100 order-table' title={t('order.products')}>
            <Divider />
            <Table
              ref={productListRef}
              scroll={{ x: true }}
              columns={columns}
              dataSource={activeMenu.data?.details || []}
              loading={loading}
              rowKey={(record) => record?.id}
              pagination={false}
              expandable={{
                expandedRowRender,
                expandIcon: ({ expanded, onExpand, record }) =>
                  expanded ? (
                    <SwapOutlined
                      onClick={(e) => onExpand(record, e)}
                      rotate={90}
                    />
                  ) : (
                    <SwapOutlined
                      onClick={(e) => onExpand(record, e)}
                      rotate={90}
                    />
                  ),
                defaultExpandedRowKeys: ['0'],
              }}
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
                <span>{t('discount')}:</span>
                <br />
                <span>{t('service.fee')}:</span>
                <br />
                <span>{t('coupon.price')}:</span>
                <br />
                <h3>{t('total.price')}:</h3>
              </div>
              <div>
                <span>
                  {numberToPrice(
                    data?.delivery_fee ?? 0,
                    data?.currency?.symbol,
                    data?.currency?.position,
                  )}
                </span>
                <br />
                <span>
                  {numberToPrice(
                    data?.tax,
                    data?.currency?.symbol,
                    data?.currency?.position,
                  )}
                </span>
                <br />
                <span>
                  {numberToPrice(
                    data?.origin_price,
                    data?.currency?.symbol,
                    data?.currency?.position,
                  )}
                </span>
                <br />
                <span>
                  {numberToPrice(
                    data?.total_discount,
                    data?.currency?.symbol,
                    data?.currency?.position,
                  )}
                </span>
                <br />
                <span>
                  {numberToPrice(
                    data?.service_fee,
                    data?.currency?.symbol,
                    data?.currency?.position,
                  )}
                </span>
                <br />
                <span>
                  {numberToPrice(
                    data?.coupon_price,
                    data?.currency?.symbol,
                    data?.currency?.position,
                  )}
                </span>
                <br />
                <h3 ref={totalPriceRef}>
                  {numberToPrice(
                    data?.total_price,
                    data?.currency?.symbol,
                    data?.currency?.position,
                  )}
                </h3>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
      {orderId && (
        <OrderStatusModal
          orderId={orderId}
          handleCancel={handleCloseModal}
          refetchPage={fetchOrder}
        />
      )}
      {orderDeliveryDetails && (
        <OrderDeliveryman
          orderDetails={orderDeliveryDetails}
          handleCancel={handleCloseModal}
        />
      )}
      {locationsMap && (
        <ShowLocationsMap id={locationsMap} handleCancel={handleCloseModal} />
      )}
      {transactionStatusModal && (
        <TransactionStatusModal
          orderId={id}
          handleCancel={() => setTransactionStatusModal(false)}
          transactionDetails={data?.transaction}
          fetchOrder={fetchOrder}
        />
      )}
    </div>
  );
}
