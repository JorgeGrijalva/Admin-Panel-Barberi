import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Button, Card, Table, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import Filter from './filter';
import DetailModal from './detailModal';
import { disableRefetch, setMenuData } from '../../../redux/slices/menu';
import formatSortType from '../../../helpers/formatSortType';
import useDidUpdate from '../../../helpers/useDidUpdate';
import { fetchSellerUserMemberships } from '../../../redux/slices/user-memberships';
import numberToPrice from '../../../helpers/numberToPrice';

function UserMemberships() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [filters, setFilters] = useState({
    shop: {},
  });
  const { userMemberships, loading, meta, params } = useSelector(
    (state) => state.userMemberships,
    shallowEqual,
  );
  const [showId, setShowId] = useState(null);

  const data = activeMenu.data;

  const paramsData = {
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
    shop_id: data?.shop_id,
    service_id: data?.service_id,
    user_id: data?.user_id,
  };

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      is_show: true,
    },
    {
      title: t('user_id'),
      dataIndex: 'user_id',
      key: 'user_id',
      is_show: true,
    },
    {
      title: t('membership'),
      dataIndex: 'membership',
      key: 'membership',
      is_show: true,
      render: (_, record) => record?.member_ship?.translation?.title,
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      is_show: true,
      render: (_, record) => numberToPrice(record?.price),
    },
    {
      title: t('sessions'),
      dataIndex: 'sessions',
      key: 'sessions',
      is_show: true,
    },
    {
      title: t('transaction'),
      dataIndex: 'transaction',
      key: 'transaction',
      is_show: true,
      render: (_, record) => {
        const transaction = record.transaction?.status || 'not.paid';

        return transaction === 'not.paid' ? (
          <Tag>{t(transaction)}</Tag>
        ) : transaction === 'paid' ? (
          <Tag color='cyan'>{t(transaction)}</Tag>
        ) : (
          <Tag color='warning'>{t(transaction)}</Tag>
        );
      },
    },
    {
      title: t('options'),
      key: 'options',
      is_show: true,
      render: (_, row) => {
        return <Button icon={<EyeOutlined />} onClick={() => goToShow(row)} />;
      },
    },
  ];

  const goToShow = (row) => {
    setShowId(row.id);
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
    dispatch(fetchSellerUserMemberships(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(disableRefetch(activeMenu));
      dispatch(fetchSellerUserMemberships(paramsData));
    }
  }, [activeMenu.refetch]);

  return (
    <>
      <Card>
        <Filter filters={filters} setFilters={setFilters} />
      </Card>
      <Card title={t('user.memberships')}>
        <Table
          scroll={{ x: true }}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={userMemberships}
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
      </Card>
      {showId && (
        <DetailModal id={showId} handleCancel={() => setShowId(null)} />
      )}
    </>
  );
}

export default UserMemberships;
