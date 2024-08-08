import React, { useContext, useEffect, useState } from 'react';
import { Button, Space, Card, DatePicker } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ClearOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  addMenu,
  disableRefetch,
  setMenu,
  setMenuData,
} from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import useDidUpdate from 'helpers/useDidUpdate';

import {
  clearItems,
  fetchAcceptedOrders,
  fetchCanceledOrders,
  fetchDeliveredOrders,
  fetchNewOrders,
  fetchOnAWayOrders,
  fetchOrders,
  fetchReadyOrders,
  fetchCookingOrders,
  fetchPauseOrders,
} from 'redux/slices/orders';

import {
  fetchRestOrderStatus,
  fetchOrderStatus,
} from 'redux/slices/orderStatus';

import SearchInput from 'components/search-input';
import { clearOrder } from 'redux/slices/order';
import { DebounceSelect } from 'components/search';
import userService from 'services/user';
import OrderStatusModal from './orderStatusModal';
import OrderDeliveryman from './orderDeliveryman';

import ShowLocationsMap from './show-locations.map';
import DownloadModal from './downloadModal';
import { toast } from 'react-toastify';
import orderService from 'services/order';
import { Context } from 'context/context';
import CustomModal from 'components/modal';
import moment from 'moment';
import shopService from 'services/restaurant';
import Incorporate from './dnd/Incorporate';
import { batch } from 'react-redux';
import OrderTypeSwitcher from './order-type-switcher';
import { CgExport } from 'react-icons/cg';
import { export_url } from 'configs/app-global';
import regionService from 'services/deliveryzone/region';
import countryService from 'services/deliveryzone/country';
import cityService from 'services/deliveryzone/city';

const { RangePicker } = DatePicker;

export default function OrderBoard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { type } = useParams();

  const { statusList } = useSelector(
    (state) => state.orderStatus,
    shallowEqual,
  );

  const [orderDetails, setOrderDetails] = useState(null);
  const [locationsMap, setLocationsMap] = useState(null);
  const [downloadModal, setDownloadModal] = useState(null);
  const [downloading, setDownLoading] = useState(false);
  const [orderDeliveryDetails, setOrderDeliveryDetails] = useState(null);
  const [tabType, setTabType] = useState(null);

  const goToEdit = (row) => {
    dispatch(clearOrder());
    dispatch(
      addMenu({
        url: `order/${row.id}`,
        id: 'order_edit',
        name: t('edit.order'),
      }),
    );
    navigate(`/order/${row.id}`);
  };

  const goToShow = (row) => {
    dispatch(
      addMenu({
        url: `order/details/${row.id}`,
        id: 'order_details',
        name: t('order.details'),
      }),
    );
    navigate(`/order/details/${row.id}`);
  };

  const goToOrderCreate = () => {
    dispatch(clearOrder());
    dispatch(
      setMenu({
        id: 'pos.system_01',
        url: 'pos-system',
        name: 'pos.system',
      }),
    );
    navigate('/pos-system');
  };

  const { setIsModalVisible } = useContext(Context);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [id, setId] = useState(null);
  const [text, setText] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const data = activeMenu?.data;

  const paramsData = {
    search: data?.search ? data.search : undefined,
    perPage: data?.perPage || 5,
    page: data?.page || 1,
    user_id: data?.client_id,
    region_id: data?.region?.value,
    country_id: data?.country?.value,
    city_id: data?.city?.value,
    status: data?.role,
    type: '1',
    shop_id:
      activeMenu.data?.shop_id !== null ? activeMenu.data?.shop_id : null,
    delivery_type: type !== 'scheduled' ? type : undefined,
    delivery_date_from:
      type === 'scheduled'
        ? moment().add(1, 'day').format('YYYY-MM-DD')
        : undefined,
    date_from: dateRange?.[0]?.format('YYYY-MM-DD') || undefined,
    date_to: dateRange?.[1]?.format('YYYY-MM-DD') || undefined,
  };

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
        setIsModalVisible(false);
        setText(null);
        dispatch(clearItems());
        fetchOrderAllItem({ status: tabType });
        toast.success(t('successfully.deleted'));
      })
      .finally(() => setLoadingBtn(false));
  };

  useDidUpdate(() => {
    // dispatch(handleSearch(paramsData));
    dispatch(clearItems());
    fetchOrderAllItem();
  }, [data, dateRange]);

  const excelExport = () => {
    setDownLoading(true);
    orderService
      .export(paramsData)
      .then((res) => (window.location.href = export_url + res.data.file_name))
      .finally(() => setDownLoading(false));
  };

  const handleFilter = (item, name) => {
    batch(() => {
      dispatch(clearItems());
      dispatch(
        setMenuData({
          activeMenu,
          data: { ...data, ...{ [name]: item } },
        }),
      );
    });
  };

  async function getUsers(search) {
    const params = {
      search,
      perPage: 10,
    };
    return userService.search(params).then(({ data }) => {
      return data.map((item) => ({
        label: `${item.firstname} ${item.lastname}`,
        value: item.id,
        key: item.id,
      }));
    });
  }

  const handleCloseModal = () => {
    setOrderDetails(null);
    setOrderDeliveryDetails(null);
    setLocationsMap(null);
    setDownloadModal(null);
  };

  async function fetchShops(search) {
    const params = { search, status: 'approved' };
    return shopService.getAll(params).then(({ data }) =>
      data.map((item) => ({
        label: item.translation?.title,
        value: item.id,
        key: item.id,
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

  const fetchOrdersCase = (params) => {
    const paramsWithType = {
      ...params,
      delivery_type: type !== 'scheduled' ? type : undefined,
      delivery_date_from:
        type === 'scheduled'
          ? moment().add(1, 'day').format('YYYY-MM-DD')
          : undefined,
      search: data?.search ? data.search : undefined,
      user_id: data?.client_id,
      region_id: data?.region?.value,
      country_id: data?.country?.value,
      city_id: data?.city?.value,
      status: params?.status,
      type: '1',
      shop_id:
        activeMenu.data?.shop_id !== null ? activeMenu.data?.shop_id : null,
      date_from: dateRange?.[0]?.format('YYYY-MM-DD') || undefined,
      date_to: dateRange?.[1]?.format('YYYY-MM-DD') || undefined,
    };
    switch (params?.status) {
      case 'new':
        dispatch(fetchNewOrders(paramsWithType));
        break;
      case 'accepted':
        dispatch(fetchAcceptedOrders(paramsWithType));
        break;
      case 'ready':
        dispatch(fetchReadyOrders(paramsWithType));
        break;
      case 'on_a_way':
        dispatch(fetchOnAWayOrders(paramsWithType));
        break;
      case 'delivered':
        dispatch(fetchDeliveredOrders(paramsWithType));
        break;
      case 'canceled':
        dispatch(fetchCanceledOrders(paramsWithType));
        break;
      case 'cooking':
        dispatch(fetchCookingOrders(paramsWithType));
        break;
      case 'pause':
        dispatch(fetchPauseOrders(paramsWithType));
        break;
      default:
        console.log(`Sorry, we are out of`);
    }
  };

  const fetchOrderAllItem = () => {
    fetchOrdersCase({ status: 'new' });
    fetchOrdersCase({ status: 'accepted' });
    fetchOrdersCase({ status: 'ready' });
    fetchOrdersCase({ status: 'on_a_way' });
    fetchOrdersCase({ status: 'delivered' });
    fetchOrdersCase({ status: 'canceled' });
    fetchOrdersCase({ status: 'cooking' });
    fetchOrdersCase({ status: 'pause' });
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
    });
    fetchOrderAllItem();
  };

  useEffect(() => {
    if (activeMenu?.refetch) {
      batch(() => {
        dispatch(fetchOrders(paramsData));
        dispatch(disableRefetch(activeMenu));
        dispatch(fetchOrderStatus({}));
        dispatch(fetchRestOrderStatus({}));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu?.refetch]);

  return (
    <>
      <Space className='w-100 justify-content-end mb-3'>
        <OrderTypeSwitcher listType='orders-board' />
        <Button
          onClick={excelExport}
          loading={downloading}
          style={{ width: '100%' }}
        >
          <CgExport className='mr-2' />
          {t('export')}
        </Button>
        <Button
          icon={<ClearOutlined />}
          onClick={handleClear}
          style={{ width: '100%' }}
        >
          {t('clear')}
        </Button>
        <Button
          type='primary'
          icon={<PlusCircleOutlined />}
          onClick={goToOrderCreate}
          style={{ width: '100%' }}
        >
          {t('add.order')}
        </Button>
      </Space>
      <Card>
        <Space wrap className='order-filter' size={[8, 15]}>
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
            onClear={() => dispatch(clearItems())}
            onSelect={(shop) => handleFilter(shop.value, 'shop_id')}
            onDeselect={() => handleFilter(null, 'shop_id')}
            allowClear={true}
            value={data?.shop_id}
          />
          <DebounceSelect
            placeholder={t('select.client')}
            fetchOptions={getUsers}
            onSelect={(user) => handleFilter(user.value, 'client_id')}
            onDeselect={() => handleFilter(null, 'client_id')}
            style={{ width: '100%' }}
            value={data?.client_id}
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
          {type !== 'scheduled' && (
            <RangePicker
              defaultValue={dateRange}
              onChange={(values) => {
                handleFilter(JSON.stringify(values), 'data_time');
                setDateRange(values);
              }}
              disabledDate={(current) => {
                return current && current > moment().endOf('day');
              }}
              allowClear={true}
              style={{ width: '100%' }}
            />
          )}
        </Space>
      </Card>

      <Incorporate
        goToEdit={goToEdit}
        goToShow={goToShow}
        fetchOrderAllItem={fetchOrderAllItem}
        fetchOrders={fetchOrdersCase}
        setLocationsMap={setLocationsMap}
        setId={setId}
        setIsModalVisible={setIsModalVisible}
        setText={setText}
        setDowloadModal={setDownloadModal}
        type={type}
        setTabType={setTabType}
      />

      {orderDetails && (
        <OrderStatusModal
          orderDetails={orderDetails}
          handleCancel={handleCloseModal}
          status={statusList}
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
