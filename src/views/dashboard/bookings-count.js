import { useSelector, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import StatisticNumberWidget from './statisticNumberWidget';
import { Col, Row } from 'antd';

const BookingsCountStatistics = ({ isSeller = false, isMaster = false }) => {
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

  const flexCount = '0 0 20%';

  return (
    <Row gutter={16}>
      <Col
        style={{
          flex: flexCount,
        }}
      >
        <StatisticNumberWidget
          title={t('new')}
          value={data?.new?.count?.toFixed(0) || 0}
          color='purple'
        />
      </Col>
      <Col
        style={{
          flex: flexCount,
        }}
      >
        <StatisticNumberWidget
          title={t('booked')}
          value={data?.booked?.count?.toFixed(0) || 0}
          color='purple'
        />
      </Col>
      <Col
        style={{
          flex: flexCount,
        }}
      >
        <StatisticNumberWidget
          title={t('progress')}
          value={data?.progress?.count?.toFixed(0) || 0}
          color='purple'
        />
      </Col>
      <Col
        style={{
          flex: flexCount,
        }}
      >
        <StatisticNumberWidget
          title={t('canceled')}
          value={data?.canceled?.count?.toFixed(0) || 0}
          color='purple'
        />
      </Col>
      <Col
        style={{
          flex: flexCount,
        }}
      >
        <StatisticNumberWidget
          title={t('ended')}
          value={data?.ended?.count?.toFixed(0) || 0}
          color='purple'
        />
      </Col>
    </Row>
  );
};

export default BookingsCountStatistics;
