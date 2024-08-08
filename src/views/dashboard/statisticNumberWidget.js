import React from 'react';
import { Card } from 'antd';

export default function StatisticNumberWidget({
  title = 'Orders',
  value = 0,
  color = 'grey',
  onClick,
}) {
  return (
    <Card className='statistics-card' hoverable={!!onClick} onClick={onClick}>
      <div className='card-wrapper'>
        <div className='space' />
        <div className='content'>
          <h1 className='number'>{value}</h1>
        </div>
        <span className={`highlighter ${color}`} />
        {title && <h4 className='title'>{title}</h4>}
      </div>
    </Card>
  );
}
