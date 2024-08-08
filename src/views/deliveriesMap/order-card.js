import React from 'react';
import { Card, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setMenuData } from '../../redux/slices/menu';
import moment from 'moment';

export default function OrderCard({ data, active }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const handleClick = () => {
    dispatch(
      setMenuData({
        activeMenu,
        data: {
          ...activeMenu.data,
          item: data,
        },
      }),
    );
  };

  return (
    <Card
      className={`user-card ${active ? 'active' : ''}`}
      onClick={handleClick}
    >
      <Space>
        <div>
          <h4 className='title'>
            {data?.shop?.translation?.title} #{data?.id}
          </h4>
          <div className='text-muted'>{t(data?.status)}</div>
        </div>
      </Space>
      <div className='mt-2' />
      <Space>
        <div>{t('delivery.time')}:</div>
        <div>{moment(data?.delivery_date).format('Do MMM, H:mm')}</div>
      </Space>
    </Card>
  );
}
