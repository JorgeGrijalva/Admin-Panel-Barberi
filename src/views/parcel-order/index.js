import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Space,
  Table,
  Card,
  Tabs,
  Tag,
  DatePicker,
  Tooltip,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ClearOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import useDidUpdate from 'helpers/useDidUpdate';
import { clearItems } from 'redux/slices/orders';
import { fetchParcelOrders } from 'redux/slices/parcelOrders';
import formatSortType from 'helpers/formatSortType';
import SearchInput from 'components/search-input';
import { clearOrder } from 'redux/slices/order';
import { DebounceSelect } from 'components/search';
import userService from 'services/user';
import FilterColumns from 'components/filter-column';
import { toast } from 'react-toastify';
import DeleteButton from 'components/delete-button';
import parcelOrderService from '../../services/parcelOrder';
import { Context } from 'context/context';
import CustomModal from 'components/modal';
import moment from 'moment';
import { export_url } from 'configs/app-global';
import { BiMap } from 'react-icons/bi';
import { CgExport } from 'react-icons/cg';
import { batch } from 'react-redux';
import { useQueryParams } from 'helpers/useQueryParams';
import ParcelStatus from './parcel-status';
import ShowLocationsMap from './show-locations-map';
import ShowParcelDetails from './show-parcel-details';
import ParcelDeliveryman from './parcel-deliveryman';
import { fetchOrderStatus } from 'redux/slices/orderStatus';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export default function ParserOrders() {
  const { type } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const { t } = useTranslation();
  const { statusList, loading: roleLoading } = useSelector(
    (state) => state.orderStatus,
    shallowEqual,
  );
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const [orderDetails, setOrderDetails] = useState(null);
  const [locationsMap, setLocationsMap] = useState(null);
  const [parcelDeliveryDetails, setOrderDeliveryDetails] = useState(null);
  const statuses = [
    { name: 'all', id: '0', active: true, sort: 0 },
    ...statusList,
  ];

  const goToEdit = (row) => {
    dispatch(clearOrder());
    dispatch(
      addMenu({
        url: `parcel-orders/${row.id}`,
        id: 'edit_parcel_order',
        name: t('edit.parcel.order'),
      }),
    );
    navigate(`/parcel-orders/${row.id}`);
  };

  const goToShow = (row) => {
    queryParams.set('parcelId', row.id);
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
          {user?.firstname} {user?.lastname || ''}
        </div>
      ),
    },
    {
      title: t('status'),
      is_show: true,
      dataIndex: 'status',
      key: 'status',
      render: (status, row) => (
        <div className='cursor-pointer'>
          {status === 'new' ? (
            <Tag color='blue'>{t(status)}</Tag>
          ) : status === 'canceled' ? (
            <Tag color='error'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
          {status !== 'delivered' && status !== 'canceled' ? (
            <EditOutlined
              onClick={(e) => {
                e.stopPropagation();
                setOrderDetails(row);
              }}
            />
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
          {row?.status === 'ready' && row?.delivery_type !== 'pickup' ? (
            <Button type='link' onClick={() => setOrderDeliveryDetails(row)}>
              <Space>
                {deliveryman
                  ? `${deliveryman?.firstname} ${deliveryman?.lastname}`
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
      render: (date) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: t('delivery.date'),
      is_show: true,
      dataIndex: 'delivery_date',
      key: 'delivery_date',
      render: (date) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: t('options'),
      is_show: true,
      key: 'options',
      render: (_, row) => {
        return (
          <Space>
            <Button
              icon={<BiMap />}
              onClick={(e) => {
                e.stopPropagation();
                setLocationsMap(row.id);
              }}
            />
            <Button
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                goToShow(row);
              }}
            />
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                goToEdit(row);
              }}
              disabled={row.status === 'delivered' || row.status === 'canceled'}
            />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setId([row.id]);
                setIsModalVisible(true);
                setText(true);
              }}
            />
          </Space>
        );
      },
    },
  ]);

  const { setIsModalVisible } = useContext(Context);
  const [downloading, setDownloading] = useState(false);
  const [role, setRole] = useState(queryParams.values.status || 'all');
  const immutable = activeMenu.data?.role || role;
  const data = activeMenu.data;

  const [id, setId] = useState(null);
  const [text, setText] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [dateRange, setDateRange] = useState(
    moment().subtract(1, 'months'),
    moment(),
  );
  const {
    data: orders,
    loading,
    params,
    meta,
  } = useSelector((state) => state.parcelOrders, shallowEqual);

  const paramsData = {
    search: data?.search,
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
    user_id: data?.user_id,
    status: immutable === 'all' ? undefined : immutable,
    shop_id:
      activeMenu.data?.shop_id !== null ? activeMenu.data?.shop_id : null,
    delivery_type: type !== 'scheduled' ? type : undefined,
    delivery_date_from:
      type === 'scheduled'
        ? moment().add(1, 'day').format('YYYY-MM-DD')
        : undefined,
    date_from: dateRange ? dateRange[0]?.format('YYYY-MM-DD') : null,
    date_to: dateRange ? dateRange[1]?.format('YYYY-MM-DD') : null,
  };

  function onChangePagination(pagination, filters, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, perPage, page, column, sort },
      }),
    );
  }

  const orderDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };

    parcelOrderService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
        dispatch(fetchParcelOrders(paramsData));
        setText(null);
        setId(null);
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  useDidUpdate(() => {
    dispatch(fetchParcelOrders(paramsData));
  }, [data, dateRange, type]);

  const handleFilter = (item, name) => {
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...{ [name]: item } },
      }),
    );
  };

  async function getUsers(search) {
    const params = {
      search,
      perPage: 10,
    };
    return userService.search(params).then(({ data }) => {
      return data.map((item) => ({
        label: `${item?.firstname} ${item?.lastname}`,
        value: item?.id,
        key: item?.id,
      }));
    });
  }

  const goToOrderCreate = () => {
    batch(() => {
      dispatch(clearOrder());
      dispatch(
        addMenu({
          id: 'parcel-orders/add',
          url: 'parcel-orders/add',
          name: 'add.parcel.order',
        }),
      );
    });
    navigate('/parcel-orders/add');
  };

  const excelExport = () => {
    setDownloading(true);
    const params =
      role !== 'all'
        ? {
            status: role,
          }
        : null;

    parcelOrderService
      .export(params)
      .then((res) => {
        window.location.href = export_url + res?.data?.file_name;
      })
      .finally(() => setDownloading(false));
  };

  const onChangeTab = (status) => {
    const orderStatus = status;
    dispatch(setMenuData({ activeMenu, data: { role: orderStatus, page: 1 } }));
    setRole(status);
    navigate(`?status=${orderStatus}`);
  };

  const handleCloseModal = () => {
    setOrderDetails(null);
    setOrderDeliveryDetails(null);
    setLocationsMap(null);
    queryParams.clear();
  };

  useEffect(() => {
    if (activeMenu?.refetch) {
      batch(() => {
        dispatch(fetchParcelOrders(paramsData));
        dispatch(disableRefetch(activeMenu));
      });
    }
  }, [activeMenu?.refetch]);

  useEffect(() => {
    dispatch(fetchOrderStatus({}));
  }, []);

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

  const handleClear = () => {
    batch(() => {
      dispatch(clearItems());
      dispatch(
        setMenuData({
          activeMenu,
          data: null,
        }),
      );
      dispatch(
        fetchParcelOrders({
          status: undefined,
          page: data?.page,
          perPage: 20,
        }),
      );
    });
    setDateRange(undefined);
  };

  return (
    <>
      <Space className='justify-content-end w-100 mb-3'>
        <Button
          type='primary'
          icon={<PlusCircleOutlined />}
          onClick={goToOrderCreate}
          style={{ width: '100%' }}
        >
          {t('add.parcel.order')}
        </Button>
      </Space>
      <Card>
        <Space wrap className='order-filter'>
          <SearchInput
            defaultValue={data?.search}
            resetSearch={!data?.search}
            placeholder={t('search')}
            handleChange={(search) => handleFilter(search, 'search')}
          />
          <DebounceSelect
            placeholder={t('select.client')}
            fetchOptions={getUsers}
            onSelect={(user) => handleFilter(user.value, 'user_id')}
            onDeselect={() => handleFilter(null, 'user_id')}
            style={{ width: '100%' }}
            value={data?.user_id}
          />
          <RangePicker
            value={dateRange}
            onChange={(values) => setDateRange(values)}
            disabledDate={(current) => {
              return current && current > moment().endOf('day');
            }}
            style={{ width: '100%' }}
          />
          <Button
            onClick={excelExport}
            loading={downloading}
            style={{ width: '100%' }}
          >
            <CgExport className='mr-2' />
            {t('export')}
          </Button>
          <Button
            onClick={handleClear}
            style={{ width: '100%' }}
            icon={<ClearOutlined />}
          >
            {t('clear')}
          </Button>
        </Space>
      </Card>

      <Card loading={roleLoading}>
        <Space className='justify-content-between align-items-start w-100'>
          <Tabs onChange={onChangeTab} type='card' activeKey={immutable}>
            {statuses
              .filter((ex) => ex.active === true)
              .map((item) => {
                return <TabPane tab={t(item.name)} key={item.name} />;
              })}
          </Tabs>
          <Space>
            {id !== null && id.length !== 0 && (
              <Tooltip title={t('delete.selected')}>
                <DeleteButton type='primary' onClick={allDelete} danger />
              </Tooltip>
            )}
            <FilterColumns setColumns={setColumns} columns={columns} iconOnly />
          </Space>
        </Space>
        <Table
          scroll={{ x: true }}
          rowSelection={rowSelection}
          columns={columns?.filter((items) => items.is_show)}
          dataSource={orders}
          loading={loading}
          pagination={{
            pageSize: params.perPage,
            page: activeMenu.data?.page || 1,
            total: meta.total,
            defaultCurrent: activeMenu.data?.page,
            current: activeMenu.data?.page,
          }}
          rowKey={(record) => record.id}
          onChange={onChangePagination}
        />
      </Card>

      {orderDetails && (
        <ParcelStatus
          orderDetails={orderDetails}
          handleCancel={handleCloseModal}
          status={statusList}
        />
      )}
      {parcelDeliveryDetails && (
        <ParcelDeliveryman
          orderDetails={parcelDeliveryDetails}
          handleCancel={handleCloseModal}
        />
      )}
      {locationsMap && (
        <ShowLocationsMap id={locationsMap} handleCancel={handleCloseModal} />
      )}
      {!!queryParams?.values?.parcelId && (
        <ShowParcelDetails
          id={queryParams?.values?.parcelId}
          handleCancel={handleCloseModal}
        />
      )}
      <CustomModal
        click={orderDelete}
        text={text ? t('delete') : t('all.delete')}
        loading={loadingBtn}
        setText={setId}
      />
    </>
  );
}
