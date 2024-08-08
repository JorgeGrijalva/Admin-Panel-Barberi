import React, { useEffect, useState } from 'react';
import { Button, Table, Card, Tabs, Tag, Space } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, setMenuData } from '../../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import useDidUpdate from '../../../helpers/useDidUpdate';
import formatSortType from '../../../helpers/formatSortType';
import { DebounceSelect } from '../../../components/search';
import userService from '../../../services/seller/user';
import { fetchSellerTransactions } from '../../../redux/slices/transaction';
import TransactionShowModal from './transactionShowModal';
import numberToPrice from '../../../helpers/numberToPrice';
import FilterColumns from '../../../components/filter-column';
import moment from 'moment';
import StatusModal from './status-modal';

const { TabPane } = Tabs;

const statuses = ['all', 'progress', 'paid', 'canceled', 'rejected'];
const allowed_payable_types_for_seller = [
  'Order',
  'Booking',
  'UserMemberShip',
  'UserGiftCart',
];

export default function SellerTransactions() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showId, setShowId] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [role, setRole] = useState('all');
  const [transactionDetails, setTransactionDetails] = useState(null);
  const immutable = activeMenu.data?.role || role;
  const goToShow = (row) => {
    setShowId(row.id);
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
      title: t('client'),
      dataIndex: 'user',
      key: 'user',
      is_show: true,
      render: (user) =>
        user === null ? (
          <Tag color='red'>{t('deleted.user')}</Tag>
        ) : (
          <div>
            {user?.firstname} {user?.lastname || ''}
          </div>
        ),
    },
    {
      title: t('amount'),
      dataIndex: 'price',
      key: 'price',
      is_show: true,
      render: (price, row) =>
        numberToPrice(price, row.payable?.order?.currency?.symbol),
    },
    {
      title: t('payment.type'),
      dataIndex: 'payment_system',
      key: 'payment_system',
      is_show: true,
      render: (paymentSystem) => paymentSystem?.tag,
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      is_show: true,
      render: (status, row) => {
        return (
          <div>
            {status === 'progress' ? (
              <Tag color='gold'>{t(status)}</Tag>
            ) : status === 'canceled' ? (
              <Tag color='error'>{t(status)}</Tag>
            ) : status === 'rejected' ? (
              <Tag color='error'>{t(status)}</Tag>
            ) : (
              <Tag color='cyan'>{t(status)}</Tag>
            )}
            {allowed_payable_types_for_seller.includes(row?.payable_type) && (
              <EditOutlined onClick={() => setTransactionDetails(row)} />
            )}
          </div>
        );
      },
    },
    {
      title: t('status.note'),
      dataIndex: 'status_description',
      key: 'status_description',
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
      key: 'options',
      is_show: true,
      render: (data, row) => {
        return <Button icon={<EyeOutlined />} onClick={() => goToShow(row)} />;
      },
    },
  ]);

  const { transactions, meta, loading, params } = useSelector(
    (state) => state.transaction,
    shallowEqual,
  );
  const data = activeMenu.data;
  const paramsData = {
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
    user_id: data?.userId,
    status: immutable === 'all' ? undefined : immutable,
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

  useDidUpdate(() => {
    dispatch(fetchSellerTransactions(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchSellerTransactions(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      }),
    );
  };

  async function getUsers(search) {
    const params = {
      search,
      perPage: 10,
    };
    return userService.getAll(params).then(({ data }) => {
      return data.map((item) => ({
        label: `${item.firstname} ${item.lastname}`,
        value: item.id,
      }));
    });
  }

  return (
    <Card
      title={t('transactions')}
      extra={
        <Space>
          <DebounceSelect
            placeholder={t('select.client')}
            fetchOptions={getUsers}
            onSelect={(user) => handleFilter({ userId: user.value })}
            onDeselect={() => handleFilter({ userId: null })}
            style={{ minWidth: 200 }}
          />
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Tabs
        onChange={(key) => {
          handleFilter({ role: key, page: 1 });
          setRole(key);
        }}
        type='card'
        activeKey={immutable}
      >
        {statuses.map((item) => (
          <TabPane tab={t(item)} key={item} />
        ))}
      </Tabs>
      <Table
        scroll={{ x: true }}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={transactions}
        loading={loading}
        pagination={{
          pageSize: params.perPage,
          page: activeMenu.data?.page || 1,
          total: meta.total,
          defaultCurrent: activeMenu.data?.page,
          current: activeMenu.data?.page,
        }}
        rowKey={(record) => record.id}
        onChange={onChangePagination}
      />
      {showId && (
        <TransactionShowModal
          id={showId}
          handleCancel={() => setShowId(null)}
        />
      )}
      {transactionDetails && (
        <StatusModal
          transactionDetails={transactionDetails}
          handleCancel={() => setTransactionDetails(null)}
          paramsData={paramsData}
        />
      )}
      {/* order booking */}
    </Card>
  );
}
