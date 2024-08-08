import { Button, Card, Col, Form, Row } from 'antd';
import { DebounceSelect } from 'components/search';
import restCountryService from 'services/rest/country';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import restCityService from 'services/rest/city';
import settingService from 'services/settings';
import { toast } from 'react-toastify';
import { fetchSettings as getSettings } from 'redux/slices/globalSettings';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

const GeneralSettingsDefaultCountry = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const [selectedCountry, setSelectedCountry] = useState(
    activeMenu.data?.country || null,
  );
  const [loadingBtn, setLoadingBtn] = useState(false);

  const extractOptions = (data) => {
    return data?.map((item) => ({
      label: item?.translation?.title,
      value: item?.id,
      key: item?.id,
    }));
  };
  const fetchCountries = async (search) => {
    const params = {
      perPage: 20,
      page: 1,
      search: search?.length ? search : undefined,
      has_price: 1,
    };
    return restCountryService.get(params).then((res) =>
      res?.data?.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: `${item?.id},${item?.region_id}`,
      })),
    );
  };
  const fetchCities = async (search) => {
    const params = {
      perPage: 20,
      page: 1,
      search: search?.length ? search : undefined,
      country_id: selectedCountry?.value,
      has_price: 1,
    };
    return restCityService.get(params).then((res) => extractOptions(res?.data));
  };
  const onFinish = (values) => {
    const body = {
      default_region_id: values?.country?.key?.split(',')?.[1],
      default_country_id: values?.country?.value,
      default_country_title: values?.country?.label,
      default_city_id: values?.city?.value,
      default_city_title: values?.city?.label,
    };
    setLoadingBtn(true);
    settingService
      .update(body)
      .then(() => {
        toast.success(t('successfully.updated'));
        dispatch(getSettings());
      })
      .finally(() => setLoadingBtn(false));
  };
  return (
    <Card>
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{ ...activeMenu.data }}
      >
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name='country'
              label={t('country')}
              rules={[{ required: true, message: t('required') }]}
            >
              <DebounceSelect
                fetchOptions={fetchCountries}
                labelInValue={true}
                allowClear={false}
                onSelect={(value) => {
                  setSelectedCountry(value);
                  form.setFieldsValue({ city: null });
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='city'
              label={t('city')}
              rules={[{ required: true, message: t('required') }]}
            >
              <DebounceSelect
                fetchOptions={fetchCities}
                labelInValue={true}
                allowClear={false}
                disabled={!selectedCountry?.value}
                refetchOptions={true}
              />
            </Form.Item>
          </Col>
        </Row>
        <Button
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
        >
          {t('save')}
        </Button>
      </Form>
    </Card>
  );
};

export default GeneralSettingsDefaultCountry;
