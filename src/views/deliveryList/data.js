import { Button, Card, Col, Modal, Row, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import orderService from '../../services/order';
import Loading from '../../components/loading';
import { BsCalendar2Day } from 'react-icons/bs';
import { shallowEqual, useSelector } from 'react-redux';
import getDefaultLocation from '../../helpers/getDefaultLocation';
import { color } from '../../components/color';
import axios from 'axios';
import { Map, Polyline } from 'google-maps-react';

const ShowLocationsMap = ({ id, handleCancel }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [data, setData] = useState(null);
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual
  );
  const center = getDefaultLocation(settings);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  function fetchOrder() {
    setLoading(true);
    orderService
      .getById(id)
      .then(({ data }) => {
        setData(data);
        const cardinata = {
          shopLng: data.location.longitude,
          shopLat: data.shop.location.latitude,
          userLng: data.shop.location.longitude,
          userLat: data.shop.location.latitude,
        };
        calculateRoute(cardinata);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function calculateRoute(prop) {
    axios
      .get(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248f6e34078af044336a130682f8a8f1468&start=${prop.shopLng},${prop.shopLat}&end=${prop.userLng},${prop.userLat}`
      )
      .then((res) => {
        setDirectionsResponse(
          res.data.features[0].geometry.coordinates.map((item) => ({
            lat: item[1],
            lng: item[0],
          }))
        );
      });
  }

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <>
      <Modal
        visible={!!id}
        title={t('show.locations')}
        closable={false}
        style={{ minWidth: '80vw' }}
        footer={[
          <Button type='default' key={'cancelBtn'} onClick={handleCancel}>
            {t('cancel')}
          </Button>,
          <Button type='default' onClick={calculateRoute}>
            {t('ookk')}
          </Button>,
        ]}
      >
        {loading ? (
          <Loading />
        ) : (
          <Card>
            <Row gutter={12}>
              <Col span={12}>
                <h3>
                  {t('order.id')} #{data?.id}
                </h3>
                <p>
                  <BsCalendar2Day /> {data?.created_at}
                </p>
                <p>
                  {t('schedulet.at')} {data?.delivery_date}
                </p>
                <span>
                  <strong>{data?.shop?.translation?.title}</strong>{' '}
                  {data?.details?.map((details, index) => (
                    <Tag color={color[index]} className='mb-2'>
                      {details?.stock?.product.translation.title}
                    </Tag>
                  ))}
                </span>
              </Col>
              <Col span={12}>
                <p>
                  {t('status')}{' '}
                  {data?.status === 'new' ? (
                    <Tag color='blue'>{t(data?.status)}</Tag>
                  ) : data?.status === 'canceled' ? (
                    <Tag color='error'>{t(data?.status)}</Tag>
                  ) : (
                    <Tag color='cyan'>{t(data?.status)}</Tag>
                  )}
                </p>
                <p>
                  {t('payment.method')}{' '}
                  <strong>{data?.transaction?.payment_system?.tag}</strong>
                </p>
                <p>
                  {t('order.type')} <strong>{data?.delivery_type}</strong>
                </p>
                <p>
                  {t('payment.type')}{' '}
                  <strong>{data?.transaction?.status}</strong>
                </p>
              </Col>

              <Col span={24} className='mt-5'>
                <h4>{t('map')}</h4>
                <div
                  className='map-container'
                  style={{ height: 400, width: '100%' }}
                >
                  <Map
                    zoom={12}
                    center={center}
                    options={{
                      fullscreenControl: false,
                    }}
                  >
                    <Polyline
                      key={'start'}
                      path={directionsResponse}
                      strokeColor='#C62827'
                      strokeOpacity={0.8}
                      strokeWeight={3}
                      fillColor='#C62827'
                      fillOpacity={0.35}
                    />
                  </Map>
                </div>
              </Col>
            </Row>
          </Card>
        )}
      </Modal>
    </>
  );
};

export default ShowLocationsMap;
