import React, { useEffect, useState } from 'react';
import { Button, Table, Card, Tabs, Tag, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, setMenuData } from '../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import useDidUpdate from '../../helpers/useDidUpdate';
import formatSortType from '../../helpers/formatSortType';
import { DebounceSelect } from '../../components/search';
import userService from '../../services/user';
import { fetchTransactions } from '../../redux/slices/transaction';
import TransactionShowModal from './transactionShowModal';
import numberToPrice from '../../helpers/numberToPrice';
import FilterColumns from '../../components/filter-column';
const { TabPane } = Tabs;

const statuses = ['all', 'progress', 'paid', 'rejected'];

export default function Transactions() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showId, setShowId] = useState(null);

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
      render: (user) => (
        <div>
          {user.firstname} {user.lastname}
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
      render: (status) => (
        <div>
          {status === 'progress' ? (
            <Tag color='gold'>{t(status)}</Tag>
          ) : status === 'rejected' ? (
            <Tag color='error'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
        </div>
      ),
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
    },
    {
      title: t('options'),
      key: 'options',
      width: '30%',
      is_show: true,
      render: (data, row) => {
        return <Button icon={<EyeOutlined />} onClick={() => goToShow(row)} />;
      },
    },
  ]);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { transactions, meta, loading, params } = useSelector(
    (state) => state.transaction,
    shallowEqual,
  );
  const data = activeMenu.data;

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
    const paramsData = {
      sort: data?.sort,
      column: data?.column,
      perPage: data?.perPage,
      page: data?.page,
      user_id: data?.userId,
      status: data?.status,
    };
    dispatch(fetchTransactions(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      const params = {
        status: data?.status,
      };
      dispatch(fetchTransactions(params));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const handleFilter = (item, name) => {
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, [name]: item },
      }),
    );
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
      }));
    });
  }

  const onChangeTab = (status) => {
    if (status === 'all') {
      dispatch(setMenuData({ activeMenu, data: { status: null } }));
    } else {
      dispatch(setMenuData({ activeMenu, data: { status } }));
    }
  };

  return (
    <Card
      title={t('transactions')}
      extra={
        <Space wrap>
          <DebounceSelect
            placeholder={t('select.client')}
            fetchOptions={getUsers}
            onSelect={(user) => handleFilter(user.value, 'userId')}
            onDeselect={() => handleFilter(null, 'userId')}
            style={{ minWidth: 200 }}
          />
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Tabs
        onChange={onChangeTab}
        type='card'
        activeKey={data?.status || 'all'}
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
          page: params.page,
          total: meta.total,
          defaultCurrent: params.page,
        }}
        rowKey={(record) => record?.id}
        onChange={onChangePagination}
      />
      {showId && (
        <TransactionShowModal
          id={showId}
          handleCancel={() => setShowId(null)}
        />
      )}
    </Card>
  );
}
