import { Progress, Space, Row, Col, Card } from 'antd';
import { useTranslation } from 'react-i18next';

const BookingsReportStatistics = ({ statisticsData }) => {
  const { t } = useTranslation();
  return (
    <Card title={t('statistics')}>
      <Space
        gutter={12}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            rowGap: '10px',
          }}
        >
          <Progress
            type='circle'
            percent={statisticsData?.new?.percent?.toFixed(0)}
            size=''
          />
          <h4>{t('new')}</h4>
        </Col>
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            rowGap: '10px',
          }}
        >
          <Progress
            type='circle'
            percent={statisticsData?.booked?.percent?.toFixed(0)}
          />
          <h4>{t('booked')}</h4>
        </Col>
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            rowGap: '10px',
          }}
        >
          <Progress
            type='circle'
            percent={statisticsData?.progress?.percent?.toFixed(0)}
          />
          <h4>{t('progress')}</h4>
        </Col>
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            rowGap: '10px',
          }}
        >
          <Progress
            type='circle'
            percent={statisticsData?.canceled?.percent?.toFixed(0)}
          />
          <h4>{t('canceled')}</h4>
        </Col>
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            rowGap: '10px',
          }}
        >
          <Progress
            type='circle'
            percent={statisticsData?.ended?.percent?.toFixed(0)}
          />
          <h4>{t('ended')}</h4>
        </Col>
      </Space>
    </Card>
  );
};

export default BookingsReportStatistics;
