import React from 'react';
import Filter from './components/filter';
import { Col, Layout, Row } from 'antd';
import ProductCard from './components/product-card';
import OrderTabs from './components/order-tabs';
import OrderCart from './components/order-cart';

export default function PosSystem() {
  return (
    <div className='pos-system'>
      <Layout className='site-layout'>
        <Row gutter={24}>
          <Col span={15}>
            <Filter />
            <ProductCard />
          </Col>
          <Col span={9}>
            <OrderTabs />
            <OrderCart />
          </Col>
        </Row>
      </Layout>
    </div>
  );
}
