import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, InputNumber, Row, Switch } from 'antd';
import { DebounceSelect } from 'components/search';
import shopService from 'services/restaurant';
import brandService from 'services/brand';
import categoryService from 'services/category';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import productService from 'services/product';
import { addMenu, replaceMenu, setMenuData } from 'redux/slices/menu';
import unitService from 'services/unit';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MediaUpload from 'components/upload';
import TextArea from 'antd/lib/input/TextArea';
import { RefetchSearch } from 'components/refetch-search';
import { PlusOutlined } from '@ant-design/icons';
import { AsyncTreeSelect } from 'components/async-tree-select-category';
import VideoUploaderWithModal from 'components/video-uploader';

const ProductsIndex = ({ next, action_type = '', isRequest }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const [mediaList, setMediaList] = useState(
    activeMenu?.data?.initialMediaFile || { images: [], previews: [] },
  );
  const [fileList, setFileList] = useState(
    activeMenu.data?.images?.filter((item) => !item.isVideo) || [],
  );
  const [loadingBtn, setLoadingBtn] = useState(false);

  const randomNumbersLength = 6;

  useEffect(() => {
    const data = form.getFieldsValue(true);
    dispatch(
      setMenuData({ activeMenu, data: { ...activeMenu.data, ...data } }),
    );
  }, []);

  async function fetchUserShopList(search) {
    const params = { search, active: 1 };
    return shopService.get(params).then((res) =>
      res.data.map((item) => ({
        label: item?.translation?.title || t('no.name'),
        value: item.id,
        key: item.id,
      })),
    );
  }

  async function fetchUserBrandList(search) {
    const params = { perPage: 10, type: 'main', search, active: 1 };
    return brandService.getAll(params).then((res) =>
      res.data.map((item) => ({
        label: item.title,
        value: item.id,
        key: item.id,
      })),
    );
  }

  async function fetchUserCategoryList(search) {
    const params = { perPage: 100, type: 'main', search };
    return categoryService.getAll(params).then((res) =>
      res.data.map((item) => ({
        label: item?.translation?.title || '',
        value: item?.id,
        key: item.id,
        type: 'main',
        disabled: item.children?.length,
        children: item.children?.map((el) => ({
          label: el.translation?.title,
          value: el.id,
          key: el.id,
          type: 'sub_main',
          disabled: el.children?.length,
          children: el.children?.map((three) => ({
            label: three.translation?.title,
            value: three.id,
            key: three.id,
            type: 'child',
          })),
        })),
      })),
    );
  }

  const onFinish = (values) => {
    setLoadingBtn(true);
    const params = {
      ...values,
      digital: values.digital ? 1 : 0,
      active: Number(values.active),
      brand_id: values.brand?.value,
      category_id: values.category?.value || values.category,
      shop_id: values.shop?.value,
      unit_id: values.unit?.value,
      images: undefined,
      brand: undefined,
      category: undefined,
      shop: undefined,
      unit: undefined,
      tax: values.tax || 0,
      ...Object.assign(
        {},
        ...[...mediaList?.images, ...fileList].map((item, index) => ({
          [`images[${index}]`]: item.name,
        })),
      ),
      ...Object.assign(
        {},
        ...mediaList?.previews?.map((item, index) => ({
          [`previews[${index}]`]: item.name,
        })),
      ),
    };

    if (isRequest) {
      dispatch(
        setMenuData({
          activeMenu,
          data: {
            ...activeMenu.data,
            ...params,
            images: fileList,
            brand: values.brand,
            category: values.category,
            shop: values.shop,
            unit: values.unit,
            tax: values.tax || 0,
            title: {
              ...Object.assign(
                {},
                ...languages.map((lang) => ({
                  [lang.locale]: values[`title[${lang.locale}]`],
                })),
              ),
            },
            description: {
              ...Object.assign(
                {},
                ...languages.map((lang) => ({
                  [lang.locale]: values[`description[${lang.locale}]`],
                })),
              ),
            },
          },
        }),
      );
      next();
      return;
    }

    if (action_type === 'edit') {
      productUpdate(values, params);
    } else {
      productCreate(values, params);
    }
  };

  const createMediaFile = (items) => {
    const mediaObject = { images: [], previews: [] };
    const previews = items
      .filter((item) => item.preview)
      .map((item) => ({
        uid: item.id,
        name: item.preview,
        url: item.preview,
      }));
    const videos = items
      .filter((item) => item.preview)
      .map((item) => ({
        uid: item.id,
        name: item.path,
        url: item.path,
        isVideo: true,
      }));
    mediaObject.previews = previews;
    mediaObject.images = videos;

    return mediaObject;
  };

  function productCreate(values, params) {
    productService
      .create(params)
      .then(({ data }) => {
        dispatch(
          replaceMenu({
            id: `product-${data.uuid}`,
            url: `product/${data.uuid}`,
            name: t('add.product'),
            data: {
              ...values,
              ...data,
              initialMediaFile: createMediaFile(data.galleries),
            },
            refetch: false,
          }),
        );
        navigate(`/product/${data.uuid}/?step=1`);
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
            data: {
              ...values,
              ...activeMenu?.data,
              digital: Boolean(params?.digital),
            },
          }),
        );
        next();
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  }

  function fetchUnits(search) {
    const params = {
      perPage: 10,
      page: 1,
      active: 1,
      search,
    };
    return unitService.getAll(params).then(({ data }) => {
      return data?.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      }));
    });
  }

  useEffect(() => {
    fetchUnits();

    return () => {
      const data = form.getFieldsValue(true);
      dispatch(
        setMenuData({ activeMenu, data: { ...activeMenu.data, ...data } }),
      );
    };
  }, []);

  const goToAddCategory = () => {
    dispatch(
      addMenu({
        id: 'category-add',
        url: 'category/add',
        name: t('add.category'),
      }),
    );
    navigate('/category/add');
  };
  const goToUnit = () => {
    dispatch(
      addMenu({
        id: 'unit-add',
        url: 'unit/add',
        name: t('add.unit'),
      }),
    );
    navigate('/unit/add');
  };

  return (
    <Form
      layout='vertical'
      form={form}
      initialValues={{
        active: true,
        vegetarian: true,
        min_qty: 1,
        max_qty: 1,
        tax: 0,
        interval: 1,
        age_limit: 12,
        digital: false,
        ...activeMenu.data,
      }}
      onFinish={onFinish}
    >
      <Row gutter={12}>
        <Col span={16}>
          <Row>
            <Col span={24}>
              <Card title={t('basic.info')}>
                <Row>
                  <Col span={24}>
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
                                return Promise.reject(
                                  new Error(t('no.empty.space')),
                                );
                              } else if (value && value?.trim().length < 2) {
                                return Promise.reject(
                                  new Error(t('must.be.at.least.2')),
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
                  </Col>
                  <Col span={24}>
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
                                return Promise.reject(
                                  new Error(t('no.empty.space')),
                                );
                              } else if (value && value?.trim().length < 5) {
                                return Promise.reject(
                                  new Error(t('must.be.at.least.5')),
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                        hidden={item.locale !== defaultLang}
                      >
                        <TextArea rows={3} />
                      </Form.Item>
                    ))}
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={24}>
              <Card title={t('pricing')}>
                <Row gutter={12}>
                  <Col span={6}>
                    <Form.Item
                      label={t('min.qty')}
                      name='min_qty'
                      rules={[{ required: true, message: t('required') }]}
                    >
                      <InputNumber min={1} className='w-100' />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label={t('max.qty')}
                      name='max_qty'
                      rules={[{ required: true, message: t('required') }]}
                    >
                      <InputNumber min={1} className='w-100' />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label={t('tax')}
                      name='tax'
                      rules={[
                        {
                          validator(_, value) {
                            if (value && (value < 0 || value > 100)) {
                              return Promise.reject(
                                new Error(t('must.be.between.0.and.100')),
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <InputNumber className='w-100' addonAfter='%' />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label={t('interval.unit')}
                      name='interval'
                      rules={[
                        { required: true, message: t('required') },
                        {
                          type: 'number',
                          min: 0,
                          message: t('must.be.positive'),
                        },
                      ]}
                      help={error?.interval ? error.interval[0] : null}
                      validateStatus={error?.interval ? 'error' : 'success'}
                    >
                      <InputNumber className='w-100' />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={24}>
              <Card title={t('additions')}>
                <Row gutter={12}>
                  <Col span={24}>
                    <Form.Item
                      label={t('age.limit')}
                      name='age_limit'
                      rules={[{ required: true, message: t('required') }]}
                    >
                      <InputNumber min={0} className='w-100' />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label={t('active')}
                      name='active'
                      valuePropName='checked'
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label={t('digital')}
                      name='digital'
                      valuePropName='checked'
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={24}>
              <Card title={t('video')}>
                <VideoUploaderWithModal
                  form={form}
                  mediaList={mediaList}
                  setMediaList={setMediaList}
                />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row>
            <Col span={24}>
              <Card title={t('organization')}>
                <Row>
                  {!isRequest && (
                    <Col span={24}>
                      <Form.Item
                        label={t('shop/restaurant')}
                        name='shop'
                        rules={[{ required: true, message: t('required') }]}
                      >
                        <RefetchSearch
                          fetchOptions={fetchUserShopList}
                          onChange={() =>
                            form.setFieldsValue({ category: undefined })
                          }
                          // disabled={action_type === 'edit'}
                        />
                      </Form.Item>
                    </Col>
                  )}
                  <Col span={24}>
                    <Form.Item
                      label={t('category')}
                      name='category'
                      rules={[{ required: true, message: t('required') }]}
                    >
                      <AsyncTreeSelect
                        refetch
                        fetchOptions={fetchUserCategoryList}
                        dropdownRender={(menu) => (
                          <>
                            {menu}
                            <div className='p-1'>
                              <Button
                                icon={<PlusOutlined />}
                                className='w-100'
                                onClick={goToAddCategory}
                              >
                                {t('add.category')}
                              </Button>
                            </div>
                          </>
                        )}
                        allowClear
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label={t('brand')} name='brand'>
                      <DebounceSelect fetchOptions={fetchUserBrandList} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={t('unit')}
                      name='unit'
                      rules={[{ required: true, message: t('required') }]}
                    >
                      <DebounceSelect
                        fetchOptions={fetchUnits}
                        dropdownRender={(menu) => (
                          <>
                            {menu}
                            <div className='p-1'>
                              <Button
                                icon={<PlusOutlined />}
                                className='w-100'
                                onClick={goToUnit}
                              >
                                {t('add.unit')}
                              </Button>
                            </div>
                          </>
                        )}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={24}>
              <Card title={t('media')}>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      name='images'
                      rules={[
                        {
                          validator() {
                            if (fileList.length === 0) {
                              return Promise.reject(new Error(t('required')));
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <MediaUpload
                        type='products'
                        imageList={fileList}
                        setImageList={setFileList}
                        form={form}
                        multiple={true}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Button type='primary' htmlType='submit' loading={loadingBtn}>
        {t('next')}
      </Button>
    </Form>
  );
};

export default ProductsIndex;
