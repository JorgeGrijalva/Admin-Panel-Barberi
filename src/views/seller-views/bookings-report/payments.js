import { Card, Col, Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

const BookingReportPayments = ({ paymentsData, loading }) => {
  const { t } = useTranslation();
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const paymentTypes = paymentsData?.map((item) => ({
    label: t(item?.payment_name) || '--',
    value: item?.payment_sys_id,
    key: item?.payment_sys_id,
  }));
  const [currentPaymentType, setCurrentPaymentType] = useState(
    paymentTypes?.[0],
  );

  useEffect(() => {
    setCurrentPaymentType(paymentTypes?.[0]);
  }, [paymentTypes?.length]);

  const data = paymentsData?.filter(
    (item) => item?.payment_sys_id === currentPaymentType?.value,
  )?.[0];

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
    <Card title={t('payments')} loading={loading}>
      <Row gutter={12}>
        <Col span={24}>
          <Select
            className='w-100'
            value={currentPaymentType?.value || paymentTypes?.[0]?.value}
            onSelect={(e) =>
              setCurrentPaymentType(
                paymentTypes?.filter((item) => item?.value === e)?.[0],
              )
            }
          >
            {paymentTypes.map((item) => (
              <Select.Option value={item?.value} key={item?.key}>
                {item?.label}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col
          span={24}
          className='flex mt-4'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <h5>{t('progress.price')}</h5>
          <h4 style={{ fontWeight: 700 }}>
            {renderPrice(data?.progress_price)}
          </h4>
        </Col>
        <Col
          span={24}
          className='flex mt-4'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <h5>{t('paid.price')}</h5>
          <h4 style={{ fontWeight: 700 }}>{renderPrice(data?.paid_price)}</h4>
        </Col>
        <Col
          span={24}
          className='flex mt-4'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <h5>{t('canceled.price')}</h5>
          <h4 style={{ fontWeight: 700 }}>
            {renderPrice(data?.canceled_price)}
          </h4>
        </Col>
        <Col
          span={24}
          className='flex mt-4'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <h5>{t('rejected.price')}</h5>
          <h4 style={{ fontWeight: 700 }}>
            {renderPrice(data?.rejected_price)}
          </h4>
        </Col>
        <Col
          span={24}
          className='flex mt-4'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <h5>{t('refund.price')}</h5>
          <h4 style={{ fontWeight: 700 }}>{renderPrice(data?.refund_price)}</h4>
        </Col>
      </Row>
    </Card>
  );
};

export default BookingReportPayments;
