import { Button, Card, Col, Form, Row, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import DrawingManager from '../../components/drawing-map';
import { BsArrowsMove } from 'react-icons/bs';
import MapGif from '../../assets/video/map.gif';
import deliveryZone from '../../services/zone';
import Loading from '../../components/loading';
import { toast } from 'react-toastify';

const Map = ({ next, prev }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [triangleCoords, settriangleCoords] = useState([]);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [merge, setMerge] = useState(null);
  const [loading, setLoading] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  function getMap(id) {
    setLoading(true);
    deliveryZone
      .getById(id)
      .then((res) => {
        settriangleCoords(
          res.data !== undefined
            ? res.data?.address?.map((item) => ({
                lat: item[0],
                lng: item[1],
              }))
            : []
        );
      })
      .finally(() => setLoading(false));
  }

  const onFinish = () => {
    if (triangleCoords.length < 3) {
      toast.warning(t('place.selected.map'));
      return;
    }

    if (!merge) {
      toast.warning(t('place.selected.map'));
      return;
    }

    setLoadingBtn(true);
    const body = {
      shop_id: activeMenu.data.id,
      address: triangleCoords.map((item) => ({
        0: item.lat,
        1: item.lng,
      })),
    };
    deliveryZone
      .create(body)
      .then(() => next())
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.data?.id) {
      getMap(activeMenu.data?.id);
    }
  }, [activeMenu.data]);

  return (
    <Form form={form} name='map' layout='vertical' onFinish={onFinish}>
      {!loading ? (
        <>
          <Row>
            <Col span={24}>
              <Card title={<h3 className='p-0 m-0'>{t('delivery.zone')}</h3>}>
                <Row gutter={12}>
                  <Col span={24} className={'mb-3'}>
                    <h4>Instructions</h4>
                    Create zone by click on map and connect the dots together
                  </Col>
                  <Col span={24} className={'mb-3'}>
                    <Space>
                      <BsArrowsMove size={25} />
                      <p>{t('delivery.zone.text')}</p>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <img
                      src={MapGif}
                      alt='map gif'
                      style={{ object: 'contain' }}
                    />
                  </Col>
                  <Col span={24}>
                    <DrawingManager
                      triangleCoords={triangleCoords}
                      settriangleCoords={settriangleCoords}
                      setMerge={setMerge}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Space>
            <Button type='primary' htmlType='submit' loading={loadingBtn}>
              {t('next')}
            </Button>
            <Button htmlType='submit' onClick={() => prev()}>
              {t('prev')}
            </Button>
          </Space>
        </>
      ) : (
        <Loading />
      )}
    </Form>
  );
};

export default Map;
