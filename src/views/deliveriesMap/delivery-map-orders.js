import React from 'react';
import { Card, Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import MapCustomMarker from 'components/map-custom-marker';
import OrderCard from './order-card';
import OrderData from './order-data';
import getDefaultLocation from 'helpers/getDefaultLocation';
import { IMG_URL } from 'configs/app-global';
import userIcon from 'assets/images/user.jpg';
import shopIcon from 'assets/images/shop.png';
import courierIcon from 'assets/images/courier.png';

const CourierMarker = () => <img src={courierIcon} width={80} alt='user' />;
const ShopMarker = () => <img src={shopIcon} width={50} alt='shop' />;
const UserMarker = () => <img src={userIcon} width={50} alt='user' />;

export default function DeliveryMapOrders() {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const list = activeMenu?.data?.list || [];
  const data = activeMenu?.data?.item;
  const deliveryman = activeMenu?.data?.deliveryman;
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual,
  );
  const center = getDefaultLocation(settings);

  const handleLoadMap = (map, maps) => {
    const markers = [
      {
        lat: Number(
          deliveryman?.delivery_man_setting?.location?.latitude || '0',
        ),
        lng: Number(
          deliveryman?.delivery_man_setting?.location?.longitude || '0',
        ),
      },
      {
        lat: Number(data?.location?.latitude || '0'),
        lng: Number(data?.location?.longitude || '0'),
      },
      {
        lat: Number(data?.shop?.location?.latitude || '0'),
        lng: Number(data?.shop?.location?.longitude || '0'),
      },
    ];
    let bounds = new maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      bounds.extend(markers[i]);
    }
    map.fitBounds(bounds);
  };

  return (
    <Card title={t('active.orders')} className='delivery'>
      <Row gutter={8}>
        <Col span={6}>
          <div className='order-list'>
            {list.map((item, index) => (
              <OrderCard
                key={item.id + index}
                data={item}
                active={data?.id === item.id}
              />
            ))}
          </div>
        </Col>
        <Col span={18}>
          <Card className='map-user-card with-order'>
            <OrderData data={deliveryman} order={data} />
          </Card>
          <div
            className='map-container'
            style={{ height: '65vh', width: '100%' }}
          >
            <MapCustomMarker
              key={'map' + data?.id}
              center={center}
              handleLoadMap={handleLoadMap}
            >
              <CourierMarker
                lat={Number(
                  deliveryman?.delivery_man_setting?.location?.latitude || '0',
                )}
                lng={Number(
                  deliveryman?.delivery_man_setting?.location?.longitude || '0',
                )}
                url={IMG_URL + deliveryman?.img}
              />
              <UserMarker
                lat={Number(data?.location?.latitude || '0')}
                lng={Number(data?.location?.longitude || '0')}
              />
              <ShopMarker
                lat={Number(data?.shop?.location?.latitude || '0')}
                lng={Number(data?.shop?.location?.longitude || '0')}
              />
            </MapCustomMarker>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
