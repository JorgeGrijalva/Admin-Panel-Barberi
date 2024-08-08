import { useSelector, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import StatisticPriceWidget from './statisticPriceWidget';
import { Col, Row } from 'antd';

const BookingsTotalStatistics = ({ isSeller = false, isMaster = false }) => {
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
        <StatisticPriceWidget
          title={t('new')}
          value={data?.new?.total_price?.toFixed(0) || 0}
          color='purple'
        />
      </Col>
      <Col
        style={{
          flex: flexCount,
        }}
      >
        <StatisticPriceWidget
          title={t('booked')}
          value={data?.booked?.total_price?.toFixed(0) || 0}
          color='purple'
        />
      </Col>
      <Col
        style={{
          flex: flexCount,
        }}
      >
        <StatisticPriceWidget
          title={t('progress')}
          value={data?.progress?.total_price?.toFixed(0) || 0}
          color='purple'
        />
      </Col>
      <Col
        style={{
          flex: flexCount,
        }}
      >
        <StatisticPriceWidget
          title={t('canceled')}
          value={data?.canceled?.total_price?.toFixed(0) || 0}
          color='purple'
        />
      </Col>
      <Col
        style={{
          flex: flexCount,
        }}
      >
        <StatisticPriceWidget
          title={t('ended')}
          value={data?.ended?.total_price?.toFixed(0) || 0}
          color='purple'
        />
      </Col>
    </Row>
  );
};

export default BookingsTotalStatistics;
