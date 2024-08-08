import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import userService from '../../services/user';
import StatisticNumberWidget from './statisticNumberWidget';
import StatisticPriceWidget from './statisticPriceWidget';

export default function DeliverymanDashboard() {
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const { counts } = useSelector(
    (state) => state.statisticsCount,
    shallowEqual
  );

  useEffect(() => {
    userService.profileShow().then(({ data }) => setUserData(data));
  }, []);

  return (
    <div>
      <Row gutter={16} className='mt-3'>
        <Col flex='0 0 16.6%'>
          <StatisticNumberWidget
            title={t('total.orders')}
            value={counts.orders_count}
          />
        </Col>
        <Col flex='0 0 16.6%'>
          <StatisticNumberWidget
            title={t('in.progress.orders')}
            value={counts.progress_orders_count}
          />
        </Col>
        <Col flex='0 0 16.6%'>
          <StatisticNumberWidget
            title={t('cancelled.orders')}
            value={counts.cancel_orders_count}
          />
        </Col>
        <Col flex='0 0 16.6%'>
          <StatisticNumberWidget
            title={t('delivered.orders')}
            value={counts.delivered_orders_count}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24} xl={6}>
          <StatisticPriceWidget
            title={t('balance')}
            value={userData?.wallet?.price}
          />
        </Col>
      </Row>
    </div>
  );
}
