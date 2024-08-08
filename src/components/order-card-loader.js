import { Card, Skeleton } from 'antd';
import React from 'react';

const OrderCardLoader = ({ loading }) => {
  return (
    <Card className='order-card'>
      <Skeleton loading={loading} avatar active />
    </Card>
  );
};

export default OrderCardLoader;
