import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Space, Switch, Table } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import DeleteButton from 'components/delete-button';
import FilterColumns from 'components/filter-column';
import CustomModal from 'components/modal';
import { Context } from 'context/context';
import formatSortType from 'helpers/formatSortType';
import numberToPrice from 'helpers/numberToPrice';
import useDidUpdate from 'helpers/useDidUpdate';
import { disableRefetch, setMenuData } from 'redux/slices/menu';
import { fetchPoints } from 'redux/slices/point';
import pointService from 'services/points';
import CashbackEditModal from './cashbackEditModal';
import CashbackModal from './cashbackModal';

export default function Cashback() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [type, setType] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [modal, setModal] = useState(false);
  const [cashbackId, setCashbackId] = useState(null);
  const [text, setText] = useState(null);

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('cashback'),
      dataIndex: 'price',
      key: 'price',
      is_show: true,
      render: (price) => `${price} %`,
    },
    {
      title: t('min.amount'),
      dataIndex: 'value',
      key: 'value',
      is_show: true,
      render: (value) =>
        numberToPrice(
          value,
          defaultCurrency?.symbol,
          defaultCurrency?.position,
        ),
    },
    {
      title: t('active'),
      dataIndex: 'active',
      key: 'active',
      is_show: true,
      render: (active, row) => {
        return (
          <Switch
            key={row.id + active}
            onChange={() => {
              setIsModalVisible(true);
              setActiveId(row.id);
              setType(true);
            }}
            checked={active}
          />
        );
      },
    },
    {
      title: t('created.at'),
      dataIndex: 'created_at',
      key: 'created_at',
      is_show: true,
      render: (created_at) => moment(created_at).format('YYYY-MM-DD'),
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
            onClick={() => setCashbackId(row.id)}
          />
          <DeleteButton
            icon={<DeleteOutlined />}
            onClick={() => {
              setIsModalVisible(true);
              setId([row.id]);
              setType(false);
              setText(true);
            }}
          />
        </Space>
      ),
    },
  ]);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { points, meta, loading, params } = useSelector(
    (state) => state.point,
    shallowEqual,
  );
  const data = activeMenu.data;
  const paramsData = {
    search: data?.search,
    pageSize: data?.per_page,
    page: data?.page,
  };

  const pointDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };
    pointService
      .delete(params)
      .then(() => {
        dispatch(fetchPoints());
        toast.success(t('successfully.deleted'));
        setText(null);
      })
      .finally(() => {
        setIsModalVisible(false);
        setLoadingBtn(false);
      });
  };

  const handleActive = () => {
    setLoadingBtn(true);
    pointService
      .setActive(activeId)
      .then(() => {
        setIsModalVisible(false);
        dispatch(fetchPoints());
        toast.success(t('successfully.updated'));
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchPoints(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    dispatch(fetchPoints(paramsData));
  }, [activeMenu.data]);

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
    if (id === null || id?.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
      setText(false);
    }
  };

  return (
    <Card
      title={t('cashback')}
      extra={
        <Space>
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={() => setModal(true)}
          >
            {t('add.cashback')}
          </Button>
          <DeleteButton size='' onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={points}
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
        click={type ? handleActive : pointDelete}
        text={
          type ? t('set.active.cashback') : text ? t('delete') : t('all.delete')
        }
        loading={loadingBtn}
        setText={setId}
        setActive={setId}
      />
      {modal && (
        <CashbackModal
          visibility={modal}
          handleCancel={() => setModal(false)}
        />
      )}
      {cashbackId && (
        <CashbackEditModal
          visibility={cashbackId}
          handleCancel={() => setCashbackId(null)}
        />
      )}
    </Card>
  );
}
