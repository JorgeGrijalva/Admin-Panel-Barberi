import React, { useEffect, useState } from 'react';
import { Avatar, Card, Col, Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import getDefaultLocation from 'helpers/getDefaultLocation';
import { IMG_URL } from 'configs/app-global';
import { fetchDelivery } from 'redux/slices/deliveries';
import { disableRefetch } from 'redux/slices/menu';
import Loading from 'components/loading';
import useDidUpdate from 'helpers/useDidUpdate';
import UserData from './user-data';
import UserCard from './user-card';
import { UserOutlined } from '@ant-design/icons';
import MapCustomMarker from 'components/map-custom-marker';

const deliveryType = [
  { label: 'All', value: 'all', key: 1 },
  { label: 'Online', value: '1', key: 2 },
  { label: 'Offline', value: '0', key: 3 },
];

const Marker = (props) => (
  <Avatar
    src={props.url}
    icon={<UserOutlined />}
    style={{ color: '#1a3353' }}
    onClick={props.onClick}
  />
);

export default function DeliveriesMap() {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [active, setActive] = useState(undefined);
  const [userData, setUserData] = useState(null);
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual,
  );
  const center = getDefaultLocation(settings);
  const { delivery, loading } = useSelector(
    (state) => state.deliveries,
    shallowEqual,
  );

  useDidUpdate(() => {
    const params = {
      page: 1,
      perPage: 100,
      online: active === 'all' ? undefined : active,
      'statuses[0]': 'new',
      'statuses[1]': 'accepted',
      'statuses[2]': 'ready',
      'statuses[3]': 'on_a_way',
    };
    dispatch(fetchDelivery(params));
  }, [active]);

  const handleLoadMap = (map, maps) => {
    const markers = delivery.map((item) => ({
      lat: Number(item?.delivery_man_setting?.location.latitude || '0'),
      lng: Number(item?.delivery_man_setting?.location.longitude || '0'),
    }));
    let bounds = new maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      bounds.extend(markers[i]);
    }
    map.fitBounds(bounds);
  };

  const onMapClick = (e) => {
    setUserData(e);
  };

  const onCloseDeliverymanDetails = () => {
    setUserData(null);
  };

  useEffect(() => {
    if (activeMenu?.refetch) {
      dispatch(
        fetchDelivery({
          perPage: 100,
          'statuses[0]': 'new',
          'statuses[1]': 'accepted',
          'statuses[2]': 'ready',
          'statuses[3]': 'on_a_way',
        }),
      );
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu?.refetch]);

  return (
    <Card
      title={t('deliveries')}
      className='delivery'
      extra={
        <Select
          options={deliveryType}
          defaultValue={'all'}
          loading={loading}
          onChange={(e) => setActive(e)}
          style={{ width: '200px' }}
        />
      }
    >
      {!loading ? (
        <Row gutter={8}>
          <Col span={18}>
            <div
              className='map-container'
              style={{ height: '73vh', width: '100%' }}
            >
              {!!userData && (
                <Card className='map-user-card'>
                  <UserData
                    data={userData}
                    handleClose={onCloseDeliverymanDetails}
                  />
                </Card>
              )}
              <MapCustomMarker center={center} handleLoadMap={handleLoadMap}>
                {delivery.map((item) => (
                  <Marker
                    key={item.id}
                    lat={Number(
                      item?.delivery_man_setting?.location?.latitude || '0',
                    )}
                    lng={Number(
                      item?.delivery_man_setting?.location?.longitude || '0',
                    )}
                    url={IMG_URL + item.img}
                    onClick={() => onMapClick(item)}
                  />
                ))}
              </MapCustomMarker>
            </div>
          </Col>
          <Col span={6}>
            <div className='order-list' style={{ height: '75vh' }}>
              {delivery.map((item, index) => (
                <UserCard key={item.id + index} data={item} />
              ))}
            </div>
          </Col>
        </Row>
      ) : (
        <Loading />
      )}
    </Card>
  );
}
