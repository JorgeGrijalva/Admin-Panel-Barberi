import { Card, Table, Tag } from 'antd';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { disableRefetch } from 'redux/slices/menu';
import { fetchMySubscriptions } from 'redux/slices/my-subscriptions';
import { fetchSellerAdverts } from 'redux/slices/advert';
import numberToPrice from 'helpers/numberToPrice';

function MySubscriptions() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { mySubscriptions, loading, meta } = useSelector(
    (state) => state.mySubscriptions,
    shallowEqual,
  );

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      is_show: true,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t('name'),
      dataIndex: 'subscription',
      is_show: true,
      render: (subscription) => subscription.title,
    },
    {
      title: t('price'),
      dataIndex: 'price',
      is_show: true,
      render: (price) => numberToPrice(price),
    },
    {
      title: t('expired.at'),
      dataIndex: 'expired_at',
      is_show: true,
    },
    {
      title: t('transaction'),
      dataIndex: 'transaction',
      is_show: true,
      render: (transaction) => <Tag>{transaction?.status}</Tag>,
    },
  ];

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchMySubscriptions({}));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchSellerAdverts({ perPage: pageSize, page: current }));
  };

  return (
    <Card title={t('my.subscriptions')}>
      <Table
        scroll={{ x: true }}
        dataSource={mySubscriptions}
        columns={columns?.filter((item) => item.is_show)}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={{
          pageSize: meta?.per_page,
          page: meta?.current_page,
          total: meta?.total,
        }}
        onChange={onChangePagination}
      />
    </Card>
  );
}

export default MySubscriptions;
