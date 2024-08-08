import { Radio } from 'antd';
import React from 'react';
import { BsList } from 'react-icons/bs';
import { RiDashboardLine } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';

const orderViewTypes = [
  {
    value: 'waiter/orders-board',
    title: 'Board',
    icon: <RiDashboardLine size={20} />,
  },
  {
    value: 'waiter/orders',
    title: 'List',
    icon: <BsList size={20} />,
  },
];

const OrderTypeSwitcher = ({ listType }) => {
  const { type } = useParams();
  const navigate = useNavigate();
  const handleChangeType = (e) => {
    navigate(`/${e.target.value}${type ? `/${type}` : ''}`);
  };

  return (
    <Radio.Group
      value={listType}
      onChange={handleChangeType}
      className='float-right'
      buttonStyle='solid'
    >
      {orderViewTypes?.map((item) => {
        return (
          <Radio.Button value={item.value} key={item.value}>
            <div className='d-flex align-items-center' style={{ gap: '10px' }}>
              {item.icon}
              {item.title}
            </div>
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );
};

export default OrderTypeSwitcher;
