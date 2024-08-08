import { Col, Form } from 'antd';
import areaService from 'services/deliveryzone/area';
import cityService from 'services/deliveryzone/city';
import countryService from 'services/deliveryzone/country';
import regionService from 'services/deliveryzone/region';
import { useState } from 'react';
import { RefetchSearch } from 'components/refetch-search';
import { useTranslation } from 'react-i18next';

const DeliverymanAddress = ({ form }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});
  const { country, region, city } = formData;

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
        key: item?.id,
      })),
    );
  }
  async function fetchCountry(search) {
    const params = {
      search,
      status: 1,
      perPage: 10,
      region_id: region?.value,
    };
    return countryService.get(params).then(({ data }) =>
      data.map((item) => ({
        label: item.translation.title || 'no name',
        value: item.id,
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
        label: item.translation.title || 'no name',
        value: item.id,
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

  return (
    <>
      <Col span={12}>
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
            placeholder={t('select.region')}
            autoComplete={'none'}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
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
            placeholder={t('select.country')}
            autoComplete={'none'}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
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
            placeholder={t('select.city')}
            autoComplete={'none'}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
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
            placeholder={t('select.area')}
          />
        </Form.Item>
      </Col>
    </>
  );
};

export default DeliverymanAddress;
