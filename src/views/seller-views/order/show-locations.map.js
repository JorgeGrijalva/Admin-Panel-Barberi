import GoogleMapReact from 'google-map-react';
import { Button, Card, Col, Modal, Row, Steps, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import orderService from 'services/seller/order';
import Loading from 'components/loading';
import { BsCalendar2Day, BsCheckLg } from 'react-icons/bs';
import { shallowEqual, useSelector } from 'react-redux';
import { MAP_API_KEY } from 'configs/app-global';
import FaUser from 'assets/images/user.jpg';
import getDefaultLocation from 'helpers/getDefaultLocation';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { MdRestaurant } from 'react-icons/md';
import { IoBicycleSharp, IoCheckmarkDoneSharp } from 'react-icons/io5';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import moment from 'moment';
const { Step } = Steps;
const User = () => (
  <div
    style={{
      position: 'absolute',
      transform: 'translate(-50%, -100%)',
    }}
  >
    <img src={FaUser} width='50' alt='Pin' />
  </div>
);

const ShowLocationsMap = ({ id, handleCancel }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(null);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(null);
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual,
  );
  const center = getDefaultLocation(settings);
  const [current, setCurrent] = useState(0);
  const [userLocation, setUserLocation] = useState({
    lat: center?.lat,
    lng: center?.lng,
  });
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
            : steps,
        );
        setCurrent(
          data.status === 'canceled'
            ? 1
            : steps.find((item) => item.name === data.status)?.id,
        );

        const address = data?.address?.location ??
          data?.my_address?.location ??
          data?.delivery_point?.location ?? {
            latitude: center?.lat,
            longitude: center?.lng,
          };

        setUserLocation({
          lat: Number(address?.latitude),
          lng: Number(address?.longitude),
        });

        setStatus(data.status === 'canceled' ? 'error' : 'success');
        setData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const { google_map_key } = useSelector(
    (state) => state.globalSettings.settings,
    shallowEqual,
  );

  useEffect(() => {
    fetchOrder();
  }, []);

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
                  <BsCalendar2Day />{' '}
                  {moment(data?.created_at).format('YYYY-MM-DD HH:mm')}
                </p>
                <p>
                  {t('scheduled.at')} {data?.delivery_date}
                </p>
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
                      key: !!google_map_key ? MAP_API_KEY : google_map_key,
                    }}
                    defaultZoom={10}
                    center={userLocation ?? center}
                    options={{
                      fullscreenControl: false,
                    }}
                  >
                    <User lat={userLocation?.lat} lng={userLocation?.lng} />
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
