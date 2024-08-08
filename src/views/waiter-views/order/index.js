import React, { useEffect, useState, useContext } from 'react';
import { Button, Space, Table, Card, Tabs, Tag, Select, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ClearOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  addMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import { Context } from '../../../context/context';
import { batch } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { clearItems, fetchOrders } from '../../../redux/slices/waiterOrder';
import { fetchOrders as fetchWaiterOrders } from '../../../redux/slices/waiterOrder';
import useDidUpdate from '../../../helpers/useDidUpdate';
import formatSortType from '../../../helpers/formatSortType';
import SearchInput from '../../../components/search-input';
import numberToPrice from '../../../helpers/numberToPrice';
import FilterColumns from '../../../components/filter-column';
import CustomModal from '../../../components/modal';
import orderService from '../../../services/waiter/order';
import OrderDeliveryman from './orderDeliveryman';
import RiveResult from 'components/rive-result';
import { DebounceSelect } from 'components/search';
import bookingTable from 'services/rest/table';

export default function WaiterOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [id, setId] = useState(null);
  const [text, setText] = useState(null);
  const { setIsModalVisible } = useContext(Context);
  const [isAttaching, setIsAttaching] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual
  );
  const [orderDeliveryDetails, setOrderDeliveryDetails] = useState(null);

  const goToShow = (row) => {
    dispatch(
      addMenu({
        url: `waiter/order/details/${row.id}`,
        id: 'order_details',
        name: t('order.details'),
      })
    );
    navigate(`/waiter/order/details/${row.id}`);
  };

  const handleAttachtoMe = (id) => {
    setIsAttaching(true);
    orderService
      .attachToMe(id)
      .then(() => {
        dispatch(fetchWaiterOrders(paramsData));
      })
      .finally(() => {
        setIsAttaching(false);
      });
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
      title: t('table'),
      dataIndex: 'table',
      key: 'table',
      is_show: true,
      render: (table) => <div>{table?.name}</div>,
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
        </div>
      ),
    },

    {
      title: t('products'),
      dataIndex: 'order_details_count',
      key: 'order_details_count',
      is_show: true,
      render: (order_details_count) => {
        return (
          <div className='text-lowercase'>
            {order_details_count || 0} {t('products')}
          </div>
        );
      },
    },
    {
      title: t('amount'),
      dataIndex: 'total_price',
      key: 'total_price',
      is_show: true,
      render: (total_price) => {
        return numberToPrice(total_price, defaultCurrency?.symbol);
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
      title: t('created.at'),
      is_show: true,
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: t('options'),
      key: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button icon={<EyeOutlined />} onClick={() => goToShow(row)} />
            <Tooltip title={t('assign.to.me')}>
              <Button
                onClick={() => handleAttachtoMe(row.id)}
                type='primary'
                icon={<PlusOutlined />}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ]);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { orders, meta, loading, params } = useSelector(
    (state) => state.waiterOrder,
    shallowEqual
  );
  const data = activeMenu?.data;
  const paramsData = {
    search: data?.search,
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
    user_id: data?.user_id,
    table_id: data?.table_id,
    shop_id:
      activeMenu.data?.shop_id !== null ? activeMenu.data?.shop_id : null,
    delivery_type: 'dine_in',
    'empty-waiter': 1,
    status: 'new',
  };

  function onChangePagination(pagination, filters, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, perPage, page, column, sort },
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
        dispatch(fetchWaiterOrders(paramsData));
        setText(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  useDidUpdate(() => {
    dispatch(fetchWaiterOrders(paramsData));
  }, [activeMenu?.data]);

  useEffect(() => {
    if (activeMenu?.refetch) {
      dispatch(fetchWaiterOrders(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu?.refetch]);

  const handleFilter = (item, name) => {
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, [name]: item },
      })
    );
  };

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  const handleClear = () => {
    batch(() => {
      dispatch(clearItems());
      dispatch(
        setMenuData({
          activeMenu,
          data: null,
        })
      );
    });
    dispatch(fetchOrders({ status: 'all', page: data?.page, perPage: 10 }));
  };

  const handleCloseModal = () => {
    setOrderDeliveryDetails(null);
  };

  async function getTables(search) {
    const params = {
      search,
      perPage: 10,
    };
    return bookingTable.getAllRestTables(params).then(({ data }) => {
      return data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    });
  }

  return (
    <>
      <Card>
        <Space wrap className='p-0 mb-0'>
          <SearchInput
            placeholder={t('search')}
            handleChange={(search) => handleFilter(search, 'search')}
            defaultValue={activeMenu.data?.search}
          />
          <DebounceSelect
            placeholder={t('select.table')}
            fetchOptions={getTables}
            onSelect={(user) => handleFilter(user.value, 'table_id')}
            onDeselect={() => handleFilter(null, 'table_id')}
            style={{ minWidth: 200 }}
          />
          <Button icon={<ClearOutlined />} onClick={handleClear}>
            {t('clear')}
          </Button>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      </Card>

      <Card>
        <Table
          locale={{
            emptyText: <RiveResult />,
          }}
          scroll={{ x: true }}
          rowSelection={rowSelection}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={orders}
          loading={loading || isAttaching}
          pagination={{
            pageSize: params.perPage,
            page: activeMenu.data?.page || 1,
            total: meta?.total,
            defaultCurrent: activeMenu.data?.page,
            current: activeMenu.data?.page,
          }}
          rowKey={(record) => record.id}
          onChange={onChangePagination}
        />
        <CustomModal
          click={orderDelete}
          text={text ? t('delete') : t('all.delete')}
          loading={loadingBtn}
          setText={setId}
        />
      </Card>
      {orderDeliveryDetails && (
        <OrderDeliveryman
          orderDetails={orderDeliveryDetails}
          handleCancel={handleCloseModal}
        />
      )}
    </>
  );
}
