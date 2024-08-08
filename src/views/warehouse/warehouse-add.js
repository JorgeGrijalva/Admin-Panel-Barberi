import React, { useState } from 'react';
import { Button, Card, Col, Form, Input, Row, Switch, message } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import getTranslationFields from 'helpers/getTranslationFields';
import LanguageList from 'components/language-list';
import MediaUpload from 'components/upload';
import warehouseService from 'services/warehouse';
import { RefetchSearch } from 'components/refetch-search';
import regionService from 'services/deliveryzone/region';
import countryService from 'services/deliveryzone/country';
import cityService from 'services/deliveryzone/city';
import Map from 'components/map';
import AddressInput from 'components/address-input';
import areaService from 'services/deliveryzone/area';
import getDefaultLocation from 'helpers/getDefaultLocation';

const AddDeliveryPoint = ({ next }) => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual
  );
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [image, setImage] = useState([]);
  const [location, setLocation] = useState(getDefaultLocation(settings));
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [formData, setFormData] = useState({});
  const { country, region, city } = formData;

  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  const onFinish = (values) => {
    const { area, city, country, region, active } = values;

    const body = {
      location: {
        latitude: location?.lat,
        longitude: location?.lng,
      },
      active: active ? 1 : 0,
      area_id: area?.value,
      city_id: city?.value,
      country_id: country?.value,
      region_id: region?.value,
      images: image.map((image) => image.name),
      title: getTranslationFields(languages, values, 'title'),
      address: getTranslationFields(languages, values, 'address'),
    };
    if (activeMenu?.data?.id) {
      next();
      return;
    }
    setLoadingBtn(true);
    warehouseService
      .create(body)
      .then(({ data }) => {
        message.success(t('successfully.created'));
        const formFieldsValue = form.getFieldsValue(true);
        dispatch(
          setMenuData({ activeMenu, data: { ...formFieldsValue, id: data.id } })
        );
        next();
      })
      .finally(() => setLoadingBtn(false));
  };

  async function fetchRegion(search) {
    const params = {
      search,
      status: 1,
      perPage: 10,
    };
    return regionService.get(params).then(({ data }) =>
      data.map((item) => ({
        label: item.translation.title || 'no name',
        value: item.id,
      }))
    );
  }
  async function fetchCountry(search) {
    const params = { search, status: 1, perPage: 10, region_id: region?.value };
    return countryService.get(params).then(({ data }) =>
      data.map((item) => ({
        label: item.translation.title || 'no name',
        value: item.id,
      }))
    );
  }
  async function fetchCity(search) {
    const params = {
      search,
      status: 1,
      perPage: 10,
      country_id: country?.value,
    };
    return cityService.get(params).then(({ data }) =>
      data.map((item) => ({
        label: item.translation.title || 'no name',
        value: item.id,
      }))
    );
  }
  async function fetchArea(search) {
    const params = {
      search,
      status: 1,
      perPage: 10,
      city_id: city?.value,
    };
    return areaService.get(params).then(({ data }) =>
      data.map((item) => ({
        label: item.translation.title || 'no name',
        value: item.id,
      }))
    );
  }

  return (
    <Form
      name='add.delivery.point'
      layout='vertical'
      onFinish={onFinish}
      form={form}
      initialValues={{ clickable: true, ...activeMenu.data }}
    >
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card title={t('deliveryzone')} className='h-100'>
            <Col span={24}>
              <Form.Item
                label={t('region')}
                name='region'
                rules={[{ required: true, message: t('required') }]}
              >
                <RefetchSearch
                  fetchOptions={fetchRegion}
                  dropdownRender={(menu) => <>{menu}</>}
                  refetch={true}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, region: value }));
                    form.resetFields(['city', 'area', 'country']);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('country')}
                name='country'
                rules={[{ required: true, message: t('required') }]}
              >
                <RefetchSearch
                  fetchOptions={fetchCountry}
                  dropdownRender={(menu) => <>{menu}</>}
                  refetch={true}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, country: value }));
                    form.resetFields(['city', 'area']);
                  }}
                  disabled={!Boolean(region?.value)}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('city')}
                name='city'
                rules={[{ required: false, message: t('required') }]}
              >
                <RefetchSearch
                  fetchOptions={fetchCity}
                  dropdownRender={(menu) => <>{menu}</>}
                  refetch={true}
                  disabled={!Boolean(country?.value)}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, city: value }));
                    form.resetFields(['area']);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('area')}
                name='area'
                rules={[{ required: false, message: t('required') }]}
              >
                <RefetchSearch
                  fetchOptions={fetchArea}
                  dropdownRender={(menu) => <>{menu}</>}
                  refetch={true}
                  disabled={!Boolean(city?.value)}
                />
              </Form.Item>
            </Col>
          </Card>
        </Col>
        <Col span={12}>
          <Card title={t('media')} className='h-100'>
            <Col span={24}>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      {
                        required: false,
                        message: t('required'),
                      },
                    ]}
                    label={t('image')}
                    name='images'
                  >
                    <MediaUpload
                      type='products'
                      imageList={image}
                      setImageList={setImage}
                      form={form}
                      length='1'
                      multiple={false}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('active')}
                    name='active'
                    valuePropName='checked'
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Card>
        </Col>
        <Col span={24}>
          <Card title={t('address')} extra={<LanguageList />}>
            <Row gutter={12}>
              <Col span={12}>
                {languages.map((item, idx) => (
                  <AddressInput
                    setLocation={setLocation}
                    form={form}
                    item={item}
                    idx={idx}
                    defaultLang={defaultLang}
                  />
                ))}
              </Col>
              <Col span={12}>
                {languages.map((item, idx) => (
                  <Form.Item
                    key={'title' + idx}
                    label={t('title')}
                    name={`title[${item.locale}]`}
                    rules={[
                      {
                        required: item.locale === defaultLang,
                        message: t('required'),
                      },
                    ]}
                    hidden={item.locale !== defaultLang}
                  >
                    <Input />
                  </Form.Item>
                ))}
              </Col>
              <Col span={24}>
                <Map
                  location={location}
                  setLocation={setLocation}
                  setAddress={(value) =>
                    form.setFieldsValue({
                      [`address[${defaultLang}]`]: value,
                    })
                  }
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <div className='flex-grow-1 d-flex justify-content-end mt-4'>
        <div className='pb-5'>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('submit')}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default AddDeliveryPoint;
