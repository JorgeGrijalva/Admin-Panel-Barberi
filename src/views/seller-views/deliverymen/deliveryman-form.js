import { useEffect, useState } from 'react';
import { Form, Row, Col, Input, Button, Select, Switch, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { DebounceSelect } from 'components/search';
import addressService from 'services/rest/address';
import MediaUpload from 'components/upload';
import Map from 'components/map';
import getDefaultLocation from 'helpers/getDefaultLocation';
import { shallowEqual, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import sellerUserServices from 'services/seller/user';
import { toast } from 'react-toastify';

const type_of_technique = [
  { label: 'Benzine', value: 'benzine' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Gas', value: 'gas' },
  { label: 'Motorbike', value: 'motorbike' },
  { label: 'Bike', value: 'bike' },
  { label: 'Foot', value: 'foot' },
  { label: 'Electric', value: 'electric' },
];

const DeliverymanForm = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { uuid } = useParams();

  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual,
  );
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);
  const deliveryman_settings_id = activeMenu.data?.deliveryman_settings_id;
  const deliveryman_id = activeMenu.data?.deliveryman_id;

  const [country, setCountry] = useState(form.getFieldsValue()?.country);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(getDefaultLocation(settings));

  useEffect(() => {
    if (uuid && activeMenu.data?.deliveryman_settings_id) {
      fetchDeliverySettings();
    }
  }, [uuid]);

  const createImages = (items) =>
    items.map((item) => ({
      uid: item.id,
      name: item.path,
      url: item.path,
    }));

  const fetchDeliverySettings = () => {
    setLoading(true);
    sellerUserServices
      .getDeliverymanSettings(deliveryman_settings_id)
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
        setCountry(responseData?.country);
        setLocation({
          lat: res.data?.location?.latitude,
          lng: res.data?.location?.longitude,
        });
        setImage(createImages(res?.data?.galleries));
        form.setFieldsValue(responseData);
      })
      .finally(() => setLoading(false));
  };

  const fetchCountries = (search) => {
    const params = {
      search,
      perPage: 10,
      page: 1,
      has_price: 1,
      shop_id: myShop?.id,
    };

    if (!search?.trim()?.length) delete params.search;

    return addressService.getCountries(params).then(({ data }) =>
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
      country_id: form.getFieldsValue()?.country?.value,
      has_price: 1,
      shop_id: myShop?.id,
    };

    if (!search?.trim()?.length) delete params.search;

    return addressService.getCities(params).then(({ data }) =>
      data?.flatMap((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      ...values,
      user_id: deliveryman_id,
      images: image[0]?.name ? image?.map((item) => item?.name) : undefined,
      country_id: values?.country?.value,
      city_id: values?.city?.value,
      region_id: values?.country?.key,
      location: {
        latitude: location.lat,
        longitude: location.lng,
      },
      online: Boolean(values.online),
    };

    delete body.country;
    delete body.city;

    if (activeMenu.data?.delivery_man_setting) {
      //update
      sellerUserServices
        .updateDeliverymanSettings(deliveryman_settings_id, body)
        .then(() => toast.success(t('successfully.updated')))
        .finally(() => setLoadingBtn(false));
    } else {
      sellerUserServices
        .createDeliverymanSettings(body)
        .then(() => toast.success(t('successfully.created')))
        .finally(() => setLoadingBtn(false));
    }
  };

  return (
    <Card loading={loading}>
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{ online: false }}
      >
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
              <Input maxLength={20} />
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
              <Input maxLength={20} />
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
              <Input maxLength={20} />
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
              <Input maxLength={20} />
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
                onChange={(value) => {
                  form.setFieldsValue({ city: [] });
                  setCountry(value);
                }}
                onClear={() => {
                  form.setFieldsValue({ city: [] });
                  setCountry(null);
                }}
                autocomplete='none'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='city'
              label={t('city')}
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <DebounceSelect
                fetchOptions={fetchCities}
                placeholder={t('select.city')}
                refetchOptions={true}
                disabled={!country}
                autocomplete='none'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('image')}
              name='images'
              rules={[
                {
                  required: !image?.length,
                  message: t('required'),
                },
              ]}
            >
              <MediaUpload
                type='deliveryman/settings'
                imageList={image}
                setImageList={setImage}
                form={form}
                multiple={true}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
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
        <Button type='primary' htmlType='submit' loading={loadingBtn}>
          {t('submit')}
        </Button>
      </Form>
    </Card>
  );
};

export default DeliverymanForm;
