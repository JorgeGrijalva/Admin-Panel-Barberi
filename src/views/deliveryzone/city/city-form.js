import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, Switch, Modal, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import LanguageList from 'components/language-list';
import { shallowEqual, useSelector, useDispatch, batch } from 'react-redux';
import { toast } from 'react-toastify';
import countryService from 'services/deliveryzone/country';
import { useEffect } from 'react';
import { InfiniteSelect } from 'components/infinite-select';
import cityService from 'services/deliveryzone/city';
import regionService from 'services/deliveryzone/region';
import { fetchCity } from 'redux/slices/deliveryzone/city';

export default function CityForm({ visible, setVisible, id, setId }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );

  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleClose = () => {
    setData(null);
    setVisible(false);
    form.resetFields();
    setId(null);
  };

  const addCountry = (values) => {
    cityService
      .create(values)
      .then(() => {
        toast.success(t('successfully.added'));
        batch(() => {
          dispatch(fetchCity({}));
        });
        handleClose();
      })
      .finally(() => setLoadingBtn(false));
  };

  const updateCountry = (values) => {
    cityService
      .update(data.id, values)
      .then(() => {
        toast.success(t('successfully.updated'));
        batch(() => {
          dispatch(fetchCity({}));
        });
        handleClose();
      })
      .finally(() => setLoadingBtn(false));
  };

  const onFinish = (values) => {
    setLoadingBtn(true);
    const paramsData = {
      country_id: values?.country_id?.value,
      region_id: values?.region_id?.value,
      active: values?.active,
      title: {
        ...Object.assign(
          {},
          ...languages?.map((lang) => ({
            [lang?.locale]: values[`title[${lang?.locale}]`],
          })),
        ),
      },
    };
    if (data?.id) updateCountry(paramsData);
    else addCountry(paramsData);
  };

  function getLanguageFields(data) {
    if (!data?.translations) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item?.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.title,
    }));
    return Object.assign({}, ...result);
  }

  const fetchCountry = ({ search, page }) => {
    return countryService.get({ search: !!search?.length ? search : undefined, page }).then((res) => {
      return res.data.map((country) => ({
        label: country?.translation?.title,
        value: country.id,
      }));
    });
  };
  const fetchRegion = ({ search, page }) => {
    return regionService.get({ search: !!search?.length ? search : undefined, page }).then((res) => {
      return res.data.map((region) => ({
        label: region?.translation?.title,
        value: region?.id,
      }));
    });
  };
  useEffect(() => {
    if (id) {
      setLoading(true);
      cityService
        .show(id)
        .then(({ data }) => {
          setData(data);
          form.setFieldsValue({
            active: data?.active,
            country_id: {
              label: data?.country?.translation?.title,
              value: data?.country?.id,
            },
            region_id: {
              label: data?.region?.translation?.title,
              value: data?.region?.id,
            },
            ...getLanguageFields(data),
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <Modal
      visible={visible}
      onCancel={handleClose}
      onOk={handleClose}
      footer={null}
      loading={loading}
      title={t('add.city')}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout='vertical'
        initialValues={{ active: true }}
      >
        <Spin spinning={loading}>
          <Row gutter={24}>
            <Col span={24}>
              <LanguageList />
            </Col>
            <Col span={24}>
              {languages.map((item) => (
                <Form.Item
                  key={'title' + item.id}
                  label={t('title')}
                  name={`title[${item.locale}]`}
                  hidden={item.locale !== defaultLang}
                  rules={[
                    {
                      validator(_, value) {
                        if (!value && item?.locale === defaultLang) {
                          return Promise.reject(new Error(t('required')));
                        } else if (value && value?.trim() === '') {
                          return Promise.reject(new Error(t('no.empty.space')));
                        } else if (value && value?.trim().length < 5) {
                          return Promise.reject(
                            new Error(t('must.be.at.least.5')),
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              ))}
            </Col>
            <Col span={24}>
              <Form.Item
                name='region_id'
                label={t('region_id')}
                rules={[{ required: true, message: t('required') }]}
              >
                <InfiniteSelect fetchOptions={fetchRegion} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='country_id'
                label={t('country_id')}
                rules={[{ required: true, message: t('required') }]}
              >
                <InfiniteSelect fetchOptions={fetchCountry} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label={t('active')}
                name='active'
                valuePropName='checked'
              >
                <Switch defaultChecked />
              </Form.Item>
            </Col>
          </Row>
        </Spin>
        <Button type='primary' htmlType='submit' loading={loadingBtn}>
          {t('submit')}
        </Button>
      </Form>
    </Modal>
  );
}
