import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Card, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import useDidUpdate from 'helpers/useDidUpdate';
import { fetchDeliverymanOrders } from 'redux/slices/orders';
import formatSortType from 'helpers/formatSortType';
import SearchInput from 'components/search-input';
import numberToPrice from 'helpers/numberToPrice';
import FilterColumns from 'components/filter-column';
import { fetchRestOrderStatus } from 'redux/slices/orderStatus';

const { TabPane } = Tabs;

export default function DeliverymanOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const { statusList } = useSelector(
    (state) => state.orderStatus,
    shallowEqual,
  );

  const statuses = [
    { name: 'all', id: '0', active: true, sort: 0 },
    ...statusList,
  ];

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [role, setRole] = useState('accepted');
  const immutable = activeMenu.data?.role || role;
  const data = activeMenu?.data;
  const paramsData = {
    search: data?.search,
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
    user_id: data?.userId,
    status: immutable === 'all' ? undefined : immutable,
  };

  const goToShow = (row) => {
    dispatch(
      addMenu({
        url: `deliveryman/order/details/${row.id}`,
        id: 'order_details',
        name: t('order.details'),
      }),
    );
    navigate(`/deliveryman/order/details/${row.id}`);
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      is_show: true,
    },
    {
      title: t('client'),
      dataIndex: 'user',
      key: 'user',
      is_show: true,
      render: (user) => user?.full_name || t('N/A'),
    },
    {
      title: t('number.of.products'),
      dataIndex: 'order_details_count',
      key: 'rate',
      is_show: true,
      render: (order_details_count) => (
        <div className='text-lowercase'>
          {order_details_count || 0} {t('products')}
        </div>
      ),
    },
    {
      title: t('amount'),
      dataIndex: 'details',
      key: 'price',
      is_show: true,
      render: (_, row) => {
        return numberToPrice(row?.total_price, defaultCurrency.symbol);
      },
    },
    {
      title: t('payment.type'),
      dataIndex: 'transaction',
      key: 'transaction',
      is_show: true,
      render: (transaction) => t(transaction?.payment_system?.tag) || '-',
    },
    {
      title: 'created.at',
      dataIndex: 'created_at',
      key: 'created_at',
      is_show: true,
    },
    {
      title: t('options'),
      key: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button icon={<EyeOutlined />} onClick={() => goToShow(row)} />
          </Space>
        );
      },
    },
  ]);

  const { orders, meta, loading, params } = useSelector(
    (state) => state.orders,
    shallowEqual,
  );

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

  useDidUpdate(() => {
    dispatch(fetchDeliverymanOrders(paramsData));
  }, [activeMenu?.data]);

  useEffect(() => {
    if (activeMenu?.refetch) {
      dispatch(fetchDeliverymanOrders(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu?.refetch]);

  useEffect(() => {
    console.log('fetching...');
    dispatch(fetchRestOrderStatus({}));
  }, []);

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      }),
    );
  };

  return (
    <Card
      title={t('orders')}
      extra={
        <Space wrap>
          <SearchInput
            placeholder={t('search')}
            handleChange={(e) => handleFilter({ search: e })}
            defaultValue={activeMenu.data?.search}
            resetSearch={!activeMenu.data?.search}
          />
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Tabs
        onChange={(key) => {
          handleFilter({ role: key, page: 1 });
          setRole(key);
        }}
        type='card'
        activeKey={immutable}
      >
        {statuses
          .filter((item) => item.active)
          .map((item) => (
            <TabPane tab={t(item.name)} key={item.name} />
          ))}
      </Tabs>
      <Table
        scroll={{ x: true }}
        columns={columns?.filter((item) => item.is_show)}
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
    </Card>
  );
}
