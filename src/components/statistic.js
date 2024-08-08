import React from 'react';
import { Col, Row } from 'antd';
import { shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import StatisticNumberWidget from '../views/dashboard/statisticNumberWidget';
import { nFormatter } from '../helpers/nFormatter';

const Statistic = ({ data: statistic }) => {
  const { t } = useTranslation();
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual
  );

  return (
    <Row gutter={16} className='mt-3'>
      <Col flex='0 0 16.6%'>
        <StatisticNumberWidget
          title={t('in.progress.orders')}
          value={statistic.accepted_orders_count}
        />
      </Col>
      <Col flex='0 0 16.6%'>
        <StatisticNumberWidget
          title={t('cancelled.orders')}
          value={statistic.cancel_orders_count}
        />
      </Col>
      <Col flex='0 0 16.6%'>
        <StatisticNumberWidget
          title={t('delivered.orders')}
          value={statistic.delivered_orders_count}
        />
      </Col>
      <Col flex='0 0 16.6%'>
        <StatisticNumberWidget
          title={t('out.of.stock.products')}
          value={statistic.new_orders_count}
        />
      </Col>
      <Col flex='0 0 16.6%'>
        <StatisticNumberWidget
          title={t('total.products')}
          value={statistic.on_a_way_orders_count}
        />
      </Col>
      <Col flex='0 0 16.6%'>
        <StatisticNumberWidget
          title={t('order.reviews')}
          value={statistic.orders_count}
        />
      </Col>
      <Col flex='0 0 16.6%'>
        <StatisticNumberWidget
          title={t('progress.orders.count')}
          value={statistic.progress_orders_count}
        />
      </Col>
      <Col flex='0 0 16.6%'>
        <StatisticNumberWidget
          title={t('ready.orders.count')}
          value={statistic.ready_orders_count}
        />
      </Col>
      <Col flex='0 0 16.6%'>
        <StatisticNumberWidget
          title={t('total.price')}
          value={nFormatter(statistic.total_price, defaultCurrency.symbol)}
        />
      </Col>
    </Row>
  );
};

export default Statistic;
