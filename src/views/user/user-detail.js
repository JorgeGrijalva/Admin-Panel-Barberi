import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  PageHeader,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import numberToPrice from 'helpers/numberToPrice';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import userService from 'services/user';
import getImage from 'helpers/getImage';
import { fetchUserOrders } from 'redux/slices/orders';
import formatSortType from 'helpers/formatSortType';
import useDemo from 'helpers/useDemo';
import useDidUpdate from 'helpers/useDidUpdate';
import UserTopProducts from './user-top-products';
import UserRefunds from './user-refunds';
import hideEmail from 'components/hideEmail';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const { defaultLang } = useSelector((state) => state.formLang, shallowEqual);

  const {
    orders,
    meta,
    loading: orderListLoading,
    params,
  } = useSelector((state) => state.orders, shallowEqual);

  const {
    isDemo,
    demoDeliveryman,
    demoSeller,
    demoAdmin,
    demoModerator,
    demoMeneger,
  } = useDemo();

  function fetchUser(uuid) {
    setLoading(true);
    userService
      .getById(uuid)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }

  const expandedRowRender = (row) => {
    const columns = [
      {
        title: t('product'),
        dataIndex: 'product',
        render: (_, data) => (
          <div
            className='text-hover'
            onClick={() => goToProduct(data.stock?.product?.uuid)}
          >
            <Space wrap>
              {data.stock?.product?.translation?.title}
              {data.addons?.map((addon) => (
                <Tag key={addon.id}>
                  {addon?.stock?.product?.translation?.title} x {addon.quantity}
                </Tag>
              ))}
            </Space>
          </div>
        ),
        key: 'product',
      },
      {
        title: t('quantity'),
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: t('total.price'),
        dataIndex: 'total_price',
        render: (price) =>
          numberToPrice(
            price,
            defaultCurrency?.symbol,
            defaultCurrency?.position,
          ),
        key: 'total_price',
      },
      {
        title: t('discount'),
        dataIndex: 'discount',
        key: 'discount',
      },
    ];
    return (
      <Space direction='vertical' className='w-100'>
        <Typography.Text>{t('ordered.products')}</Typography.Text>
        <Table
          scroll={{ x: true }}
          columns={columns}
          dataSource={row.details}
          pagination={false}
        />
      </Space>
    );
  };

  const goToOrder = (id) => {
    dispatch(
      addMenu({
        url: `/order/details/${id}`,
        id: 'order.details',
        name: t('order.details'),
      }),
    );
    navigate(`/order/details/${id}`);
  };

  const goToShop = (uuid) => {
    dispatch(
      addMenu({
        url: `/shop/${uuid}`,
        id: 'edit.shop',
        name: t('edit.shop'),
      }),
    );
    navigate(`/shop/${uuid}`);
  };

  const goToProduct = (uuid) => {
    dispatch(
      addMenu({
        id: `product-edit`,
        url: `product/${uuid}`,
        name: t('edit.product'),
      }),
    );
    navigate(`/product/${uuid}`);
  };

  const goToEdit = () => {
    dispatch(
      addMenu({
        url: `user/${id}`,
        id: 'user_edit',
        name: t('edit.user'),
      }),
    );
    navigate(`/user/${id}`, { state: 'user' });
  };

  function onChangePagination(pagination, filter, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, perPage, page, column, sort },
      }),
    );
  }

  useEffect(() => {
    fetchUser(id);
  }, [id]);

  useEffect(() => {
    const params = {
      user_id: id,
      page: 1,
      perPage: 10,
    };
    dispatch(fetchUserOrders(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDidUpdate(() => {
    const params = {
      user_id: id,
      page: activeMenu?.data?.page || 1,
      perPage: activeMenu?.data?.perPage || 10,
    };
    dispatch(fetchUserOrders(params));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      const params = {
        user_id: id,
        page: activeMenu?.data?.page || 1,
        perPage: activeMenu?.data?.perPage || 10,
      };
      fetchUser(id);
      dispatch(fetchUserOrders(params));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  if (loading)
    return (
      <div className='d-flex justify-content-center align-items-center h-100'>
        <Spin />
      </div>
    );

  return (
    <>
      <PageHeader
        title={t('user.info')}
        extra={
          <Button
            type='primary'
            disabled={
              /*eslint eqeqeq: "off"*/
              (isDemo && data?.id == demoDeliveryman) ||
              (isDemo && data?.id == demoModerator) ||
              (isDemo && data?.id == demoMeneger) ||
              (isDemo && data?.id == demoSeller) ||
              (isDemo && data?.id === demoAdmin)
            }
            onClick={goToEdit}
          >
            {t('edit')}
          </Button>
        }
      />
      <Row gutter={24}>
        <Col span={16}>
          <Card
            title={`${data?.firstname} ${data?.lastname || ''} #${data?.id}`}
          >
            <Image
              src={getImage(data?.img)}
              alt={data?.firstname}
              width={100}
              height={100}
              style={{ borderRadius: '10px', objectFit: 'cover' }}
            />
            <Descriptions column={2}>
              <Descriptions.Item label={t('registration.date')}>
                {moment(data?.registered_at).format('YYYY-MM-DD HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label={t('status')}>
                <Tag color={data?.active ? 'cyan' : 'red'}>
                  {data?.active ? t('active') : t('inactive')}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('birthday')}>
                {moment(data?.birthday).format('YYYY-MM-DD')}
              </Descriptions.Item>
              <Descriptions.Item label={t('email')}>
                {isDemo ? hideEmail(data?.email) : data?.email}
              </Descriptions.Item>
              <Descriptions.Item label={t('gender')}>
                {data?.gender}
              </Descriptions.Item>
              <Descriptions.Item label={t('role')}>
                {data?.role}
              </Descriptions.Item>
              <Descriptions.Item label={t('wallet')}>
                {numberToPrice(
                  data?.wallet?.price,
                  defaultCurrency?.symbol,
                  defaultCurrency?.position,
                )}
              </Descriptions.Item>
              <Descriptions.Item label={t('phone')}>
                {data?.phone ?? t('no.phone.number')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={t('successfull.orders')}>
            <Descriptions column={1}>
              <Descriptions.Item label={t('delivered.orders.count')}>
                <Badge
                  showZero
                  style={{ backgroundColor: '#3d7de3' }}
                  count={data?.o_count || 0}
                />
              </Descriptions.Item>
              <Descriptions.Item label={t('spent.since.registration')}>
                <Badge
                  showZero
                  style={{ backgroundColor: '#48e33d' }}
                  count={
                    numberToPrice(
                      data?.o_sum || 0,
                      defaultCurrency?.symbol,
                      defaultCurrency?.position,
                    ) || 0
                  }
                />
              </Descriptions.Item>
            </Descriptions>
          </Card>
          {data?.shop && (
            <Card title={`${t('shop.info')} #${data?.shop.id}`}>
              <Descriptions column={1}>
                <Descriptions.Item label={t('name')}>
                  {data?.shop.translation.title}
                </Descriptions.Item>
                <Descriptions.Item label={t('phone')}>
                  {data?.shop.phone}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </Col>
        <Col span={24}>
          <Card title={t('orders')}>
            <Table
              expandable={{
                expandedRowRender,
                defaultExpandedRowKeys: ['0'],
              }}
              dataSource={orders}
              columns={[
                {
                  title: 'ID',
                  dataIndex: 'id',
                  key: 'id',
                  render: (id) => (
                    <div onClick={() => goToOrder(id)} className='text-hover'>
                      #{id}
                    </div>
                  ),
                },

                {
                  title: t('number.of.products'),
                  dataIndex: 'order_details_count',
                  key: 'order_details_count',
                  render: (count) =>
                    `${count || 0} ${
                      count && count < 2 ? t('products') : t('product')
                    }`,
                },
                {
                  title: t('total.price'),
                  dataIndex: 'total_price',
                  key: 'total_price',
                  render: (total_price) =>
                    numberToPrice(
                      total_price,
                      defaultCurrency?.symbol,
                      defaultCurrency?.position,
                    ),
                },
                {
                  title: t('delivery.date.&.time'),
                  dataIndex: 'delivery_date',
                  key: 'delivery_date',
                  render: (_, row) =>
                    `${row?.delivery_date} ${row?.delivery_time || ''}`,
                },
                {
                  title: t('status'),
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => <Tag>{status}</Tag>,
                },
                {
                  title: t('delivery.address'),
                  dataIndex: 'address',
                  key: 'address',
                  render: (_, row) => {
                    let address;

                    switch (row?.delivery_type) {
                      case 'delivery':
                        address =
                          row?.my_address?.street_house_number ??
                          t('no.address');
                        break;
                      case 'point':
                        address =
                          row?.delivery_point?.address?.[defaultLang] ??
                          t('no.address');
                        break;
                      case 'digital':
                        address = t('digital.delivery');
                        break;
                      default:
                        address = t('no.address');
                    }

                    return address;
                  },
                },
              ]}
              loading={orderListLoading}
              pagination={{
                pageSize: params.perPage,
                page: params.page,
                total: meta.total,
                defaultCurrent: params.page,
              }}
              rowKey={(record) => record.id}
              onChange={onChangePagination}
            />
          </Card>
          <UserRefunds id={id} />
          <UserTopProducts id={id} />
        </Col>
      </Row>
    </>
  );
};

export default UserDetail;
