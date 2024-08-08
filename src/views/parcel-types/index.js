import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Space, Table } from 'antd';
import { shallowEqual, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import { fetchParcelTypes } from 'redux/slices/parcelTypes';
import DeleteButton from 'components/delete-button';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import FilterColumns from 'components/filter-column';
import CustomModal from 'components/modal';
import useDidUpdate from 'helpers/useDidUpdate';
import { Context } from 'context/context';
import parcelTypeService from 'services/parcelType';
import { toast } from 'react-toastify';
import formatSortType from 'helpers/formatSortType';

export default function ParcelTypes() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [id, setId] = useState(null);
  const [text, setText] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { setIsModalVisible } = useContext(Context);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const data = activeMenu?.data;
  const paramsData = {
    sort: data?.sort,
    column: data?.column,
    pageSize: data?.per_page,
    page: data?.page || 1,
  };

  const {
    data: types,
    loading,
    meta,
  } = useSelector((state) => state.parcelTypes, shallowEqual);

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('title'),
      dataIndex: 'type',
      key: 'type',
      is_show: true,
    },
    {
      title: t('options'),
      key: 'options',
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
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

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `parcel-types/${row.id}`,
        id: 'edit-parcel-type',
        name: t('edit.parcel.type'),
      })
    );
    navigate(`/parcel-types/${row.id}`);
  };

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'add-parcel-type',
        url: `parcel-types/add`,
        name: t(`add.parcel.type`),
      })
    );
    navigate(`/parcel-types/add`);
  };

  const deliveryDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };

    parcelTypeService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchParcelTypes(paramsData));
        setIsModalVisible(false);
        setText(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu?.refetch) {
      dispatch(fetchParcelTypes(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu?.refetch]);

  useDidUpdate(() => {
    dispatch(fetchParcelTypes(paramsData));
  }, [activeMenu.data]);

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

  return (
    <Card
      title={t('parcel.types')}
      extra={
        <Space>
          <DeleteButton size='' onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={goToAdd}
          >
            {t('add.parcel.type')}
          </Button>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={types}
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
    </Card>
  );
}
