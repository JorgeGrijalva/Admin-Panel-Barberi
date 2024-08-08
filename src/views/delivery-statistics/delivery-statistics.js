import React, { useEffect } from 'react';
import { Table, Card, Row, Col, Rate } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';

import formatSortType from 'helpers/formatSortType';
import numberToPrice from 'helpers/numberToPrice';
import {
  fetchLowMoney,
  fetchLowOrders,
  fetchLowRating,
  fetchTopMoney,
  fetchTopOrders,
  fetchTopRating,
} from 'redux/slices/delivery-statistic';

export default function DeliveryStatistics() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: (_, data) =>
        (data?.firstname || '') + ' ' + (data?.lastname || ''),
    },
    {
      title: t('rate'),
      dataIndex: 'rating',
      key: 'rating',
      render: (_, data) => {
        // const allRateTotal = !!data?.assign_reviews?.length
        //   ? data?.assign_reviews?.reduce(
        //       (total, item) => (total += item?.rating || 0),
        //       0,
        //     )
        //   : 0;
        // const avgRate = allRateTotal / data?.assign_reviews?.length || 0;
        const avgRate = data?.r_avg || 0;
        return (
          <Rate className='mt-3 ml-3' disabled allowHalf value={avgRate} />
        );
      },
    },
  ];

  const orders = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: (_, data) =>
        (data?.firstname || '') + ' ' + (data?.lastname || ''),
    },
    {
      title: t('orders'),
      dataIndex: 'count',
      key: 'count',
      render: (_, data) => data?.deliveryman_orders.length,
    },
  ];

  const money = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: (_, data) =>
        (data?.firstname || '') + ' ' + (data?.lastname || ''),
    },
    {
      title: t('wallet'),
      dataIndex: 'wallet_sum',
      key: 'wallet_sum',
      render: (_, data) =>
        numberToPrice(
          data?.wallet?.price,
          defaultCurrency?.symbol,
          defaultCurrency?.position,
        ),
    },
  ];

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const {
    topRating,
    lowRating,
    topOrder,
    lowOrder,
    topMoney,
    lowMoney,
    loading,
  } = useSelector((state) => state.deliveryStatistics, shallowEqual);

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

  useEffect(() => {
    if (activeMenu?.refetch) {
      const topRatingParams = {
        type: 'delivery',
        sort: 'desc',
        column: 'rating',
        by_rating: 'top',
      };
      const lowRatingParams = {
        type: 'delivery',
        sort: 'asc',
        column: 'rating',
        by_rating: 'low',
      };
      const topOrderParams = {
        type: 'delivery',
        sort: 'desc',
        column: 'count',
      };
      const lowOrderParams = {
        type: 'delivery',
        sort: 'asc',
        column: 'count',
      };

      const topMoneyParams = {
        type: 'delivery',
        sort: 'desc',
        column: 'count',
      };
      const lowMoneyParams = {
        type: 'delivery',
        sort: 'asc',
        column: 'count',
      };
      dispatch(fetchTopRating(topRatingParams));
      dispatch(fetchLowRating(lowRatingParams));
      dispatch(fetchTopOrders(topOrderParams));
      dispatch(fetchLowOrders(lowOrderParams));
      dispatch(fetchTopMoney(topMoneyParams));
      dispatch(fetchLowMoney(lowMoneyParams));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu?.refetch]);


  return (
    <Row gutter={12}>
      <Col span={12}>
        <Card title={t('top.rating')}>
          <Table
            scroll={{ x: true }}
            columns={columns}
            dataSource={topRating}
            loading={loading}
            pagination={false}
            rowKey={(record) => record.id}
            onChange={onChangePagination}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card title={t('lowest.rating')}>
          <Table
            scroll={{ x: true }}
            columns={columns}
            dataSource={lowRating}
            loading={loading}
            pagination={false}
            rowKey={(record) => record.id}
            onChange={onChangePagination}
          />
        </Card>
      </Col>

      <Col span={12}>
        <Card title={t('top.orders')}>
          <Table
            scroll={{ x: true }}
            columns={orders}
            dataSource={topOrder}
            loading={loading}
            pagination={false}
            rowKey={(record) => record.id}
            onChange={onChangePagination}
          />
        </Card>
      </Col>

      <Col span={12}>
        <Card title={t('lowest.orders')}>
          <Table
            scroll={{ x: true }}
            columns={orders}
            dataSource={lowOrder}
            loading={loading}
            pagination={false}
            rowKey={(record) => record.id}
            onChange={onChangePagination}
          />
        </Card>
      </Col>

      <Col span={12}>
        <Card title={t('top.earner')}>
          <Table
            scroll={{ x: true }}
            columns={money}
            dataSource={topMoney}
            loading={loading}
            pagination={false}
            rowKey={(record) => record.id}
            onChange={onChangePagination}
          />
        </Card>
      </Col>

      <Col span={12}>
        <Card title={t('lowest.earner')}>
          <Table
            scroll={{ x: true }}
            columns={money}
            dataSource={lowMoney}
            loading={loading}
            pagination={false}
            rowKey={(record) => record.id}
            onChange={onChangePagination}
          />
        </Card>
      </Col>
    </Row>
  );
}
