import React, { useEffect, useState } from 'react';
import { Space, Table, Card, DatePicker } from 'antd';
import { useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, setMenuData } from '../../redux/slices/menu';
import { useTranslation } from 'react-i18next';

import useDidUpdate from '../../helpers/useDidUpdate';
import formatSortType from '../../helpers/formatSortType';
import numberToPrice from '../../helpers/numberToPrice';

import moment from 'moment';
import { fetchDeliverymanPaymentFromPartners } from 'redux/slices/paymentToPartners';
const { RangePicker } = DatePicker;

export default function DeliverymanPaymentFromPartners() {
  const { type } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  const columns = [
    {
      title: t('order.id'),
      is_show: true,
      dataIndex: 'order_id',
      key: 'order_id',
      sorter: true,
      render: (id) => <span className='text-hover'>#{id}</span>,
    },
    {
      title: t('order.total_price'),
      is_show: true,
      dataIndex: 'transaction',
      key: 'transaction',
      render: (row) => {
        return (
          <span>
            {numberToPrice(row?.order?.total_price, defaultCurrency.symbol)}
          </span>
        );
      },
    },
    {
      title: t('delivery.fee'),
      is_show: true,
      dataIndex: 'delivery_fee',
      key: 'delivery_fee',
      render: (_, row) => numberToPrice(row?.order?.delivery_fee),
    },
    {
      title: t('payment.type'),
      is_show: true,
      dataIndex: 'transaction',
      key: 'transaction',
      render: (transaction) => t(transaction?.payment_system?.tag) || '-',
    },
  ];

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [dateRange, setDateRange] = useState(
    moment().subtract(1, 'month'),
    moment(),
  );
  const { list, loading, params, meta } = useSelector(
    (state) => state.paymentToPartners,
    shallowEqual,
  );
  const data = activeMenu.data;
  const paramsData = {
    search: data?.search,
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
    user_id: data?.user_id,
    shop_id:
      activeMenu.data?.shop_id !== null ? activeMenu.data?.shop_id : null,
    date_from: Array.isArray(dateRange)
      ? dateRange[0]?.format('YYYY-MM-DD')
      : moment().subtract(1, 'month').format('YYYY-MM-DD'),
    date_to: Array.isArray(dateRange)
      ? dateRange[1]?.format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD'),
    type,
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
    dispatch(fetchDeliverymanPaymentFromPartners(paramsData));
  }, [data, dateRange, type]);

  const handleFilter = (item, name) => {
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...{ [name]: item } },
      }),
    );
  };

  useEffect(() => {
    if (activeMenu?.refetch) {
      dispatch(fetchDeliverymanPaymentFromPartners(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu?.refetch]);

  return (
    <>
      <Card>
        <div className='flex justify-content-space-between'>
          <Space
            wrap
            className='order-filter'
            style={{ flex: 1, width: '100%' }}
          >
            <RangePicker
              value={dateRange}
              onChange={(values) => {
                handleFilter((prev) => ({
                  ...prev,
                  ...{
                    date_from: values?.[0]?.format('YYYY-MM-DD'),
                    date_to: values?.[1]?.format('YYYY-MM-DD'),
                  },
                }));
                setDateRange(values);
              }}
              disabledDate={(current) => {
                return current && current > moment().endOf('day');
              }}
              style={{ width: '100%' }}
            />
          </Space>
        </div>
      </Card>

      <Card>
        <Table
          scroll={{ x: true }}
          columns={columns?.filter((items) => items.is_show)}
          dataSource={list}
          loading={loading}
          pagination={{
            pageSize: params.perPage,
            page: activeMenu.data?.page || 1,
            total: meta?.total,
            defaultCurrent: activeMenu.data?.page,
            current: activeMenu.data?.page,
          }}
          rowKey={(record) => record?.id}
          onChange={onChangePagination}
        />
      </Card>
    </>
  );
}
