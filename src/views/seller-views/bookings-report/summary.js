import { Card, Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

const BookingsReportSummary = ({ summaryData, loading }) => {
  const { t } = useTranslation();
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const data = summaryData?.[0] || {};

  const renderPrice = (number) => {
    const position = defaultCurrency?.position;
    return (
      <>
        {position === 'before' && defaultCurrency?.symbol}
        {!!number ? number : 0}
        {position === 'after' && defaultCurrency?.symbol}
      </>
    );
  };

  return (
    <Card title={t('summary')} loading={loading}>
      <Row gutter={12}>
        <Col
          span={24}
          className='flex mt-2'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <h5>{t('total.price')}</h5>
          <h4 style={{ fontWeight: 700 }}>
            {renderPrice(data?.total_price?.toFixed(0))}
          </h4>
        </Col>
        <Col
          span={24}
          className='flex mt-4'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <h5>{t('progress.price')}</h5>
          <h4 style={{ fontWeight: 700 }}>
            {renderPrice(data?.progress_price?.toFixed(0))}
          </h4>
        </Col>
        <Col
          span={24}
          className='flex mt-4'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <h5>{t('paid.price')}</h5>
          <h4 style={{ fontWeight: 700 }}>
            {renderPrice(data?.paid_price?.toFixed(0))}
          </h4>
        </Col>
        <Col
          span={24}
          className='flex mt-4'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <h5>{t('canceled.price')}</h5>
          <h4 style={{ fontWeight: 700 }}>
            {renderPrice(data?.canceled_price?.toFixed(0))}
          </h4>
        </Col>
        <Col
          span={24}
          className='flex mt-4'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <h5>{t('rejected.price')}</h5>
          <h4 style={{ fontWeight: 700 }}>
            {renderPrice(data?.rejected_price?.toFixed(0))}
          </h4>
        </Col>
        <Col
          span={24}
          className='flex mt-4'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <h5>{t('refund.price')}</h5>
          <h4 style={{ fontWeight: 700 }}>
            {renderPrice(data?.refund_price?.toFixed(0))}
          </h4>
        </Col>
      </Row>
    </Card>
  );
};

export default BookingsReportSummary;
