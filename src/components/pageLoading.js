import React from 'react';
import { Spin } from 'antd';

export default function PageLoading({ size = 'large' }) {
  return (
    <div className='page-loading'>
      <Spin size={size} />
    </div>
  );
}
