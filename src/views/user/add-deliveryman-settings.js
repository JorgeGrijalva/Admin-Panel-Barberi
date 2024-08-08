import { Button, Col, Form, Input, Row, Select, Switch } from 'antd';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import deliveryService from '../../services/delivery';
import Loading from '../../components/loading';
import { shallowEqual, useSelector } from 'react-redux';
import MediaUpload from '../../components/upload';
import Map from '../../components/map';
import getDefaultLocation from '../../helpers/getDefaultLocation';
import { toast } from 'react-toastify';
import { DebounceSelect } from 'components/search';
import cityService from 'services/deliveryzone/city';
import countryService from 'services/deliveryzone/country';

const type_of_technique = [
  { label: 'Benzine', value: 'benzine' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Gas', value: 'gas' },
  { label: 'Motorbike', value: 'motorbike' },
  { label: 'Bike', value: 'bike' },
  { label: 'Foot', value: 'foot' },
  { label: 'Electric', value: 'electric' },
];

const DelivertSettingCreate = ({ id, data }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState([]);
  const [address, setAddress] = useState('');
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual,
  );
  const [location, setLocation] = useState(getDefaultLocation(settings));

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
          country: {
            label: res.data?.country?.translation?.title,
            value: res.data?.country?.id,
            key: res.data?.country?.region_id,
          },
          city: {
            label: res.data?.city?.translation?.title,
            value: res.data?.city?.id,
          },
          user_id: {
            label:
              res.data.deliveryman?.firstname +
              ' ' +
              res.data.deliveryman?.firstname,
            value: res.data.deliveryman?.id,
            images: createImages(res.data.galleries),
            location: {
              lat: res.data?.location?.latitude,
              lng: res.data?.location?.longitude,
            },
          },
        };
        setLocation({
          lat: res.data?.location?.latitude,
          lng: res.data?.location?.longitude,
        });
        setImage(createImages(res.data.galleries));
        form.setFieldsValue(responseData);
      })
      .finally(() => setLoading(false));
  };

  const onFinish = (values) => {
    setLoadingBtn(true);
    const params = {
      ...values,
      user_id: data.id,
      images: image[0]?.name ? [image[0]?.name] : undefined,
      country_id: values?.country?.value,
      city_id: values?.city?.value,
      region_id: values?.country?.key,
      location: {
        latitude: location.lat,
        longitude: location.lng,
      },
      online: Boolean(values.online),
    };
    deliveryService
      .update(id, params)
      .then(() => toast.success(t('successfully.updated')))
      .finally(() => setLoadingBtn(false));
  };

  const country = Form.useWatch('country', form);

  const fetchCountries = (search) => {
    const params = {
      search,
      perPage: 10,
      page: 1,
      has_price: 1,
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
      country_id: country?.value,
      has_price: 1,
    };

    return cityService.get(params).then(({ data }) =>
      data?.flatMap((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  useEffect(() => {
    if (id) fetchDeliverySettings(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form name='basic' layout='vertical' onFinish={onFinish} form={form}>
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
                  required: true,
                  message: t('required'),
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
                  required: true,
                  message: t('required'),
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
                  required: true,
                  message: t('required'),
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
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <Input />
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
                onClear={() => {
                  form.setFieldsValue({ city: [] });
                }}
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
                disabled={!country}
                autoComplete='none'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('image')} name='images'>
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
          <Col span={6}>
            <Form.Item
              label={t('online')}
              name='online'
              // rules={[{ required: true, message: t('required') }]}
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={t('map')} name='location'>
              <Map
                location={location}
                setLocation={setLocation}
                setAddress={setAddress}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Button type='primary' htmlType='submit' loading={loadingBtn}>
              {t('save')}
            </Button>
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default DelivertSettingCreate;
