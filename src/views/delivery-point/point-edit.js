import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Switch,
  message,
} from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import getTranslationFields from 'helpers/getTranslationFields';
import LanguageList from 'components/language-list';
import MediaUpload from 'components/upload';
import deliveryPointService from 'services/delivery-point';
import { RefetchSearch } from 'components/refetch-search';
import regionService from 'services/deliveryzone/region';
import countryService from 'services/deliveryzone/country';
import cityService from 'services/deliveryzone/city';
import Map from 'components/map';
import areaService from 'services/deliveryzone/area';
import AdressForm from 'components/forms/address-form';

const EditDeliveryPoint = ({ next }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState([]);
  const [location, setLocation] = useState('');
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [formData, setFormData] = useState({});
  const [value, setValue] = useState('');
  const { country, region, city } = formData;
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  function getLanguageFields(data) {
    if (!data?.translations) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.title,
      [`address[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.address,
    }));
    return Object.assign({}, ...result);
  }

  const getDeliveryPoint = () => {
    setLoading(true);
    deliveryPointService
      .getById(id)
      .then(({ data }) => {
        const { city, country, region, area, ...rest } = data;
        const fieldName = `address[${defaultLang}]`;

        const deliveryzone = {
          area: { label: area?.translation?.title, value: area?.id },
          city: { label: city?.translation?.title, value: city?.id },
          country: { label: country?.translation?.title, value: country?.id },
          region: { label: region?.translation?.title, value: region?.id },
        };

        const formData = {
          ...getLanguageFields(data),
          ...deliveryzone,
          ...rest,
          [fieldName]: data.address?.[defaultLang],
        };

        form.setFieldsValue(formData);
        setImage([{ name: data.img }]);
        setFormData(deliveryzone);
        setLocation({
          lat: data.location?.latitude,
          lng: data.location?.longitude,
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) getDeliveryPoint();
  }, [id]);

  const onFinish = (values) => {
    const { area, city, country, region, price, fitting_rooms, active } =
      values;
    const body = {
      price,
      fitting_rooms,
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
    setLoadingBtn(true);
    deliveryPointService
      .update(id, body)
      .then(() => {
        message.success(t('successfully.created'));
        const formFieldsValue = form.getFieldsValue(true);
        dispatch(
          setMenuData({
            activeMenu,
            data: { ...formFieldsValue, id },
          })
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
          <Card title={t('deliveryzone')} className='h-100' loading={loading}>
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
          <Card title={t('pricing')} className='h-100' loading={loading}>
            <Col span={24}>
              <Form.Item
                label={t('price')}
                name='price'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber className='w-100' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('fitting_rooms')}
                name='fitting_rooms'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber className='w-100' />
              </Form.Item>
            </Col>
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
          <Card title={t('address')} loading={loading} extra={<LanguageList />}>
            <Row gutter={12}>
              <Col span={12}>
                <AdressForm
                  setLocation={setLocation}
                  value={value}
                  setValue={setValue}
                />
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
      <div className='flex-grow-1 d-flex justify-content-end'>
        <div className='pb-5'>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('submit')}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default EditDeliveryPoint;
