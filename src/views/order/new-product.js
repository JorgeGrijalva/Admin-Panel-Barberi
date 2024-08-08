import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Card, Row, Col, Image, Space, Tag } from 'antd';
import numberToPrice from 'helpers/numberToPrice';
import { useTranslation } from 'react-i18next';

export default function NewProduct() {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  return (
    <Card title={t('new.product')}>
      <Row gutter={12}>
        <Col span={4} style={{ width: '100px', height: '250px' }}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              overflow: 'hidden',
              borderRadius: '15px',
            }}
          >
            <img
              src={activeMenu.data?.newProduct?.img}
              placeholder
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </Col>
        <Col span={20}>
          <h4>{activeMenu.data?.newProduct?.translation?.title}</h4>
          <Space>
            <p>{t('quantity')}: </p>
            <p>{activeMenu.data?.newProduct?.quantity}</p>
          </Space>
          <br />
          <Space>
            <p>{t('price')}: </p>
            <p>
              {numberToPrice(
                activeMenu.data?.newProduct?.price,
                defaultCurrency?.symbol,
              )}
            </p>
          </Space>
          <br />
          <Space wrap>
            {activeMenu.data?.newProduct?.stock?.extras?.map((extra) => {
              if (extra?.group?.type === 'color') {
                return (
                  <span
                    key={extra?.id}
                    style={{
                      display: 'block',
                      width: '30px',
                      height: '30px',
                      backgroundColor: extra?.value?.value,
                      border: '2px solid #909091',
                      borderRadius: '50%',
                    }}
                  />
                );
              } else {
                return <Tag key={extra?.id}>{extra?.value?.value}</Tag>;
              }
            })}
          </Space>
        </Col>
      </Row>
    </Card>
  );
}
