import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, Col, Form, InputNumber, Row } from 'antd';
import { RefetchSearch } from 'components/refetch-search';
import { DebounceSelect } from 'components/search';
import regionService from 'services/deliveryzone/region';
import countryService from 'services/deliveryzone/country';
import cityService from 'services/deliveryzone/city';
import areaService from 'services/deliveryzone/area';
import shopService from 'services/shop';
import { setMenuData, disableRefetch } from 'redux/slices/menu';
import deliveryPriceService from 'services/delivery-price';
import Loading from 'components/loading';

export default function PriceForm({ form, handleSubmit }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { id } = useParams();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [formData, setFormData] = useState({});
  const { country, region, city } = formData;

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  useEffect(() => {
    if (activeMenu.refetch && id) {
      getDeliveryPrice(id);
    }
  }, [activeMenu.refetch]);

  function getLanguageFields(data) {
    if (!data?.translations) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.title,
      [`address[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.address,
    }));
    return Object.assign({}, ...result);
  }

  // fetch functions
  const getDeliveryPrice = () => {
    setLoading(true);
    deliveryPriceService
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
          shop_id: {
            label: data?.shop?.translation?.title,
            value: data?.shop?.id,
            key: data?.shop?.id,
          },
        };

        form.setFieldsValue(formData);
        setFormData(deliveryzone);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };
  async function fetchRegion(search) {
    const params = {
      search,
      status: 1,
      perPage: 10,
    };
    return regionService.get(params).then(({ data }) =>
      data.map((item) => ({
        label: item?.translation?.title || 'no name',
        value: item?.id,
        key: item?.id,
      })),
    );
  }
  async function fetchCountry(search) {
    const params = { search, status: 1, perPage: 10, region_id: region?.value };
    return countryService.get(params).then(({ data }) =>
      data.map((item) => ({
        label: item?.translation?.title || 'no name',
        value: item?.id,
        key: item?.id,
      })),
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
        label: item?.translation?.title || 'no name',
        value: item?.id,
        key: item?.id,
      })),
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
        label: item?.translation?.title || 'no name',
        value: item?.id,
        key: item?.id,
      })),
    );
  }

  const fetchShops = (search = '') => {
    const params = {
      search,
      perPage: 10,
      page: 1,
    };

    if (search.trim() === '') {
      delete params.search;
    }

    return shopService.getAll(params).then((res) => {
      return res?.data?.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      }));
    });
  };

  // onFinish
  const onFinish = (values) => {
    setLoadingBtn(true);
    handleSubmit(values).finally(() => setLoadingBtn(false));
  };

  return loading ? (
    <Loading />
  ) : (
    <Form
      form={form}
      name={!!id ? t('edit.delivery.price') : t('add.delivery.price')}
      layout='vertical'
      initialValues={{ clickable: true, ...activeMenu.data }}
      onFinish={onFinish}
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
          <Card title={t('pricing')} className='h-100'>
            <Col span={24}>
              <Form.Item
                label={`${t('price')} (${defaultCurrency?.symbol})`}
                name='price'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber className='w-100' />
              </Form.Item>
            </Col>
          </Card>
        </Col>
        <Col span={12}>
          <Card title={t('others')} className='h-100'>
            <Col span={24}>
              <Form.Item label={t('shop')} name='shop_id'>
                <DebounceSelect fetchOptions={fetchShops} />
              </Form.Item>
            </Col>
          </Card>
        </Col>
      </Row>
      <br />
      <div className='flex-grow-1 d-flex justify-content-end'>
        <div className='pb-5'>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('submit')}
          </Button>
        </div>
      </div>
    </Form>
  );
}
