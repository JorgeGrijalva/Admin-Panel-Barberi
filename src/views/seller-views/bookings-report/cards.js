import { Row, Col } from 'antd';
import StatisticNumberWidget from '../../dashboard/statisticNumberWidget';
import { useTranslation } from 'react-i18next';

const BookingsReportCards = ({ cardsData, loading }) => {
  const { t } = useTranslation();
  return (
    <Row gutter={16}>
      <Col span={8}>
        <StatisticNumberWidget
          value={cardsData?.total_price?.toFixed(0) || 0}
          title={t('total.price')}
          color='red'
        />
      </Col>
      <Col span={8}>
        <StatisticNumberWidget
          value={cardsData?.ended_total_price?.toFixed(0) || 0}
          title={t('ended.total.price')}
          color='green'
        />
      </Col>
      <Col span={8}>
        <StatisticNumberWidget
          value={cardsData?.average_total_price?.toFixed(0) || 0}
          title={t('average.total.price')}
          color='grey'
        />
      </Col>
    </Row>
  );
};

export default BookingsReportCards;
