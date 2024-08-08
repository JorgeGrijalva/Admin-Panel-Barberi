import React, { useState } from 'react';
import { Switch, Modal, Button, Col, Row } from 'antd';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setParcelMode } from 'redux/slices/theme';
import { shallowEqual, useSelector } from 'react-redux';
import { clearMenu } from 'redux/slices/menu';
import { useNavigate } from 'react-router-dom';

export default function ParcelFloat() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme, shallowEqual);
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual,
  );
  const [showModal, setShowModal] = useState(false);

  const activeParcel = Number(settings?.active_parcel);

  const handleChange = (event) => {
    console.log('event => ', event);
    if (activeParcel === 0) {
      setShowModal(true);
    } else {
      dispatch(setParcelMode(event));
      dispatch(clearMenu());
      navigate('/');
    }
  };

  return (
    <>
      <div className='parcel-float'>
        <div
          className='d-flex align-items-center justify-content-between'
          style={{ columnGap: 12 }}
        >
          <label>{t('parcel.mode')}:</label>
          <Switch checked={theme.parcelMode} onChange={handleChange} />
        </div>
      </div>
      <Modal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={[
          <Button type='default' onClick={() => setShowModal(false)}>
            {t('cancel')}
          </Button>,
        ]}
      >
        <Row gutter={12}>
          <Col span={24}>
            <p>{t('first.activate.the.parcel')}</p>
            <p>{t('path.business.settings.general.settings.permission')}</p>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
