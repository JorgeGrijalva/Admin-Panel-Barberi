import React, { useEffect, useState, useContext } from 'react';
import { Button, Space, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ClearOutlined } from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  addMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import useDidUpdate from '../../../helpers/useDidUpdate';
import { fetchOrders, handleSearch } from '../../../redux/slices/waiterOrder';
import SearchInput from '../../../components/search-input';
import userService from '../../../services/seller/user';
import { fetchRestOrderStatus } from '../../../redux/slices/orderStatus';
import DeleteButton from '../../../components/delete-button';
import { Context } from '../../../context/context';
import { toast } from 'react-toastify';
import orderService from '../../../services/waiter/order';
import Incorporate from './dnd/Incorporate';
import {
  clearItems,
  fetchAcceptedOrders,
  fetchCanceledOrders,
  fetchDeliveredOrders,
  fetchNewOrders,
  fetchOnAWayOrders,
  fetchReadyOrders,
} from '../../../redux/slices/waiterOrder';
import { batch } from 'react-redux';
import OrderDeliveryman from './orderDeliveryman';
import { clearOrder } from '../../../redux/slices/order';
import ShowLocationsMap from './show-locations.map';
import DownloadModal from './downloadModal';
import CustomModal from '../../../components/modal';

export default function SellerOrdersBoard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [id, setId] = useState(null);
  const { setIsModalVisible } = useContext(Context);
  const [text, setText] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [locationsMap, setLocationsMap] = useState(null);
  const [dowloadModal, setDowloadModal] = useState(null);
  const [orderDeliveryDetails, setOrderDeliveryDetails] = useState(null);
  const [type, setType] = useState(null);

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

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const data = activeMenu?.data;

  const paramsData = {
    search: data?.search,
    // sort: data?.sort,
    // column: data?.column,
    perPage: data?.perPage || 5,
    page: data?.page || 1,
    user_id: data?.userId,
    status: data?.status,
  };

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
        dispatch(clearItems());
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
        fetchOrderAllItem({ status: type });
        setText(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  useDidUpdate(() => {
    // dispatch(handleSearch(paramsData));
    dispatch(clearItems());
    fetchOrderAllItem();
  }, [data]);

  useEffect(() => {
    if (activeMenu?.refetch) {
      dispatch(fetchOrders(paramsData));
      dispatch(fetchRestOrderStatus());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu?.refetch]);

  const handleFilter = (item, name) => {
    dispatch(clearItems());
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, [name]: item },
      })
    );
  };

  async function getUsers(search) {
    const params = {
      search,
      perPage: 10,
    };
    return userService.getAll(params).then(({ data }) => {
      return data.map((item) => ({
        label: `${item.firstname} ${item.lastname || ''}`,
        value: item.id,
      }));
    });
  }

  const allDelete = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
      setText(false);
    }
  };

  const fetchOrdersCase = (params) => {
    const paramsWithType = {
      ...paramsData,
      ...params,
    };
    switch (params.status) {
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
    fetchOrderAllItem();
  };

  const handleCloseModal = () => {
    setOrderDeliveryDetails(null);
    setLocationsMap(null);
    setDowloadModal(null);
  };

  const goToAddOrder = () => {
    dispatch(clearOrder());
    dispatch(
      addMenu({
        id: 'pos.system',
        url: 'seller/pos-system',
        name: t('add.order'),
      })
    );
    navigate('/seller/pos-system');
  };

  return (
    <>
      <Card>
        <Space wrap>
          <SearchInput
            placeholder={t('search')}
            resetSearch={!data?.search}
            handleChange={(search) => handleFilter(search, 'search')}
            defaultValue={data?.search}
          />
          <Button icon={<ClearOutlined />} onClick={handleClear}>
            {t('clear')}
          </Button>
          {/* <DeleteButton size='' onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton> */}
        </Space>
      </Card>

      <Incorporate
        goToShow={goToShow}
        fetchOrderAllItem={fetchOrderAllItem}
        fetchOrders={fetchOrdersCase}
        setLocationsMap={setLocationsMap}
        setId={setId}
        setIsModalVisible={setIsModalVisible}
        setText={setText}
        setDowloadModal={setDowloadModal}
        type={type}
        setType={setType}
      />
      <CustomModal
        click={orderDelete}
        text={text ? t('delete') : t('all.delete')}
        loading={loadingBtn}
        setText={setId}
        setActive={setId}
      />
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
    </>
  );
}
