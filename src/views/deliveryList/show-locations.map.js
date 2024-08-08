import GoogleMapReact from 'google-map-react';
import { Button, Modal } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import { MAP_API_KEY } from 'configs/app-global';
import FaUser from 'assets/images/user.jpg';
// import FaStore from 'assets/images/shop.png';
import getDefaultLocation from 'helpers/getDefaultLocation';

const User = () => (
  <img
    src={FaUser}
    width='50'
    alt='Pin'
    style={{
      position: 'absolute',
      transform: 'translate(-50%, -100%)',
    }}
  />
);
// const Store = () => <img src={FaStore} width='50' alt='Pin' />;

const ShowLocationsMap = ({ id: data, handleCancel }) => {
  const { t } = useTranslation();
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual,
  );
  const center = getDefaultLocation(settings);
  const user = {
    lat: data?.delivery_man_setting?.location?.latitude,
    lng: data?.delivery_man_setting?.location?.longitude,
  };

  const { google_map_key } = useSelector(
    (state) => state.globalSettings.settings,
    shallowEqual,
  );

  return (
    <>
      <Modal
        visible={!!data}
        title={t('show.locations')}
        closable={false}
        style={{ minWidth: '80vw' }}
        onCancel={handleCancel}
        footer={[
          <Button type='default' key={'cancelBtn'} onClick={handleCancel}>
            {t('cancel')}
          </Button>,
        ]}
      >
        <div className='map-container' style={{ height: 400, width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: google_map_key === undefined ? MAP_API_KEY : google_map_key,
            }}
            defaultZoom={10}
            center={center}
            options={{
              fullscreenControl: false,
            }}
          >
            {data?.delivery_man_setting !== null ? (
              <User lat={user?.lat} lng={user?.lng} />
            ) : null}
          </GoogleMapReact>
        </div>
      </Modal>
    </>
  );
};

export default ShowLocationsMap;
