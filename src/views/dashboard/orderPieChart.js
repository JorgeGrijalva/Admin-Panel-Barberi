import { Card } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ChartWidget from '../../components/chart-widget';

const OrderPieChart = ({ counts }) => {
  const { t } = useTranslation();
  return (
    <Card title={t('orders')} className='h-100'>
      <ChartWidget
        type='pie'
        series={[
          counts?.progress_orders_count || { data: [] },
          counts?.delivered_orders_count || { data: [] },
          counts?.cancel_orders_count || { data: [] },
        ]}
        xAxis={[
          t('in.progress.orders'),
          t('delivered.orders'),
          t('canceled.orders'),
        ]}
        customOptions={{
          labels: [
            t('in.progress.orders'),
            t('delivered.orders'),
            t('canceled.orders'),
          ],
        }}
      />
    </Card>
  );
};

export default OrderPieChart;
