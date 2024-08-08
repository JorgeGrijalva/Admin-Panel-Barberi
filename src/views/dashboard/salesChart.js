import React, { useMemo } from 'react';
import { Badge, Card, Select, Spin } from 'antd';
import ChartWidget from 'components/chart-widget';
import numberToPrice from 'helpers/numberToPrice';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { COLORS } from 'constants/ChartConstant';
import moment from 'moment';
import {
  fetchOrderSales,
  fetchSellerOrderSales,
  filterOrderSales,
} from 'redux/slices/statistics/orderSales';
import { useTranslation } from 'react-i18next';

export default function SalesChart() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const { sales, params, loading } = useSelector(
    (state) => state.orderSales,
    shallowEqual,
  );

  const { role } = useSelector((state) => state.auth.user, shallowEqual);
  const { direction } = useSelector((state) => state.theme.theme, shallowEqual);
  const categories = useMemo(
    () => sales.map((item) => moment(item.time).format('D MMM')),
    [sales],
  );

  const chartData = useMemo(() => {
    return [
      {
        name: t('sales'),
        data: sales?.map((item) => item.total_price.toFixed(2)) || [],
      },
    ];
  }, [sales]);

  const handleChange = (value) => {
    const payload = { time: value };
    dispatch(filterOrderSales(payload));
    switch (role) {
      case 'admin':
        dispatch(fetchOrderSales(payload));
        break;
      case 'seller':
        dispatch(fetchSellerOrderSales(payload));
        break;

      default:
        break;
    }
  };

  return (
    <Card
      className='h-100'
      title={t('sales')}
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
            {numberToPrice(
              sales.reduce(
                (total, item) => (total += item.total_price || 0),
                0,
              ),
              defaultCurrency?.symbol,
              defaultCurrency?.position,
            )}
          </h2>
          <p>
            <Badge color={COLORS[0]} />
            {t('total.sales.amount')}
          </p>
        </div>
      </div>
      <div>
        <ChartWidget
          card={false}
          type='area'
          series={chartData}
          xAxis={categories}
          height={280}
          customOptions={{
            colors: COLORS,
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
