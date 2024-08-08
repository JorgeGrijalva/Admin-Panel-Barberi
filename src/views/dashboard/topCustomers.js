import React from 'react';
import { Card, Col, Image, Row, Select, Space, Spin } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import numberToPrice from 'helpers/numberToPrice';
import {
  fetchTopCustomers,
  filterTopCustomers,
  fetchSellerTopCustomers,
} from 'redux/slices/statistics/topCustomers';
import { useTranslation } from 'react-i18next';
import getAvatar from 'helpers/getAvatar';
import RiveResult from 'components/rive-result';

export default function TopCustomers() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { topCustomers, loading, params } = useSelector(
    (state) => state.topCustomers,
    shallowEqual,
  );
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const { role } = useSelector((state) => state.auth.user, shallowEqual);

  const handleChange = (item, value) => {
    const payload = { ...params, [item]: value };
    dispatch(filterTopCustomers(payload));
    switch (role) {
      case 'admin':
        dispatch(fetchTopCustomers(payload));
        break;
      case 'seller':
        dispatch(fetchSellerTopCustomers(payload));
        break;

      default:
        break;
    }
  };

  return (
    <Card
      title={t('top.customers')}
      extra={
        <Space>
          <Select
            value={params.perPage}
            size='small'
            style={{ minWidth: 110 }}
            onSelect={(value) => handleChange('perPage', value)}
          >
            <Select.Option value={5}>{`5 / ${t('page')}`}</Select.Option>
            <Select.Option value={10}>{`10 / ${t('page')}`}</Select.Option>
            <Select.Option value={50}>{`50 / ${t('page')}`}</Select.Option>
            <Select.Option value={100}>{`100 / ${t('page')}`}</Select.Option>
          </Select>
          <Select
            value={params.time}
            size='small'
            style={{ minWidth: 110 }}
            onSelect={(value) => handleChange('time', value)}
            defaultValue='subMonth'
          >
            <Select.Option value='subWeek'>{t('this.week')}</Select.Option>
            <Select.Option value='subMonth'>{t('this.month')}</Select.Option>
            <Select.Option value='subYear'>{t('this.year')}</Select.Option>
          </Select>
        </Space>
      }
      className='h-100'
    >
      {loading && (
        <div className='loader'>
          <Spin />
        </div>
      )}
      <div style={{ overflowY: 'auto', maxHeight: 370 }}>
        {topCustomers.length ? (
          topCustomers.map((item, idx) => (
            <div className='w-100 py-3 flex' key={idx}>
              <div className='d-flex avatar'>
                <Image
                  src={getAvatar(item.img)}
                  width={40}
                  height={40}
                  preview={false}
                  className='rounded'
                />
                <div className='ml-2 avatar-text'>
                  <h5 className='title'>{`${item?.firstname || ''} ${
                    item?.lastname || ''
                  }`}</h5>
                  <div className='text-muted'>{item.phone}</div>
                </div>
              </div>
              <div className='d-flex'>
                <div className='mr-3 text-right'>
                  <span className='text-muted'>
                    {item.count} {t('orders')}
                  </span>
                  <div className='mb-0 h5 font-weight-bold'>
                    {numberToPrice(
                      item.total_price,
                      defaultCurrency?.symbol,
                      defaultCurrency?.position,
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Row>
            <Col span={24}>
              <RiveResult id='nosell' />
            </Col>
          </Row>
        )}
      </div>
    </Card>
  );
}
