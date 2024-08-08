import React, { useMemo } from 'react';
import { Badge, Card, Select, Spin } from 'antd';
import moment from 'moment';
import ChartWidget from 'components/chart-widget';
import { COLORS } from 'constants/ChartConstant';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  fetchOrderCounts,
  fetchSellerOrderCounts,
  filterOrderCounts,
} from 'redux/slices/statistics/orderCounts';
import { useTranslation } from 'react-i18next';

export default function OrderChart() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { counts, params, loading } = useSelector(
    (state) => state.orderCounts,
    shallowEqual,
  );
  const { role } = useSelector((state) => state.auth.user, shallowEqual);
  const { direction } = useSelector((state) => state.theme.theme, shallowEqual);
  const categories = useMemo(
    () => counts.map((item) => moment(item.time).format('D MMM')),
    [counts],
  );
  const chartData = useMemo(() => {
    return [
      {
        name: t('orders'),
        data: counts?.map((item) => item.count) || [],
      },
    ];
  }, [counts]);

  const handleChange = (value) => {
    const payload = { time: value };
    dispatch(filterOrderCounts(payload));
    switch (role) {
      case 'admin':
        dispatch(fetchOrderCounts(payload));
        break;
      case 'seller':
        dispatch(fetchSellerOrderCounts(payload));
        break;

      default:
        break;
    }
  };

  return (
    <Card
      className='h-100'
      title={t('orders')}
      extra={
        <Select
          value={params.time}
          size='small'
          style={{ minWidth: 110 }}
          onSelect={handleChange}
          defaultValue='subMonth'
        >
          <Select.Option value='subWeek'>{t('this.week')}</Select.Option>
          <Select.Option value='subMonth'>{t('this.month')}</Select.Option>
          <Select.Option value='subYear'>{t('this.year')}</Select.Option>
        </Select>
      }
    >
      {loading && (
        <div className='loader'>
          <Spin />
        </div>
      )}
      <div className='d-flex'>
        <div className='mr-5'>
          <h2 className='font-weight-bold mb-1'>
            {counts?.reduce((total, item) => (total += item?.count), 0)}
          </h2>
          <p>
            <Badge color={COLORS[6]} />
            {t('total.orders.count')}
          </p>
        </div>
      </div>
      <div>
        <ChartWidget
          card={false}
          series={chartData}
          xAxis={categories}
          height={280}
          customOptions={{
            colors: [COLORS[6], COLORS[0]],
            legend: {
              show: false,
            },
            stroke: {
              width: 2.5,
              curve: 'smooth',
            },
          }}
          direction={direction}
        />
      </div>
    </Card>
  );
}
