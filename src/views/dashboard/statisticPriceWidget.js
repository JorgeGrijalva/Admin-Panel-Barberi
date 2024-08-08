import React from 'react';
import { Card } from 'antd';
import { shallowEqual, useSelector } from 'react-redux';
import numberToPrice from '../../helpers/numberToPrice';

export default function StatisticPriceWidget({
  title = 'Orders',
  value = 0,
  subtitle,
}) {
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  return (
    <Card>
      {title && <h4 className='mb-0'>{title}</h4>}
      <div className={`${title ? 'mt-3' : ''}`}>
        <div>
          <div className='d-flex align-items-center'>
            <h1 className='mb-0 font-weight-bold'>
              {numberToPrice(
                value,
                defaultCurrency?.symbol,
                defaultCurrency?.position,
              )}
            </h1>
          </div>
          {subtitle && <div className='text-gray-light mt-1'>{subtitle}</div>}
        </div>
      </div>
    </Card>
  );
}
