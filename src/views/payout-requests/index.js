import React, { useEffect, useState } from 'react';
import { Button, Card, Space, Table, Tabs, Tag } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import useDidUpdate from 'helpers/useDidUpdate';
import formatSortType from 'helpers/formatSortType';
import { useTranslation } from 'react-i18next';
import { fetchPayoutRequests } from 'redux/slices/payoutRequests';
import numberToPrice from 'helpers/numberToPrice';
import { EditOutlined } from '@ant-design/icons';
import PayoutRequestModal from './payoutRequestModal';
import FilterColumns from 'components/filter-column';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { TabPane } = Tabs;
const roles = ['processed', 'paid', 'rejected', 'canceled'];

export default function PayoutRequests() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [role, setRole] = useState('processed');
  const immutable = activeMenu.data?.role || role;
  const data = activeMenu.data;
  const paramsData = {
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
    status: immutable,
  };

  const { payoutRequests, meta, loading, params } = useSelector(
    (state) => state.payoutRequests,
    shallowEqual,
  );
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const [modal, setModal] = useState(null);

  const goToUser = (row) => {
    dispatch(
      addMenu({
        url: `/users/user/${row.uuid}`,
        id: 'user_info',
        name: t('user.info'),
      }),
    );
    navigate(`/users/user/${row.uuid}`, { state: { user_id: row.id } });
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
      title: t('user'),
      dataIndex: 'user',
      key: 'user',
      is_show: true,
      render: (user) => (
        <div className='text-hover' onClick={() => goToUser(user)}>
          {user.firstname + ' ' + user.lastname}
        </div>
      ),
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      is_show: true,
      render: (price) =>
        numberToPrice(
          price,
          defaultCurrency?.symbol,
          defaultCurrency?.position,
        ),
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      is_show: true,
      render: (status) => (
        <div>
          {status === 'processed' ? (
            <Tag color='blue'>{t(status)}</Tag>
          ) : status === 'rejected' ? (
            <Tag color='error'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
        </div>
      ),
    },
    {
      title: t('note'),
      dataIndex: 'note',
      key: 'note',
      is_show: true,
    },
    {
      title: t('created.at'),
      dataIndex: 'created_at',
      key: 'created_at',
      is_show: true,
      render: (created_at) => moment(created_at).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: t('options'),
      dataIndex: 'uuid',
      key: 'uuid',
      is_show: true,
      render: (uuid, row) => (
        <Space>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => setModal(row)}
            disabled={row.status !== 'processed'}
          />
        </Space>
      ),
    },
  ]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchPayoutRequests(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    dispatch(fetchPayoutRequests(paramsData));
  }, [activeMenu.data]);

  function onChangePagination(pagination, filters, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({ activeMenu, data: { perPage, page, column, sort } }),
    );
  }

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      }),
    );
  };

  return (
    <Card
      title={t('payout.requests')}
      extra={
        <Space>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Tabs
        className='mt-3'
        activeKey={immutable}
        onChange={(key) => {
          handleFilter({ role: key, page: 1 });
          setRole(key);
        }}
        type='card'
      >
        {roles.map((item) => (
          <TabPane tab={t(item)} key={item} />
        ))}
      </Tabs>
      <Table
        scroll={{ x: true }}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={payoutRequests}
        pagination={{
          pageSize: params.perPage,
          page: params.page,
          total: meta.total,
          defaultCurrent: params.page,
        }}
        rowKey={(record) => record.id}
        onChange={onChangePagination}
        loading={loading}
      />
      {modal && (
        <PayoutRequestModal data={modal} handleCancel={() => setModal(null)} />
      )}
    </Card>
  );
}
