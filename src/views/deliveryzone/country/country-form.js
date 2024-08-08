import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, Switch, Modal, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import LanguageList from 'components/language-list';
import { shallowEqual, useSelector, useDispatch, batch } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCountry } from 'redux/slices/deliveryzone/country';
import countryService from 'services/deliveryzone/country';
import { useEffect } from 'react';
import { InfiniteSelect } from 'components/infinite-select';
import regionService from 'services/deliveryzone/region';
import MediaUpload from 'components/upload';
import createImage from 'helpers/createImage';

export default function CountryForm({ visible, setVisible, id, setId }) {
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
  const [image, setImage] = useState([]);

  const handleClose = () => {
    setData(null);
    setVisible(false);
    form.resetFields();
    setId(null);
    setImage([]);
  };

  const addCountry = (values) => {
    countryService
      .create({
        images: [values?.images?.[0]?.url],
        active: values.active,
        code: values.code,
        region_id: values?.region_id?.value,
        title: {
          ...Object.assign(
            {},
            ...languages.map((lang) => ({
              [lang.locale]: values[`title[${lang.locale}]`],
            })),
          ),
        },
      })
      .then(() => {
        toast.success(t('successfully.added'));
        batch(() => {
          dispatch(fetchCountry({}));
        });
        handleClose();
      })
      .finally(() => setLoadingBtn(false));
  };

  const updateCountry = (values) => {
    countryService
      .update(data.id, {
        images: [values?.images?.[0]?.url],
        region_id: values?.region_id?.value,
        active: values.active,
        code: values.code,
        title: {
          ...Object.assign(
            {},
            ...languages.map((lang) => ({
              [lang.locale]: values[`title[${lang.locale}]`],
            })),
          ),
        },
      })
      .then(() => {
        toast.success(t('successfully.updated'));
        batch(() => {
          dispatch(fetchCountry({}));
        });
        handleClose();
      })
      .finally(() => setLoadingBtn(false));
  };
  const onFinish = (values) => {
    setLoadingBtn(true);
    if (data?.id) updateCountry(values);
    else addCountry(values);
  };
  function getLanguageFields(data) {
    if (!data?.translations) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.title,
    }));
    return Object.assign({}, ...result);
  }

  const fetchRegion = ({ search, page }) => {
    return regionService
      .get({ search: !!search?.length ? search : undefined, page })
      .then((res) => {
        return res.data.map((region) => ({
          label: region?.translation?.title,
          value: region.id,
        }));
      });
  };
  useEffect(() => {
    if (id) {
      setLoading(true);
      countryService
        .show(id)
        .then(({ data }) => {
          setData(data);
          setImage(data.img ? [createImage(data.img)] : []);
          form.setFieldsValue({
            images: data.img ? [createImage(data.img)] : [],
            active: data?.active,
            code: data?.code,
            region_id: {
              label: data.region.translation.title,
              value: data.region.id,
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
      title={t('add.country')}
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
                  type='countries'
                  imageList={image}
                  setImageList={setImage}
                  form={form}
                  multiple={false}
                />
              </Form.Item>
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
              <Form.Item label={t('code')} name='code'>
                <Input />
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
