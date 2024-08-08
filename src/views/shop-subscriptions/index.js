import { Button, Card, Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import FilterColumns from 'components/filter-column';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import formatSortType from 'helpers/formatSortType';
import { disableRefetch, setMenuData } from 'redux/slices/menu';
import { fetchShopSubscriptions } from 'redux/slices/shop-subscriptions';
import numberToPrice from 'helpers/numberToPrice';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import StatusModal from './status-modal';
import ShopSubscriptionModal from './detail-show-modal';
import useDidUpdate from '../../helpers/useDidUpdate';

function ShopSubscriptions() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { shopSubscriptions, loading, params, meta } = useSelector(
    (state) => state.shopSubscriptions,
    shallowEqual,
  );
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  const [showId, setShowId] = useState(null);
  const [transactionDetail, setTransactionDetail] = useState(null);

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      is_show: true,
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
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      is_show: true,
    },
    {
      title: t('shop.title'),
      dataIndex: 'shopTitle',
      key: 'shopTitle',
      is_show: true,
    },
    {
      title: t('subscription.title'),
      dataIndex: 'subscriptionTitle',
      key: 'subscriptionTitle',
      is_show: true,
    },
    {
      title: t('transaction'),
      dataIndex: 'transaction',
      key: 'transaction',
      is_show: true,
      render: (transaction) => {
        const status = transaction?.status;
        const tagColor =
          status === 'progress' ? 'gold' : status === 'paid' ? 'cyan' : 'error';
        return status ? (
          <>
            <Tag color={tagColor}>{t(status)}</Tag>
            <EditOutlined onClick={() => setTransactionDetail(transaction)} />
          </>
        ) : (
          <Tag>{t('not.paid')}</Tag>
        );
      },
    },
    {
      title: t('options'),
      key: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Button icon={<EyeOutlined />} onClick={() => goToShow(row.id)} />
        );
      },
    },
  ]);

  const data = activeMenu.data;

  const paramsData = {
    ...data,
    page: data?.page,
    perPage: data?.perPage,
  };

  const goToShow = (id) => {
    setShowId(id);
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
    dispatch(fetchShopSubscriptions(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(disableRefetch(activeMenu));
      dispatch(fetchShopSubscriptions(paramsData));
    }
  }, [activeMenu.refetch]);

  return (
    <>
      <Card
        title={t('shop.subscriptions')}
        extra={<FilterColumns columns={columns} setColumns={setColumns} />}
      >
        <Table
          scroll={{ x: true }}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={shopSubscriptions}
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
        <ShopSubscriptionModal
          id={showId}
          handleCancel={() => setShowId(null)}
        />
      )}

      {transactionDetail && (
        <StatusModal
          transactionDetails={transactionDetail}
          handleCancel={() => setTransactionDetail(null)}
        />
      )}
    </>
  );
}

export default ShopSubscriptions;
