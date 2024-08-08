import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Image, Space, Table } from 'antd';
import { IMG_URL } from 'configs/app-global';
import { useNavigate } from 'react-router-dom';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import CustomModal from 'components/modal';
import { Context } from 'context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import deliveryPointService from 'services/delivery-point';
import { fetchDeliveryPoint } from 'redux/slices/delivery-point';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import DeleteButton from 'components/delete-button';
import FilterColumns from 'components/filter-column';
import useDidUpdate from 'helpers/useDidUpdate';
import formatSortType from 'helpers/formatSortType';
import numberToPrice from 'helpers/numberToPrice';

const DeliveryPoints = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultLang } = useSelector((state) => state.formLang, shallowEqual);
  const { deliveryPoints, meta, loading, params } = useSelector(
    (state) => state.deliveryPoint,
    shallowEqual,
  );
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const [id, setId] = useState(null);
  const data = activeMenu.data;
  const paramsData = {
    perPage: data?.perPage,
    page: data?.page,
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
      title: t('image'),
      dataIndex: 'img',
      key: 'img',
      is_show: true,
      render: (img, row) => {
        return (
          <Image
            src={IMG_URL + img}
            alt='img_gallery'
            width={100}
            className='rounded'
            preview
            placeholder
          />
        );
      },
    },
    {
      title: t('title'),
      dataIndex: 'translation',
      key: 'title',
      is_show: true,
      render: (translation, row) => translation?.title,
    },
    {
      title: t('address'),
      dataIndex: 'address',
      key: 'address',
      is_show: true,
      render: (address, row) => address?.[defaultLang || 'en'],
    },
    {
      title: t('country'),
      dataIndex: 'country',
      key: 'country',
      is_show: true,
      render: (country, row) => country?.translation?.title,
    },
    {
      title: t('region'),
      dataIndex: 'region',
      key: 'region',
      is_show: true,
      render: (region, row) => region?.translation?.title,
    },
    {
      title: t('city'),
      dataIndex: 'city',
      key: 'city',
      is_show: true,
      render: (city, row) => city?.translation?.title,
    },
    {
      title: t('area'),
      dataIndex: 'area',
      key: 'area',
      is_show: true,
      render: (area, row) => area?.translation?.title,
    },
    {
      title: t('fitting_rooms'),
      dataIndex: 'fitting_rooms',
      key: 'fitting_rooms',
      is_show: true,
      render: (fitting_rooms, row) => fitting_rooms,
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      is_show: true,
      render: (price, row) =>
        numberToPrice(
          price,
          defaultCurrency?.symbol,
          defaultCurrency?.position,
        ),
    },

    {
      title: t('options'),
      key: 'options',
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => (
        <Space>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => goToEdit(row)}
          />
          <DeleteButton
            icon={<DeleteOutlined />}
            onClick={() => {
              setIsModalVisible(true);
              setId([row.id]);
            }}
          />
        </Space>
      ),
    },
  ]);

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'delivery-point/add',
        url: 'delivery-point/add',
        name: t('add.delivery.point'),
      }),
    );
    navigate('/delivery-point/add');
  };

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `delivery-point/${row.id}`,
        id: 'point.edit',
        name: t('edit.delivery.point'),
      }),
    );
    navigate(`/delivery-point/${row.id}`);
  };

  const deleteDeliveryPoint = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };
    deliveryPointService
      .delete(params)
      .then(() => {
        dispatch(fetchDeliveryPoint());
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  useDidUpdate(() => {
    dispatch(fetchDeliveryPoint(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchDeliveryPoint(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

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
    }
  };

  return (
    <Card
      title={t('delivery.points')}
      extra={
        <Space wrap>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={goToAdd}
          >
            {t('add.point')}
          </Button>
          <DeleteButton size='' onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>
          <FilterColumns setColumns={setColumns} columns={columns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={deliveryPoints}
        pagination={{
          pageSize: params.perPage,
          page: activeMenu.data?.page || 1,
          total: meta.total,
          defaultCurrent: activeMenu.data?.page,
          current: activeMenu.data?.page,
        }}
        rowKey={(record) => record.id}
        loading={loading}
        onChange={onChangePagination}
      />
      <CustomModal
        click={deleteDeliveryPoint}
        text={t('delete')}
        loading={loadingBtn}
        setText={setId}
      />
    </Card>
  );
};

export default DeliveryPoints;
