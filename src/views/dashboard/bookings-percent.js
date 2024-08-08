import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Progress, Row, Col, Card } from 'antd';
const BookingsPercentStatistics = ({ isSeller = false, isMaster = false }) => {
  const { t } = useTranslation();
  const { statisticsData, seller, master } = useSelector(
    (state) => state.bookingsReport,
    shallowEqual
  );
  const data = isSeller
    ? seller.statisticsData
    : isMaster
    ? master.statisticsData
    : statisticsData;

  const style = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: '10px',
  };

  const flexCount = '0 0 20%';

  return (
    <Row gutter={16}>
      <Col flex={flexCount}>
        <Card style={{ width: '100%' }}>
          <Col
            style={{
              ...style,
            }}
          >
            <Progress type='circle' percent={data?.new?.percent?.toFixed(0)} />
            <h4>{t('new')}</h4>
          </Col>
        </Card>
      </Col>
      <Col flex={flexCount}>
        <Card>
          <Col
            style={{
              ...style,
            }}
          >
            <Progress
              type='circle'
              percent={data?.booked?.percent?.toFixed(0)}
            />
            <h4>{t('booked')}</h4>
          </Col>
        </Card>
      </Col>
      <Col flex={flexCount}>
        <Card>
          <Col
            style={{
              ...style,
            }}
          >
            <Progress
              type='circle'
              percent={data?.progress?.percent?.toFixed(0)}
            />
            <h4>{t('progress')}</h4>
          </Col>
        </Card>
      </Col>
      <Col flex={flexCount}>
        <Card>
          <Col
            style={{
              ...style,
            }}
          >
            <Progress
              type='circle'
              percent={data?.canceled?.percent?.toFixed(0)}
            />
            <h4>{t('canceled')}</h4>
          </Col>
        </Card>
      </Col>
      <Col flex={flexCount}>
        <Card>
          <Col
            style={{
              ...style,
            }}
          >
            <Progress
              type='circle'
              percent={data?.ended?.percent?.toFixed(0)}
            />
            <h4>{t('ended')}</h4>
          </Col>
        </Card>
      </Col>
    </Row>
  );
};

export default BookingsPercentStatistics;
