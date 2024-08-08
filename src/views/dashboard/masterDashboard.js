import React from 'react';
import { Card, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import BookingsCountStatistics from './bookings-count';
import BookingsPercentStatistics from './bookings-percent';
import BookingsTotalStatistics from './bookings-total';
import TopBar from './topBar';

export default function MasterDashboard() {
  const { t } = useTranslation();
  return (
    <>
      <TopBar />
      <Col span={24}>
        <Card>
          <span style={{ fontSize: '1rem' }}>
            {t('last.30.days.statistics')}
          </span>
        </Card>
      </Col>
      <Col span={24}>
        <Card>
          <span style={{ fontSize: '1rem' }}>
            {t('bookings.count.statistics')}
          </span>
        </Card>
      </Col>
      <BookingsCountStatistics isMaster={true} />
      <Col span={24}>
        <Card>
          <span style={{ fontSize: '1rem' }}>
            {t('bookings.percent.statistics')}
          </span>
        </Card>
      </Col>
      <BookingsPercentStatistics isMaster={true} />
      <Col span={24}>
        <Card>
          <span style={{ fontSize: '1rem' }}>
            {t('bookings.total.statistics')}
          </span>
        </Card>
      </Col>
      <BookingsTotalStatistics isMaster={true} />
    </>
  );
}
