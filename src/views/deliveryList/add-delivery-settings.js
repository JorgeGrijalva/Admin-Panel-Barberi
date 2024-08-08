import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Switch,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import deliveryService from 'services/delivery';
import Loading from 'components/loading';
import { fetchDelivery } from 'redux/slices/deliveries';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import MediaUpload from 'components/upload';
import Map from 'components/map';
import getDefaultLocation from 'helpers/getDefaultLocation';
import { DebounceSelect } from 'components/search';
import countryService from 'services/deliveryzone/country';
import cityService from 'services/deliveryzone/city';
import regionService from 'services/deliveryzone/region';

const type_of_technique = [
  { label: 'Benzine', value: 'benzine' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Gas', value: 'gas' },
  { label: 'Motorbike', value: 'motorbike' },
  { label: 'Bike', value: 'bike' },
  { label: 'Foot', value: 'foot' },
  { label: 'Electric', value: 'electric' },
];

const DeliverySettingCreate = ({ data, handleCancel }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState([]);
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual,
  );
  const [location, setLocation] = useState(getDefaultLocation(settings));
  const [deliveryZone, setDeliveryZone] = useState({
    region: null,
    country: null,
    city: null,
  });

  const createImages = (items) =>
    items.map((item) => ({
      uid: item.id,
      name: item.path,
      url: item.path,
    }));

  const fetchDeliverySettings = (id) => {
    setLoading(true);
    deliveryService
      .getById(id)
      .then((res) => {
        const responseData = {
          ...res.data,
          user_id: {
            label:
              res.data?.deliveryman?.firstname +
              ' ' +
              res.data?.deliveryman?.firstname,
            value: res.data?.deliveryman?.id,
            images: createImages(res.data?.galleries),
            location: {
              lat: res.data?.location?.latitude,
              lng: res.data?.location?.longitude,
            },
          },
          region: !!res.data?.region
            ? {
                label: res.data?.region?.translation?.title,
                value: res.data?.region?.id,
                key: res.data?.region?.id,
              }
            : null,
          country: !!res.data?.country
            ? {
                label: res.data?.country?.translation?.title,
                value: res.data?.country?.id,
                key: res.data?.country?.id,
              }
            : null,
          city: !!res.data?.city
            ? {
                label: res.data?.city?.translation?.title,
                value: res.data?.city?.id,
                key: res.data?.city?.id,
              }
            : null,
        };
        setDeliveryZone({
          region: !!res.data?.region
            ? {
                label: res.data?.region?.translation?.title,
                value: res.data?.region?.id,
                key: res.data?.region?.id,
              }
            : null,
          country: !!res.data?.country
            ? {
                label: res.data?.country?.translation?.title,
                value: res.data?.country?.id,
                key: res.data?.country?.id,
              }
            : null,
          city: !!res.data?.city
            ? {
                label: res.data?.city?.translation?.title,
                value: res.data?.city?.id,
                key: res.data?.city?.id,
              }
            : null,
        });
        setLocation({
          lat: res.data?.location?.latitude,
          lng: res.data?.location?.longitude,
        });
        setImage(createImages(res.data.galleries));
        form.setFieldsValue(responseData);
      })
      .finally(() => setLoading(false));
  };

  const fetchRegions = (search) => {
    const params = {
      search,
      perPage: 10,
      page: 1,
      // has_price: 1,
    };

    return regionService.get(params).then(({ data }) =>
      data?.flatMap((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const fetchCountries = (search) => {
    const params = {
      search,
      perPage: 10,
      page: 1,
      region_id: deliveryZone?.region?.value,
      // has_price: 1,
    };

    return countryService.get(params).then(({ data }) =>
      data?.flatMap((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.region_id,
      })),
    );
  };

  const fetchCities = (search) => {
    const params = {
      search,
      perPage: 10,
      page: 1,
      country_id: deliveryZone?.country?.value,
      // has_price: 1,
    };

    return cityService.get(params).then(({ data }) =>
      data?.flatMap((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const onFinish = (values) => {
    setLoadingBtn(true);
    const params = {
      ...values,
      user_id: data.id,
      images: image.map((img) => img.name),
      location: {
        latitude: location.lat,
        longitude: location.lng,
      },
      region_id: values.region.value,
      country_id: values.country.value,
      city_id: values.city.value,
    };
    if (data.settingsId) {
      deliveryService
        .update(data.settingsId, params)
        .then(() => {
          handleCancel();
          dispatch(fetchDelivery({}));
        })
        .finally(() => setLoadingBtn(false));
    } else {
      deliveryService
        .create(params)
        .then(() => {
          handleCancel();
          dispatch(fetchDelivery({}));
        })
        .finally(() => setLoadingBtn(false));
    }
  };

  useEffect(() => {
    if (data.settingsId) {
      fetchDeliverySettings(data.settingsId);
    }
  }, []);

  return (
    <>
      <Modal
        visible={!!data}
        title={data.id ? t('edit.delivery.setting') : t('add.delivery.setting')}
        closable={false}
        onCancel={handleCancel}
        style={{ minWidth: '80vw' }}
        footer={[
          <Space>
            <Button
              type='primary'
              htmlType='submit'
              key={'submit'}
              onClick={() => form.submit()}
              loading={loadingBtn}
            >
              {t('submit')}
            </Button>
            <Button type='default' key={'cancelBtn'} onClick={handleCancel}>
              {t('cancel')}
            </Button>
          </Space>,
        ]}
      >
        <Form
          name='basic'
          layout='vertical'
          onFinish={onFinish}
          form={form}
          initialValues={{ online: true }}
        >
          {loading ? (
            <Loading />
          ) : (
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  label={t('brand')}
                  name='brand'
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(new Error(t('required')));
                        } else if (value && value?.trim() === '') {
                          return Promise.reject(new Error(t('no.empty.space')));
                        } else if (value && value?.trim().length < 2) {
                          return Promise.reject(
                            new Error(t('must.be.at.least.2')),
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('model')}
                  name='model'
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(new Error(t('required')));
                        } else if (value && value?.trim() === '') {
                          return Promise.reject(new Error(t('no.empty.space')));
                        } else if (value && value?.trim().length < 2) {
                          return Promise.reject(
                            new Error(t('must.be.at.least.2')),
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('type.of.technique')}
                  name='type_of_technique'
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <Select options={type_of_technique} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('car.number')}
                  name='number'
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(new Error(t('required')));
                        } else if (value && value?.trim() === '') {
                          return Promise.reject(new Error(t('no.empty.space')));
                        } else if (value && value?.trim().length < 2) {
                          return Promise.reject(
                            new Error(t('must.be.at.least.2')),
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('car.color')}
                  name='color'
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(new Error(t('required')));
                        } else if (value && value?.trim() === '') {
                          return Promise.reject(new Error(t('no.empty.space')));
                        } else if (value && value?.trim().length < 2) {
                          return Promise.reject(
                            new Error(t('must.be.at.least.2')),
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='region'
                  label={t('region')}
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <DebounceSelect
                    fetchOptions={fetchRegions}
                    placeholder={t('select.region')}
                    onChange={(value) => {
                      form.setFieldsValue({
                        country: null,
                        city: null,
                      });
                      setDeliveryZone({
                        region: value,
                        country: null,
                        city: null,
                      });
                    }}
                    onClear={() => {
                      form.setFieldsValue({
                        region: [],
                        country: [],
                        city: [],
                      });
                      setDeliveryZone({
                        region: null,
                        country: null,
                        city: null,
                      });
                    }}
                    autoComplete='none'
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='country'
                  label={t('country')}
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <DebounceSelect
                    fetchOptions={fetchCountries}
                    placeholder={t('select.country')}
                    refetchOptions={true}
                    onChange={(value) => {
                      form.setFieldsValue({
                        city: null,
                      });
                      setDeliveryZone({
                        ...deliveryZone,
                        country: value,
                        city: null,
                      });
                    }}
                    onClear={() => {
                      form.setFieldsValue({ country: [], city: [] });
                      setDeliveryZone({
                        ...deliveryZone,
                        country: null,
                        city: null,
                      });
                    }}
                    disabled={!deliveryZone.region}
                    autoComplete='none'
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='city' label={t('city')}>
                  <DebounceSelect
                    fetchOptions={fetchCities}
                    placeholder={t('select.city')}
                    refetchOptions={true}
                    disabled={!deliveryZone.region || !deliveryZone.country}
                    autoComplete='none'
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('image')}
                  name='images'
                  rules={[
                    {
                      validator() {
                        if (image?.length === 0) {
                          return Promise.reject(new Error(t('required')));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <MediaUpload
                    type='deliveryman/settings'
                    imageList={image}
                    setImageList={setImage}
                    form={form}
                    length='1'
                    multiple={true}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('online')}
                  name='online'
                  valuePropName='checked'
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={t('map')} name='location'>
                  <Map location={location} setLocation={setLocation} />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default DeliverySettingCreate;
