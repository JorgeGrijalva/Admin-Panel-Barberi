import React from 'react';
import { Col, Row } from 'antd';
import { shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import StatisticNumberWidget from '../views/dashboard/statisticNumberWidget';
import { nFormatter } from '../helpers/nFormatter';

const DeliveryStatistic = ({ data: statistic }) => {
  const { t } = useTranslation();
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  return (
    <Row gutter={16} className='mt-3'>
      <Col flex='0 0 16.6%'>
        <StatisticNumberWidget
          title={t('all.orders')}
          value={statistic?.orders_count}
        />
      </Col>
      <Col flex='0 0 16.6%'>
        <StatisticNumberWidget
          title={t('ready.orders')}
          value={statistic?.ready_orders_count}
        />
      </Col>
      <Col flex='0 0 16.6%'>
        <StatisticNumberWidget
          title={t('on.a.way.orders')}
          value={statistic?.on_a_way_orders_count}
        />
      </Col>
      <Col flex='0 0 16.6%'>
        <StatisticNumberWidget
          title={t('cancelled.orders')}
          value={statistic?.cancel_orders_count}
        />
      </Col>
      <Col flex='0 0 16.6%'>
        <StatisticNumberWidget
          title={t('delivered.orders')}
          value={statistic?.delivered_orders_count}
        />
      </Col>
      <Col flex='0 0 16.6%'>
        <StatisticNumberWidget
          title={t('total.price')}
          value={nFormatter(statistic?.total_price, defaultCurrency?.symbol)}
        />
      </Col>
    </Row>
  );
};

export default DeliveryStatistic;
