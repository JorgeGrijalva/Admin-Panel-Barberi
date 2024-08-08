import React from 'react';
import Filter from './filter';
import { Col, Layout, Row } from 'antd';
import OrderTabs from './booking-tabs';
import BookingMain from './booking-main';

export default function SellerBooking() {
  return (
    <div className='booking-card'>
      <Layout className='site-layout'>
        <Row gutter={24}>
          <Col span={17}>
            <Filter />
            <BookingMain />
          </Col>
          <Col span={7}>
            <OrderTabs />
          </Col>
        </Row>
      </Layout>
    </div>
  );
}
