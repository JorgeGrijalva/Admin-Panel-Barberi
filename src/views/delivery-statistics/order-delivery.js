import React, { useContext, useEffect, useState } from 'react';
import { Button, Space, Table, Card, Tabs, Tag, DatePicker } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from '../../redux/slices/menu';
import { useTranslation } from 'react-i18next';

import useDidUpdate from '../../helpers/useDidUpdate';
import { fetchOrders } from '../../redux/slices/orders';
import formatSortType from '../../helpers/formatSortType';
import SearchInput from '../../components/search-input';
import numberToPrice from '../../helpers/numberToPrice';
import OrderStatusModal from '../order/orderStatusModal';
import OrderDeliveryman from '../order/orderDeliveryman';
import FilterColumns from '../../components/filter-column';
import { BiMap } from 'react-icons/bi';
import ShowLocationsMap from '../order/show-locations.map';
import DownloadModal from '../order/downloadModal';
import { toast } from 'react-toastify';
import DeleteButton from '../../components/delete-button';
import orderService from '../../services/order';
import { Context } from '../../context/context';
import CustomModal from '../../components/modal';
import { export_url } from '../../configs/app-global';
import Loading from '../../components/loading';
import DeliveryStatistic from '../../components/delivery-statistic';
import moment from 'moment';
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default function DeliveryManOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual
  );

  const [orderDetails, setOrderDetails] = useState(null);
  const [locationsMap, setLocationsMap] = useState(null);
  const [dowloadModal, setDowloadModal] = useState(null);
  const [orderDeliveryDetails, setOrderDeliveryDetails] = useState(null);
  const { id: deliverymanId } = useParams();
  const statuses = [
    { id: 7, name: 'all' },
    { id: 3, name: 'ready' },
    { id: 4, name: 'on_a_way' },
    { id: 5, name: 'delivered' },
    { id: 6, name: 'canceled' },
  ];

  const goToShow = (row) => {
    dispatch(
      addMenu({
        url: `order/details/${row.id}`,
        id: 'order_details',
        name: t('order.details'),
      })
    );
    navigate(`/order/details/${row.id}`);
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      is_show: true,
      dataIndex: 'id',
      key: 'id',
      sorter: true,
    },
    {
      title: t('client'),
      is_show: true,
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <div>
          {user?.firstname} {user?.lastname}
        </div>
      ),
    },
    {
      title: t('number.of.products'),
      is_show: true,
      dataIndex: 'order_details_count',
      key: 'order_details_count',
      render: (order_details_count) => (
        <div className='text-lowercase'>
          {order_details_count || 0} {t('products')}
        </div>
      ),
    },
    {
      title: t('status'),
      is_show: true,
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
          {status !== 'delivered' && status !== 'canceled' ? (
            <EditOutlined onClick={() => setOrderDetails(row)} />
          ) : (
            ''
          )}
        </div>
      ),
    },
    {
      title: t('deliveryman'),
      is_show: true,
      dataIndex: 'deliveryman',
      key: 'deliveryman',
      render: (deliveryman, row) => (
        <div>
          {row.status === 'ready' && row.delivery_type !== 'pickup' ? (
            <Button type='link' onClick={() => setOrderDeliveryDetails(row)}>
              <Space>
                {deliveryman
                  ? `${deliveryman.firstname} ${deliveryman.lastname}`
                  : t('add.deliveryman')}
                <EditOutlined />
              </Space>
            </Button>
          ) : (
            <div>
              {deliveryman?.firstname} {deliveryman?.lastname}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('amount'),
      is_show: true,
      dataIndex: 'total_price',
      key: 'total_price',
      render: (total_price) =>
        numberToPrice(total_price, defaultCurrency.symbol),
    },
    {
      title: t('payment.type'),
      is_show: true,
      dataIndex: 'transaction',
      key: 'transaction',
      render: (transaction) => t(transaction?.payment_system?.tag) || '-',
    },
    {
      title: t('created.at'),
      is_show: true,
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: t('options'),
      is_show: true,
      key: 'options',
      render: (data, row) => {
        return (
          <Space>
            <Button icon={<BiMap />} onClick={() => setLocationsMap(row.id)} />
            <Button icon={<EyeOutlined />} onClick={() => goToShow(row)} />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setId([row.id]);
                setIsModalVisible(true);
                setText(true);
              }}
            />
            <Button
              icon={<DownloadOutlined />}
              onClick={() => setDowloadModal(row.id)}
            />
          </Space>
        );
      },
    },
  ]);

  const { setIsModalVisible } = useContext(Context);
  const [downloading, setDownloading] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [id, setId] = useState(null);
  const [text, setText] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { orders, meta, loading, params, statistic } = useSelector(
    (state) => state.orders,
    shallowEqual
  );
  const data = activeMenu?.data;

  function onChangePagination(pagination, filter, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, perPage, page, column, sort },
      })
    );
  }

  const orderDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    orderService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
        dispatch(fetchOrders());
        setText(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  useDidUpdate(() => {
    const paramsData = {
      search: data?.search,
      sort: data?.sort,
      column: data?.column,
      perPage: data?.perPage,
      page: data?.page,
      deliveryman: deliverymanId,
      date_from: data?.date_from,
      date_to: data?.date_to,
      status:
        data?.status === 'deliveryman.attached' ? undefined : data?.status,
      'isset-deliveryman': data?.status === 'deliveryman.attached' ? 1 : 0,
    };
    dispatch(fetchOrders(paramsData));
  }, [activeMenu?.data]);

  const handleFilter = (item, name) => {
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, [name]: item },
      })
    );
  };

  const excelExport = () => {
    setDownloading(true);
    orderService
      .export()
      .then((res) => {
        const body = export_url + res.data.file_name;
        window.location.href = body;
      })
      .finally(() => setDownloading(false));
  };

  const onChangeTab = (status) => {
    const orderStatus = status;
    dispatch(setMenuData({ activeMenu, data: { status: orderStatus } }));
  };

  const handleCloseModal = () => {
    setOrderDetails(null);
    setOrderDeliveryDetails(null);
    setLocationsMap(null);
    setDowloadModal(null);
  };

  useEffect(() => {
    if (activeMenu?.refetch) {
      const params = {
        status: data?.status,
        page: data?.page,
        perPage: 10,
        type: 'delivery',
        deliveryman: deliverymanId,
      };
      dispatch(fetchOrders(params));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu?.refetch]);

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  const allDelete = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
      setText(false);
    }
  };

  const handleFilterDate = (item) => {
    dispatch(
      setMenuData({
        activeMenu,
        data: {
          ...data,
          date_from: item
            ? moment(item?.[0]).format('YYYY-MM-DD').toString()
            : undefined,
          date_to: item
            ? moment(item?.[1]).format('YYYY-MM-DD').toString()
            : undefined,
        },
      })
    );
  };

  return (
    <div>
      <div>
        {loading ? <Loading /> : <DeliveryStatistic data={statistic} />}
      </div>
      <Card
        title={t('orders')}
        extra={
          <Space>
            <RangePicker
              format='YYYY-MM-DD'
              onChange={(e) => handleFilterDate(e)}
            />
            <DeleteButton type='danger' onClick={allDelete}>
              {t('delete.all')}
            </DeleteButton>
            <Button onClick={excelExport} loading={downloading}>
              {t('export')}
            </Button>
            <FilterColumns setColumns={setColumns} columns={columns} />
          </Space>
        }
      >
        <div className='mt-2 mb-4'>
          <SearchInput
            placeholder={t('search')}
            width={480}
            handleChange={(search) => handleFilter(search, 'search')}
            defaultValue={activeMenu.data?.search}
            resetSearch={!activeMenu.data?.search}
          />
        </div>
        <Tabs onChange={onChangeTab} type='card' activeKey={data?.status}>
          {statuses.map((item) => (
            <TabPane tab={t(item.name)} key={item.name} />
          ))}
        </Tabs>
        <Table
          scroll={{ x: true }}
          rowSelection={rowSelection}
          columns={columns?.filter((items) => items.is_show)}
          dataSource={orders}
          loading={loading}
          pagination={{
            pageSize: params.perPage,
            page: params.page,
            total: meta.total,
            defaultCurrent: params.page,
          }}
          rowKey={(record) => record.id}
          onChange={onChangePagination}
        />
        {orderDetails && (
          <OrderStatusModal
            orderDetails={orderDetails}
            handleCancel={handleCloseModal}
            status={statuses}
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
        {dowloadModal && (
          <DownloadModal id={dowloadModal} handleCancel={handleCloseModal} />
        )}
        <CustomModal
          click={orderDelete}
          text={text ? t('delete') : t('all.delete')}
          loading={loadingBtn}
          setText={setId}
        />
      </Card>
    </div>
  );
}
