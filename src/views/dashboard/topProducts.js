import React from 'react';
import { Card, Col, Image, Row, Select, Space, Spin } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import getImage from '../../helpers/getImage';
import {
  fetchSellerTopProducts,
  fetchTopProducts,
  filterTopProducts,
} from '../../redux/slices/statistics/topProducts';
import { useTranslation } from 'react-i18next';
import RiveResult from '../../components/rive-result';

export default function TopProducts() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { topProducts, loading, params } = useSelector(
    (state) => state.topProducts,
    shallowEqual,
  );
   const { role } = useSelector((state) => state.auth.user, shallowEqual);

  const handleChange = (item, value) => {
    const payload = { ...params, [item]: value };
    dispatch(filterTopProducts(payload));
    switch (role) {
      case 'admin':
        dispatch(fetchTopProducts(payload));
        break;
      case 'seller':
        dispatch(fetchSellerTopProducts(payload));
        break;

      default:
        break;
    }
  };

  return (
    <Card
      title={t('top.selled.products')}
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
        {topProducts?.length ? (
          topProducts.map((item, idx) => (
            <div className='w-100 py-3 flex' key={idx}>
              <div className='d-flex avatar'>
                <Image
                  src={getImage(item?.product?.img)}
                  width={40}
                  height={40}
                  preview={false}
                  style={{ borderRadius: 10 }}
                />
                <div className='ml-2 avatar-text'>
                  <h5 className='title'>{item?.product?.translation?.title}</h5>
                </div>
              </div>
              <div className='d-flex'>
                <div className='mr-3 text-right'>
                  <span className='text-muted'>{t('sales')}</span>
                  <div className='mb-0 h5 font-weight-bold'>
                    {item?.count ?? 0}
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
