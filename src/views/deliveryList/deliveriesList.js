import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Rate, Select, Space, Table } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DeleteButton from 'components/delete-button';
import FilterColumns from 'components/filter-column';
import { Context } from 'context/context';
import { fetchDelivery } from 'redux/slices/deliveries';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import deliveryService from 'services/delivery';
import CustomModal from 'components/modal';
import numberToPrice from 'helpers/numberToPrice';
import { BiMap } from 'react-icons/bi';
import ShowLocationsMap from './show-locations.map';
import DeliverySettingCreate from './add-delivery-settings';
import SearchInput from 'components/search-input';
import useDidUpdate from 'helpers/useDidUpdate';
import formatSortType from 'helpers/formatSortType';

const type_of_technique = [
  { label: 'Benzine', value: 'benzine' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Gas', value: 'gas' },
  { label: 'Motorbike', value: 'motorbike' },
  { label: 'Bike', value: 'bike' },
  { label: 'Foot', value: 'foot' },
];

const DeliveriesList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [text, setText] = useState(null);
  const [locationsMap, setLocationsMap] = useState(null);
  const [deliveryModal, setDeliveryModal] = useState(null);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const data = activeMenu?.data;
  const paramsData = {
    search: data?.search ? data.search : undefined,
    type_of_technique: data?.type,
    sort: data?.sort,
    column: data?.column,
    pageSize: data?.per_page,
    page: data?.page || 1,
  };

  const { delivery, loading, meta } = useSelector(
    (state) => state.deliveries,
    shallowEqual,
  );

  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `user/delivery/${row.uuid}`,
        id: 'delivery_edit',
        name: t('delivery.edit'),
      }),
    );
    navigate(`/user/delivery/${row.uuid}`);
  };

  const goToOrder = (row) => {
    dispatch(
      addMenu({
        name: 'delivery.orders',
        id: 'delivery_orders',
        url: `delivery/orders/${row.id}`,
      }),
    );
    navigate(`/delivery/orders/${row.id}`);
  };

  const goToAddDeliveryman = () => {
    dispatch(
      addMenu({
        id: 'user-add-role',
        url: `add/user/delivery/${'deliveryman'}`,
        name: t(`add.${'deliveryman'}`),
      }),
    );
    navigate(`/add/user/delivery/${'deliveryman'}`);
  };

  const handleCloseModal = () => {
    setLocationsMap(null);
    setDeliveryModal(null);
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      is_show: true,
      render: (_, data) => data?.firstname + ' ' + data?.lastname,
    },
    {
      title: t('orders'),
      dataIndex: 'count',
      key: 'count',
      is_show: true,
      sorter: true,
      render: (_, data) => data?.deliveryman_orders.length,
    },
    {
      title: t('rate'),
      dataIndex: 'rating',
      key: 'rating',
      is_show: true,
      sorter: true,
      render: (_, data) => (
        <Rate
          className='mt-3 ml-3'
          disabled
          allowHalf
          value={data?.r_avg ?? 0}
        />
      ),
    },
    {
      title: t('wallet'),
      dataIndex: 'wallet_sum',
      key: 'wallet_sum',
      is_show: true,
      sorter: true,
      render: (_, data) =>
        numberToPrice(
          data?.wallet?.price,
          defaultCurrency?.symbol,
          defaultCurrency?.position,
        ),
    },
    {
      title: t('delivery.man.setting'),
      dataIndex: 'setting',
      key: 'setting',
      is_show: true,
      render: (_, data) =>
        data?.delivery_man_setting === null ? (
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => setDeliveryModal({ id: data?.id })}
          >
            {t('add.settings')}
          </Button>
        ) : (
          <Space>
            <span>
              {t('brand')}: {data?.delivery_man_setting?.brand}
              <br />
              {t('model')}: {data?.delivery_man_setting?.model}
              <br />
              {t('number')}: {data?.delivery_man_setting?.number}
              <br />
              {t('color')}: {data?.delivery_man_setting?.color}
            </span>
            {data?.delivery_man_setting?.id ? (
              <EditOutlined
                onClick={() =>
                  setDeliveryModal({
                    settingsId: data?.delivery_man_setting?.id,
                    id: data?.id,
                  })
                }
              />
            ) : (
              ''
            )}
          </Space>
        ),
    },
    {
      title: t('options'),
      key: 'options',
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button icon={<BiMap />} onClick={() => setLocationsMap(row)} />
            {/*<Button*/}
            {/*  icon={<ShoppingCartOutlined />}*/}
            {/*  onClick={() => goToOrder(row)}*/}
            {/*/>*/}
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row)}
            />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
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

  const deliveryDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };

    deliveryService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchDelivery(paramsData));
        setIsModalVisible(false);
        setText(null);
        setId(null);
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      batch(() => {
        dispatch(fetchDelivery(paramsData));
        dispatch(disableRefetch(activeMenu));
      });
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    dispatch(fetchDelivery(paramsData));
  }, [activeMenu.data]);

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

  const handleFilter = (item, name) => {
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, [name]: item },
      }),
    );
  };

  return (
    <>
      <Card
        title={t('delivery')}
        extra={
          <Space>
            <Select
              placeholder={t('type.of.technique')}
              style={{ width: '150px' }}
              options={type_of_technique}
              onChange={(e) => handleFilter(e, 'type')}
              allowClear
            />
            <DeleteButton size='' onClick={allDelete}>
              {t('delete.selected')}
            </DeleteButton>

            <Button
              type='primary'
              icon={<PlusCircleOutlined />}
              onClick={goToAddDeliveryman}
            >
              {t('add.delivery')}
            </Button>
            <FilterColumns columns={columns} setColumns={setColumns} />
          </Space>
        }
      >
        <SearchInput
          placeholder={t('search')}
          className='w-25'
          handleChange={(search) => handleFilter(search, 'search')}
          resetSearch={!activeMenu.data?.search}
          defaultValue={activeMenu.data?.search}
        />
        <Table
          scroll={{ x: true }}
          rowSelection={rowSelection}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={delivery}
          pagination={{
            pageSize: meta.per_page,
            page: data?.page || 1,
            total: meta.total,
            defaultCurrent: data?.page,
            current: activeMenu.data?.page,
          }}
          rowKey={(res) => res.id}
          onChange={onChangePagination}
          loading={loading}
        />
        <CustomModal
          click={deliveryDelete}
          text={text ? t('delete') : t('all.delete')}
          setText={setId}
          loading={loadingBtn}
        />
        {locationsMap && (
          <ShowLocationsMap id={locationsMap} handleCancel={handleCloseModal} />
        )}
        {deliveryModal && (
          <DeliverySettingCreate
            id={deliveryModal.id}
            data={deliveryModal}
            handleCancel={handleCloseModal}
          />
        )}
      </Card>
    </>
  );
};

export default DeliveriesList;
