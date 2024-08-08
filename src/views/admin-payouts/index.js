import React, { useEffect, useState } from 'react';
import { Button, Card, Space, Table, Tabs, Tag, Tooltip } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import useDidUpdate from 'helpers/useDidUpdate';
import formatSortType from 'helpers/formatSortType';
import { useTranslation } from 'react-i18next';
import numberToPrice from 'helpers/numberToPrice';
import { EditOutlined, SettingOutlined } from '@ant-design/icons';
import PayoutRequestModal from './payoutActionModal';
import FilterColumns from 'components/filter-column';
import { useNavigate } from 'react-router-dom';
import { fetchAdminPayouts } from 'redux/slices/adminPayouts';
import PayoutStatusChangeModal from './payoutStatusChangeModal';
import moment from 'moment';

const { TabPane } = Tabs;
const roles = ['all', 'accepted', 'pending', 'canceled'];

export default function AdminPayouts() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [role, setRole] = useState('all');
  const immutable = activeMenu.data?.role || role;
  const data = activeMenu.data;
  const paramsData = {
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
    status: role === 'all' ? undefined : immutable,
  };

  const { payoutRequests, meta, loading, params } = useSelector(
    (state) => state.adminPayouts,
    shallowEqual,
  );
  const [modal, setModal] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

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
      title: t('user'),
      dataIndex: 'createdBy',
      key: 'createdBy',
      is_show: true,
      render: (user) => (
        <div className='text-hover' onClick={() => goToUser(user)}>
          {user?.firstname + ' ' + user?.lastname}
        </div>
      ),
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      is_show: true,
      render: (price, row) =>
        numberToPrice(price, row.currency?.symbol, row?.currency?.position),
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      is_show: true,
      render: (status) => (
        <div>
          {status === 'pending' ? (
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
      title: t('cause'),
      dataIndex: 'cause',
      key: 'cause',
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
      title: t('answer'),
      dataIndex: 'answer',
      key: 'answer',
      is_show: true,
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
          />
          {row.status !== 'accepted' && (
            <Tooltip title={t('change.status')}>
              <Button
                onClick={() => setSelectedRow(row)}
                icon={<SettingOutlined />}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchAdminPayouts(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    dispatch(fetchAdminPayouts(paramsData));
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
          <Button onClick={() => setModal(true)} type='primary'>
            {t('create.payout')}
          </Button>
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
      {selectedRow && (
        <PayoutStatusChangeModal
          data={selectedRow}
          statuses={roles}
          handleCancel={() => setSelectedRow(null)}
        />
      )}
    </Card>
  );
}
