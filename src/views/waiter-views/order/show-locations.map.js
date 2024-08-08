import GoogleMapReact from 'google-map-react';
import { Button, Card, Col, Modal, Row, Steps, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import orderService from '../../../services/waiter/order';
import Loading from '../../../components/loading';
import { BsCalendar2Day, BsCheckLg } from 'react-icons/bs';
import { shallowEqual, useSelector } from 'react-redux';
import { MAP_API_KEY } from '../../../configs/app-global';
import FaUser from '../../../assets/images/user.jpg';
import FaStore from '../../../assets/images/shop.png';
import getDefaultLocation from '../../../helpers/getDefaultLocation';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { MdRestaurant } from 'react-icons/md';
import { IoBicycleSharp, IoCheckmarkDoneSharp } from 'react-icons/io5';
import { AiOutlineCloseCircle } from 'react-icons/ai';
const { Step } = Steps;
const User = () => <img src={FaUser} width='50' alt='Pin' />;
const Store = () => <img src={FaStore} width='50' alt='Pin' />;

const colors = ['blue', 'red', 'gold', 'volcano', 'cyan', 'lime'];

const ShowLocationsMap = ({ id, handleCancel }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(null);
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual
  );
  const center = getDefaultLocation(settings);
  const [current, setCurrent] = useState(0);
  const [shop, setShop] = useState(getDefaultLocation(settings));
  const [user, setUser] = useState(getDefaultLocation(settings));
  const [steps, setSteps] = useState([
    { id: 0, name: 'new', icon: <ShoppingCartOutlined /> },
    { id: 1, name: 'accepted', icon: <BsCheckLg /> },
    { id: 2, name: 'ready', icon: <MdRestaurant /> },
    { id: 3, name: 'on_a_way', icon: <IoBicycleSharp /> },
    { id: 4, name: 'delivered', icon: <IoCheckmarkDoneSharp /> },
  ]);

  function fetchOrder() {
    setLoading(true);
    orderService
      .getById(id)
      .then(({ data }) => {
        setSteps(
          data.status === 'canceled'
            ? [
                { id: 1, name: 'new', icon: <ShoppingCartOutlined /> },
                { id: 5, name: 'canceled', icon: <AiOutlineCloseCircle /> },
              ]
            : steps
        );
        setCurrent(
          data.status === 'canceled'
            ? 1
            : steps.find((item) => item.name === data.status)?.id
        );

        setStatus(data.status === 'canceled' ? 'error' : 'success');
        setData(data);
        setUser({
          lat: data.location.latitude,
          lng: data.location.longitude,
        });
        setShop({
          lat: data.shop.location.latitude,
          lng: data.shop.location.longitude,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const { google_map_key } = useSelector(
    (state) => state.globalSettings.settings,
    shallowEqual
  );

  useEffect(() => {
    fetchOrder();
  }, []);

  const handleLoadMap = ({ map, maps }) => {
    const markers = [shop, user].map((item) => ({
      lat: Number(item.lat || '0'),
      lng: Number(item.lng || '0'),
    }));

    let bounds = new maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      bounds.extend(markers[i]);
    }
    map.fitBounds(bounds);
  };

  return (
    <>
      <Modal
        visible={!!id}
        title={t('show.locations')}
        closable={true}
        onCancel={handleCancel}
        style={{ minWidth: '80vw' }}
        footer={[
          <Button type='default' key={'cancelBtn'} onClick={handleCancel}>
            {t('cancel')}
          </Button>,
        ]}
      >
        {loading ? (
          <Loading />
        ) : (
          <Card>
            <Steps current={current} status={status} className='mb-5'>
              {steps?.map((item, index) => (
                <Step
                  title={t(item.name)}
                  key={item.id + index}
                  icon={item?.icon}
                />
              ))}
            </Steps>
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
                    <Tag className='mb-2' color={colors[index]}>
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
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: google_map_key || MAP_API_KEY,
                    }}
                    defaultZoom={14}
                    center={center}
                    options={{
                      fullscreenControl: false,
                    }}
                    onGoogleApiLoaded={handleLoadMap}
                  >
                    <Store lat={shop?.lat} lng={shop?.lng} />
                    <User lat={user?.lat} lng={user?.lng} />
                  </GoogleMapReact>
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
