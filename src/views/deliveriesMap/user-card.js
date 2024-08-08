import React from 'react';
import { Avatar, Card, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { IMG_URL } from '../../configs/app-global';
import { UserOutlined } from '@ant-design/icons';
import useUserActivity from '../../helpers/useUserActivity';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, removeFromMenu } from '../../redux/slices/menu';

export default function UserCard({ data }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { menuItems } = useSelector((state) => state.menu, shallowEqual);
  const activeOrders = data?.deliveryman_orders || [];
  const lastSeen = useUserActivity(data?.delivery_man_setting?.updated_at);

  const goToShow = (row) => {
    const isExist = !!menuItems.find(
      (item) => item.id === 'delivery_map_orders'
    );
    if (isExist) {
      dispatch(
        removeFromMenu({
          id: `delivery_map_orders`,
          nextUrl: 'deliveries/map',
        })
      );
    }
    dispatch(
      addMenu({
        url: `deliveries/map/${row.id}`,
        id: `delivery_map_orders`,
        name: t('delivery.orders'),
        data: {
          list: activeOrders,
          item: activeOrders[0],
          deliveryman: data,
        },
      })
    );
    navigate(`/deliveries/map/${row.id}`);
  };

  return (
    <Card className='user-card' onClick={() => goToShow(data)}>
      <Space>
        <Avatar
          src={IMG_URL + data?.img}
          icon={<UserOutlined />}
          style={{ color: '#1a3353' }}
        />
        <div>
          <h4 className='title'>
            {data?.firstname} {data?.lastname?.charAt(0)}.
          </h4>
          <div
            className={`last-seen ${
              data?.delivery_man_setting?.online ? 'online' : 'text-muted'
            }`}
          >
            {data?.delivery_man_setting?.online ? t('online') : lastSeen}
          </div>
        </div>
      </Space>
      <div className='mt-2' />
      <Space>
        <div>{t('active_orders')}:</div>
        <div>{activeOrders.length}</div>
      </Space>
    </Card>
  );
}
