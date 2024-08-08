import React from 'react';
import { Button, Card, Result } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu } from '../../redux/slices/menu';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SmileOutlined } from '@ant-design/icons';

export default function ModeratorDashboard() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth, shallowEqual);

  const goToOrders = () => {
    dispatch(
      addMenu({
        id: 'orders',
        url: 'seller/orders',
        name: t('orders'),
      })
    );
    navigate('/seller/orders');
  };

  return (
    <Card>
      <Result
        icon={<SmileOutlined />}
        title={`${t('welcome')}, ${user?.fullName}`}
        subTitle={t('welcome.manager')}
        extra={
          <Button type='primary' onClick={goToOrders}>
            {t('get.started')}
          </Button>
        }
      />
    </Card>
  );
}
