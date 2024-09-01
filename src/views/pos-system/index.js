import React from 'react';
import Filter from './components/filter';
import { Col, Layout, Row } from 'antd';
import ProductCard from './components/product-card';
import OrderTabs from './components/order-tabs';
import OrderCart from './components/order-cart';

export default function PosSystem() {
  return (
    <div className='pos-system'>
      <div >
          <div className=''>
            <div>
              <Filter />
              <ProductCard />
            </div>
            <div>
              <OrderTabs />
              <OrderCart />
            </div>
          </div>
      </div>
    </div>
  );
}
