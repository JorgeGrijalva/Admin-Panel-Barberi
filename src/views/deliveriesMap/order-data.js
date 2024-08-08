import React from 'react';
import { Avatar, Col, Rate, Row, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { IMG_URL } from '../../configs/app-global';
import { nFormatter } from '../../helpers/nFormatter';
import useUserActivity from '../../helpers/useUserActivity';
import numberToPrice from '../../helpers/numberToPrice';

const OrderData = ({ data, order }) => {
  const { t } = useTranslation();
  const lastSeen = useUserActivity(data?.delivery_man_setting?.updated_at);
  const rate = data?.assign_reviews_avg_rating;
  const phone = data?.phone;
  const ordersCount = data?.delivery_man_orders_count;
  const totalPrice = data?.delivery_man_orders_sum_total_price;
  const vehicle = data?.delivery_man_setting;
  const user = order?.user;

  return (
    <div>
      <Tabs>
        <Tabs.TabPane tab={t('order.details')} key='item-1'>
          <Row gutter={12} align='middle' className='pt-2'>
            <Col span={4}>
              <div className='title'>#{order?.id}</div>
              <div className='label'>{t('order.id')}</div>
            </Col>
            <Col span={5}>
              <div className='title'>
                {order?.km} {t('km')}
              </div>
              <div className='label'>{t('distance')}</div>
            </Col>
            <Col span={5}>
              <div className='title'>{numberToPrice(order?.delivery_fee)}</div>
              <div className='label'>{t('delivery.fee')}</div>
            </Col>
            <Col span={5}>
              <div className='title'>{numberToPrice(order?.total_price)}</div>
              <div className='label'> {t('total.price')}</div>
            </Col>
            <Col span={5}>
              <div className='title'>{t(order?.status)}</div>
              <div className='label'>{t('status')}</div>
            </Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('driver.information')} key='item-2'>
          <Row gutter={12} align='middle' className=''>
            <Col span={8}>
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
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('vehicle')} key='item-3'>
          <Row gutter={12} align='middle' className='pt-2'>
            <Col span={4}>
              <div className='title'>{vehicle?.number}</div>
              <div className='label'>{t('number')}</div>
            </Col>
            <Col span={4}>
              <div className='title'>{vehicle?.brand}</div>
              <div className='label'>{t('brand')}</div>
            </Col>
            <Col span={4}>
              <div className='title'>{vehicle?.model}</div>
              <div className='label'>{t('model')}</div>
            </Col>
            <Col span={4}>
              <div className='title'>{vehicle?.type_of_technique}</div>
              <div className='label'>{t('fuel')}</div>
            </Col>
            <Col span={4}>
              <div className='title'>{vehicle?.color}</div>
              <div className='label'>{t('color')}</div>
            </Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('customer.information')} key='item-4'>
          <Row gutter={12} align='middle' className='pt-2'>
            <Col span={2}>
              <Avatar src={IMG_URL + user?.img} />
            </Col>
            <Col span={6}>
              <div className='title'>{user?.firstname}</div>
              <div className='label'>{t('firstname')}</div>
            </Col>
            <Col span={6}>
              <div className='title'>{user?.lastname}</div>
              <div className='label'>{t('lastname')}</div>
            </Col>
            <Col span={6}>
              <div className='title'>{order?.address?.address || t('no')}</div>
              <div className='label'>{t('address')}</div>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default OrderData;
