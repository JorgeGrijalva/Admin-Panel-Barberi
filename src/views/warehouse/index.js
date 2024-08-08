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
import warehouseService from 'services/warehouse';
import { fetchWarehouses } from 'redux/slices/warehouse';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import DeleteButton from 'components/delete-button';
import FilterColumns from 'components/filter-column';
import useDidUpdate from 'helpers/useDidUpdate';
import formatSortType from 'helpers/formatSortType';

const Warehouses = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultLang } = useSelector((state) => state.formLang, shallowEqual);
  const { warehouses, meta, loading, params } = useSelector(
    (state) => state.warehouse,
    shallowEqual
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
      render: (country, row) => country?.translation?.title || '-',
    },
    {
      title: t('region'),
      dataIndex: 'region',
      key: 'region',
      is_show: true,
      render: (region, row) => region?.translation?.title || '-',
    },
    {
      title: t('city'),
      dataIndex: 'city',
      key: 'city',
      is_show: true,
      render: (city, row) => city?.translation?.title || '-',
    },
    {
      title: t('area'),
      dataIndex: 'area',
      key: 'area',
      is_show: true,
      render: (area, row) => area?.translation?.title || '-',
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
        id: 'warehouse/add',
        url: 'warehouse/add',
        name: t('add.warehouse'),
      })
    );
    navigate('/warehouse/add');
  };

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `warehouse/${row.id}`,
        id: 'point.edit',
        name: t('edit.warehouse'),
      })
    );
    navigate(`/warehouse/${row.id}`);
  };

  const deleteWarehouse = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    warehouseService
      .delete(params)
      .then(() => {
        dispatch(fetchWarehouses());
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  useDidUpdate(() => {
    dispatch(fetchWarehouses(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchWarehouses(paramsData));
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
      })
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
      title={t('warehouses')}
      extra={
        <Space wrap>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={goToAdd}
          >
            {t('add.warehouse')}
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
        dataSource={warehouses}
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
        click={deleteWarehouse}
        text={t('delete')}
        loading={loadingBtn}
        setText={setId}
      />
    </Card>
  );
};

export default Warehouses;
