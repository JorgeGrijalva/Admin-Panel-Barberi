import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, InputNumber, Row, Switch } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import productService from '../../../services/seller/product';
import { replaceMenu, setMenuData } from '../../../redux/slices/menu';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import unitService from '../../../services/seller/unit';
import TextArea from 'antd/lib/input/TextArea';
import { AsyncSelect } from '../../../components/async-select';

const ProductsIndex = ({ next, action_type = '' }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { myShop: shop } = useSelector((state) => state.myShop, shallowEqual);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(
        setMenuData({ activeMenu, data: { ...activeMenu.data, ...data } })
      );
    };
  }, []);

  const onFinish = (values) => {
    setLoadingBtn(true);
    const params = {
      ...values,
      active: Number(values.active),
      shop_id: shop.id,
      unit_id: values.unit?.value,
      shop: undefined,
      addon: Number(1),
    };

    if (action_type === 'edit') {
      productUpdate(values, params);
    } else {
      productCreate(values, params);
    }
  };

  function productCreate(values, params) {
    productService
      .create(params)
      .then(({ data }) => {
        dispatch(
          replaceMenu({
            id: `addons-${data.uuid}`,
            url: `seller/addon/${data.uuid}`,
            name: t('add.addons'),
            data: values,
            refetch: false,
          })
        );
        navigate(`/seller/addon/${data.uuid}?step=1`);
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  }

  function productUpdate(values, params) {
    productService
      .update(uuid, params)
      .then(() => {
        dispatch(
          setMenuData({
            activeMenu,
            data: values,
          })
        );
        next();
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  }

  function fetchUnits(search) {
    const params = {
      search,
      active: 1,
    };
    return unitService.getAll(params).then(({ data }) => formatUnits(data));
  }

  function formatUnits(data) {
    return data.map((item) => ({
      label: item.translation?.title,
      value: item.id,
    }));
  }

  return (
    <Form
      layout='vertical'
      form={form}
      initialValues={{ active: true, ...activeMenu.data }}
      onFinish={onFinish}
      className={'addon-menu'}
    >
      <Row gutter={12}>
        <Col xs={24} sm={24} md={16}>
          <Card title={t('basic.info')}>
            {languages.map((item) => (
              <Form.Item
                key={'name' + item.id}
                label={t('name')}
                name={`title[${item.locale}]`}
                rules={[
                  {
                    validator(_, value) {
                      if (!value && item?.locale === defaultLang) {
                        return Promise.reject(new Error(t('required')));
                      } else if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value && value?.trim().length < 2) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.2'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                hidden={item.locale !== defaultLang}
              >
                <Input />
              </Form.Item>
            ))}
            {languages.map((item) => (
              <Form.Item
                key={'description' + item.id}
                label={t('description')}
                name={`description[${item.locale}]`}
                rules={[
                  {
                    validator(_, value) {
                      if (!value && item?.locale === defaultLang) {
                        return Promise.reject(new Error(t('required')));
                      } else if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value && value?.trim().length < 5) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.5'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                hidden={item.locale !== defaultLang}
              >
                <TextArea rows={4} span={4} />
              </Form.Item>
            ))}
          </Card>
          <Card title={t('price')}>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  label={t('min.qty')}
                  name='min_qty'
                  rules={[
                    { required: true, message: t('required') },
                    {
                      type: 'number',
                      min: 0,
                      message: t('must.be.positive'),
                    },
                  ]}
                >
                  <InputNumber className='w-100' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('max.qty')}
                  name='max_qty'
                  rules={[
                    { required: true, message: t('required') },
                    {
                      type: 'number',
                      min: 0,
                      message: t('must.be.positive'),
                    },
                  ]}
                >
                  <InputNumber className='w-100' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('tax')}
                  name='tax'
                  rules={[
                    { required: true, message: t('required') },
                    {
                      type: 'number',
                      min: 0,
                      max: 100,
                      message: t('must.be.between.0.and.100'),
                    },
                  ]}
                >
                  <InputNumber className='w-100' addonAfter='%' />
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
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card title={t('addition')}>
            <Form.Item
              label={t('unit')}
              name='unit'
              rules={[{ required: true, message: t('required') }]}
            >
              <AsyncSelect
                style={{ width: '100%' }}
                fetchOptions={fetchUnits}
              />
            </Form.Item>

          </Card>
        </Col>
      </Row>

      <Button type='primary' htmlType='submit' loading={loadingBtn}>
        {t('next')}
      </Button>
    </Form>
  );
};

export default ProductsIndex;
