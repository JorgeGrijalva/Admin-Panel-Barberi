import React from 'react';
import { Spin } from 'antd';

export default function Loading({ size = 'middle' }) {
  return (
    <div className='d-flex justify-content-center align-items-center h-100'>
      <Spin size={size} className='py-5' />
    </div>
  );
}
