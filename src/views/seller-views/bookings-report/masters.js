import React from 'react';
import { Card, Rate, Table } from 'antd';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const BookingsReportMasters = ({
  mastersData,
  loading,
  paramsData,
  fetchBookingsReportMaster,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data, meta } = mastersData;
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  const renderPrice = (number) => {
    const position = defaultCurrency?.position;
    return (
      <>
        {position === 'before' && defaultCurrency?.symbol}
        {!!number ? number.toFixed(0) : 0}
        {position === 'after' && defaultCurrency?.symbol}
      </>
    );
  };

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('full.name'),
      key: 'full_name',
      is_show: true,
      render: (_, data) => `${data?.firstname || ''} ${data?.lastname || ''}`,
    },
    {
      title: t('rating'),
      dataIndex: 'r_avg',
      key: 'r_avg',
      is_show: true,
      render: (rating) => <Rate disabled allowHalf value={rating} />,
    },
    {
      title: t('total.count'),
      dataIndex: 'count',
      key: 'count',
      is_show: true,
    },
    {
      title: t('process.count'),
      dataIndex: 'process_count',
      key: 'process_count',
      is_show: true,
    },
    {
      title: t('process_price'),
      dataIndex: 'process_price',
      key: 'process_price',
      is_show: true,
      render: (price) => renderPrice(price),
    },
    {
      title: t('ended.count'),
      dataIndex: 'ended_count',
      key: 'ended_count',
      is_show: true,
    },
    {
      title: t('ended_price'),
      dataIndex: 'ended_price',
      key: 'ended_price',
      is_show: true,
      render: (price) => renderPrice(price),
    },
    {
      title: t('canceled.count'),
      dataIndex: 'canceled_count',
      key: 'canceled_count',
      is_show: true,
    },
    {
      title: t('canceled_price'),
      dataIndex: 'canceled_price',
      key: 'canceled_price',
      is_show: true,
      render: (price) => renderPrice(price),
    },
  ];

  const onChangePagination = (pagination) => {
    const { pageSize, current } = pagination;
    const params = {
      ...paramsData,
      perPage: pageSize,
      page: current,
    };
    dispatch(fetchBookingsReportMaster(params));
  };

  return (
    <Card title='Masters Bookings'>
      <Table
        scroll={{ x: true }}
        columns={columns?.filter((column) => column?.is_show)}
        dataSource={data}
        pagination={{
          total: meta?.total,
          pageSize: meta?.per_page,
          current: meta?.current_page,
        }}
        loading={loading}
        onChange={onChangePagination}
      />
    </Card>
  );
};

export default BookingsReportMasters;
