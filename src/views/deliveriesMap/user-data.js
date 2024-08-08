import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Avatar, Col, Rate, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { IMG_URL } from '../../configs/app-global';
import { nFormatter } from '../../helpers/nFormatter';
import useUserActivity from '../../helpers/useUserActivity';

const UserData = ({ data, handleClose }) => {
  const { t } = useTranslation();
  const lastSeen = useUserActivity(data?.delivery_man_setting?.updated_at);
  const rate = data?.assign_reviews_avg_rating;
  const phone = data?.phone;
  const ordersCount = data?.delivery_man_orders_count;
  const totalPrice = data?.delivery_man_orders_sum_total_price;

  return (
    <Row gutter={12} align='middle'>
      <Col span={7}>
        <div className='d-flex align-items-center'>
          <Avatar src={IMG_URL + data?.img} />
          <div className='ml-2'>
            <div className='title'>
              {data?.firstname + ' ' + data?.lastname}
            </div>
            <Rate disabled allowHalf value={rate || 0} />
          </div>
        </div>
      </Col>
      <Col span={4}>
        <div className='title'>{phone}</div>
        <div className='label'>{t('phone')}</div>
      </Col>
      <Col span={4}>
        <div className='title'>{lastSeen}</div>
        <div className='label'>{t('last.activity')}</div>
      </Col>
      <Col span={4}>
        <div className='title'>{ordersCount}</div>
        <div className='label'>{t('total.orders')}</div>
      </Col>
      <Col span={4}>
        <div className='title'>{nFormatter(totalPrice)}</div>
        <div className='label'> {t('total.earning')}</div>
      </Col>
      <Col span={1}>
        <button type='button' className='close-btn' onClick={handleClose}>
          <CloseOutlined />
        </button>
      </Col>
    </Row>
  );
};

export default UserData;
