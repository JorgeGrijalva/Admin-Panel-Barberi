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
  DownloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';

import useDidUpdate from 'helpers/useDidUpdate';
import { clearItems, fetchOrders } from 'redux/slices/orders';
import formatSortType from 'helpers/formatSortType';
import SearchInput from 'components/search-input';
import numberToPrice from 'helpers/numberToPrice';
import { DebounceSelect } from 'components/search';
import userService from 'services/user';
import FilterColumns from 'components/filter-column';
import { fetchOrderStatus } from 'redux/slices/orderStatus';

import ShowLocationsMap from './show-locations.map';
import DownloadModal from './downloadModal';
import { toast } from 'react-toastify';
import DeleteButton from 'components/delete-button';
import orderService from 'services/order';
import { Context } from 'context/context';
import CustomModal from 'components/modal';
import moment from 'moment';
import { export_url } from 'configs/app-global';
import { BiMap } from 'react-icons/bi';
import { CgExport } from 'react-icons/cg';
import shopService from 'services/restaurant';
import { batch } from 'react-redux';
import { useQueryParams } from 'helpers/useQueryParams';
import regionService from 'services/deliveryzone/region';
import countryService from 'services/deliveryzone/country';
import cityService from 'services/deliveryzone/city';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export default function OrderList() {
  const { type } = useParams();
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
  const [locationsMap, setLocationsMap] = useState(null);
  const [downloadModal, setDownloadModal] = useState(null);
  const statuses = [
    { name: 'all', id: '0', active: true, sort: 0 },
    ...statusList,
  ];

  const goToShow = (row) => {
    dispatch(
      addMenu({
        url: `order/details/seller/${row.id}`,
        id: 'order_details',
        name: t('order.details'),
      }),
    );
    navigate(`/order/details/seller/${row.id}`);
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
          {row.status === 'ready' && row.delivery_type !== 'pickup' ? null : (
            <div>
              {deliveryman?.firstname} {deliveryman?.lastname}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('number.of.products'),
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
      is_show: true,
      dataIndex: 'total_price',
      key: 'total_price',
      render: (total_price, row) => {
        const status = row.transaction?.status;
        return (
          <>
            <span>
              {numberToPrice(
                total_price,
                row?.currency?.symbol,
                row?.currency?.position,
              )}
            </span>
            <br />
            <span
              className={
                status === 'progress'
                  ? 'text-primary'
                  : status === 'paid'
                  ? 'text-success'
                  : status === 'rejected'
                  ? 'text-danger'
                  : 'text-info'
              }
            >
              {row.transaction?.status}
            </span>
          </>
        );
      },
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
      render: (created_at) => moment(created_at).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: t('delivery.date'),
      is_show: true,
      dataIndex: 'delivery_date',
      key: 'delivery_date',
      render: (delivery_date) =>
        moment(delivery_date).format('YYYY-MM-DD HH:mm'),
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
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setId([row.id]);
                setIsModalVisible(true);
                setText(true);
              }}
            />
            <Button
              icon={<DownloadOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setDownloadModal(row.id);
              }}
            />
          </Space>
        );
      },
    },
  ]);

  const { setIsModalVisible } = useContext(Context);
  const [downloading, setDownloading] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const queryParams = useQueryParams();
  const [role, setRole] = useState(queryParams.values.status || 'all');
  const immutable = activeMenu.data?.role || role;
  const [id, setId] = useState(null);
  const [text, setText] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [dateRange, setDateRange] = useState(
    moment().subtract(1, 'months'),
    moment(),
  );
  const { orders, loading, params, meta } = useSelector(
    (state) => state.orders,
    shallowEqual,
  );
  const data = activeMenu.data;
  const paramsData = {
    search: data?.search,
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
    user_id: data?.user_id,
    region_id: data?.region?.value,
    country_id: data?.country?.value,
    city_id: data?.city?.value,
    status: immutable === 'all' ? undefined : immutable,
    type: '2',
    shop_id:
      activeMenu.data?.shop_id !== null ? activeMenu.data?.shop_id : null,
    delivery_type: type !== 'scheduled' ? type : undefined,
    delivery_date_from:
      type === 'scheduled'
        ? moment().add(1, 'day').format('YYYY-MM-DD')
        : undefined,
    date_from: dateRange?.[0]?.format('YYYY-MM-DD') || null,
    date_to: dateRange?.[1]?.format('YYYY-MM-DD') || null,
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

    orderService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
        dispatch(fetchOrders(paramsData));
        setText(null);
      })
      .finally(() => {
        setId(null);
        setLoadingBtn(false);
      });
  };

  useDidUpdate(() => {
    dispatch(fetchOrders(paramsData));
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

  const excelExport = () => {
    setDownloading(true);
    orderService
      .export(paramsData)
      .then((res) => (window.location.href = export_url + res?.data?.file_name))
      .finally(() => setDownloading(false));
  };

  const onChangeTab = (status) => {
    const orderStatus = status;
    dispatch(setMenuData({ activeMenu, data: { role: orderStatus, page: 1 } }));
    setRole(status);
    navigate(`?status=${orderStatus}`);
  };

  const handleCloseModal = () => {
    setLocationsMap(null);
    setDownloadModal(null);
  };

  async function fetchShops(search) {
    const params = { search, status: 'approved' };
    return shopService.getAll(params).then(({ data }) =>
      data.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  }

  const fetchRegions = (search) => {
    const params = {
      search,
      perPage: 10,
      page: 1,
    };

    return regionService.get(params).then(({ data }) =>
      data?.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const fetchCountry = (search) => {
    const params = {
      search,
      perPage: 10,
      page: 1,
      region_id: activeMenu?.data?.region?.value,
    };

    return countryService.get(params).then(({ data }) =>
      data?.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const fetchCity = (search) => {
    const params = {
      search,
      perPage: 10,
      page: 1,
      country_id: activeMenu?.data?.country?.value,
    };

    return cityService.get(params).then(({ data }) =>
      data?.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  useEffect(() => {
    if (activeMenu?.refetch) {
      batch(() => {
        dispatch(fetchOrders(paramsData));
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
      dispatch(fetchOrders({ status: null, page: data?.page, perPage: 20 }));
    });
  };

  return (
    <>
      <Space className='justify-content-end w-100 mb-3'>
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
      <Card>
        <Space wrap className='order-filter'>
          <SearchInput
            defaultValue={data?.search}
            resetSearch={!data?.search}
            placeholder={t('search')}
            handleChange={(search) => handleFilter(search, 'search')}
          />
          <DebounceSelect
            placeholder={t('select.shop')}
            fetchOptions={fetchShops}
            style={{ width: '100%' }}
            onSelect={(shop) => handleFilter(shop.value, 'shop_id')}
            onDeselect={() => handleFilter(null, 'shop_id')}
            allowClear={true}
            value={data?.shop_id}
          />
          <DebounceSelect
            placeholder={t('select.client')}
            fetchOptions={getUsers}
            onSelect={(user) => handleFilter(user.value, 'user_id')}
            onDeselect={() => handleFilter(null, 'user_id')}
            style={{ width: '100%' }}
            value={data?.user_id}
          />
          <DebounceSelect
            placeholder={t('select.region')}
            fetchOptions={fetchRegions}
            onSelect={(region) => {
              dispatch(
                setMenuData({
                  activeMenu,
                  data: {
                    ...data,
                    region,
                    country: null,
                    city: null,
                  },
                }),
              );
            }}
            onDeselect={() => {
              dispatch(
                setMenuData({
                  activeMenu,
                  data: {
                    ...data,
                    region: null,
                    country: null,
                    city: null,
                  },
                }),
              );
            }}
            allowClear={true}
            style={{ width: '100%' }}
            value={data?.region}
            autoComplete={'none'}
          />
          <DebounceSelect
            placeholder={t('select.country')}
            fetchOptions={fetchCountry}
            refetchOptions={true}
            onSelect={(country) => {
              dispatch(
                setMenuData({
                  activeMenu,
                  data: {
                    ...data,
                    country,
                    city: null,
                  },
                }),
              );
            }}
            onDeselect={() => {
              dispatch(
                setMenuData({
                  activeMenu,
                  data: { ...data, country: null, city: null },
                }),
              );
            }}
            style={{ width: '100%' }}
            value={data?.country}
            autoComplete={'none'}
            disabled={!data?.region?.value}
            allowClear={true}
          />
          <DebounceSelect
            placeholder={t('select.city')}
            fetchOptions={fetchCity}
            refetchOptions={true}
            onSelect={(city) =>
              dispatch(setMenuData({ activeMenu, data: { ...data, city } }))
            }
            onDeselect={() =>
              dispatch(
                setMenuData({ activeMenu, data: { ...data, city: null } }),
              )
            }
            style={{ width: '100%' }}
            value={data?.city}
            autoComplete={'none'}
            disabled={!data?.country?.value || !data?.region?.value}
            allowClear={true}
          />
          <RangePicker
            value={dateRange}
            onChange={(values) => {
              handleFilter((prev) => ({
                ...prev,
                ...{
                  date_from: values?.[0]?.format('YYYY-MM-DD'),
                  date_to: values?.[1]?.format('YYYY-MM-DD'),
                },
              }));
              setDateRange(values);
            }}
            disabledDate={(current) => {
              return current && current > moment().endOf('day');
            }}
            style={{ width: '100%' }}
          />
        </Space>
      </Card>

      <Card>
        <Space className='justify-content-between align-items-start w-100'>
          <Tabs onChange={onChangeTab} type='card' activeKey={immutable}>
            {statuses
              .filter((ex) => ex.active === true)
              .map((item) => {
                return <TabPane tab={t(item.name)} key={item.name} />;
              })}
          </Tabs>
          <Space>
            <Tooltip title={t('delete.selected')}>
              <DeleteButton type='primary' onClick={allDelete} />
            </Tooltip>
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
            // total: statistic?.orders_count,
            total: meta?.total,
            defaultCurrent: activeMenu.data?.page,
            current: activeMenu.data?.page,
          }}
          rowKey={(record) => record.id}
          onChange={onChangePagination}
          onRow={(record) => {
            return {
              onClick: () => {
                goToShow(record);
              },
            };
          }}
        />
      </Card>

      {locationsMap && (
        <ShowLocationsMap id={locationsMap} handleCancel={handleCloseModal} />
      )}
      {downloadModal && (
        <DownloadModal id={downloadModal} handleCancel={handleCloseModal} />
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
