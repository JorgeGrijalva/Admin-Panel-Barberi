import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, InputNumber, Row, Switch } from 'antd';
import { DebounceSelect } from 'components/search';
import brandService from 'services/rest/brand';
import categoryService from 'services/rest/category';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import productService from 'services/seller/product';
import { addMenu, replaceMenu, setMenuData } from 'redux/slices/menu';
import unitService from 'services/seller/unit';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MediaUpload from 'components/upload';
import TextArea from 'antd/lib/input/TextArea';
import { DeploymentUnitOutlined, PlusOutlined } from '@ant-design/icons';
import { AsyncTreeSelect } from 'components/async-tree-select-category';
import VideoUploaderWithModal from 'components/video-uploader';
import generateRandomNumbers from 'helpers/generateRandomNumbers';
import getTranslationFields from 'helpers/getTranslationFields';

const ProductsIndex = ({ next, action_type = '', isRequest }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const [mediaList, setMediaList] = useState(
    activeMenu?.data?.initialMediaFile || { images: [], previews: [] },
  );

  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const [fileList, setFileList] = useState(
    activeMenu.data?.images?.filter((item) => !item.isVideo) || [],
  );

  const [loadingBtn, setLoadingBtn] = useState(false);

  const randomNumbersLength = 6;

  const { settings } = useSelector((state) => state.globalSettings);

  function fetchUserBrandList(username) {
    const params = {
      search: username,
    };
    return brandService.getAll(params).then((res) =>
      res.data.map((item) => ({
        label: item?.title,
        value: item?.id,
      })),
    );
  }

  function fetchUserCategoryList(username) {
    const params = {
      search: username ? username : null,
      type: 'main',
    };
    return categoryService.paginateSelect(params).then((res) =>
      res.data.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
        type: 'main',
        disabled: item?.children?.length,
        children: item?.children?.map((el) => ({
          label: el?.translation?.title,
          value: el?.id,
          key: el?.id,
          type: 'sub_main',
          disabled: el?.children?.length,
          children: el?.children?.map((three) => ({
            label: three?.translation?.title,
            value: three?.id,
            key: three?.id,
            type: 'child',
          })),
        })),
      })),
    );
  }

  function fetchUnits(search) {
    const params = {
      perPage: 10,
      page: 1,
      active: 1,
      search,
    };
    return unitService.getAll(params).then(({ data }) => formatUnits(data));
  }

  const onFinish = (values) => {
    setLoadingBtn(true);
    const params = {
      // ...values,
      // basic info
      title: getTranslationFields(languages, values),
      description: getTranslationFields(languages, values, 'description'),
      // pricing
      min_qty: values?.min_qty || 0,
      max_qty: values?.max_qty || 0,
      tax: values?.tax || 0,
      // additions
      age_limit: values?.age_limit || 0,
      active: Number(!!values?.active),
      digital: Number(!!values?.digital),
      // organization
      category_id: values?.category?.value || values?.category,
      brand_id: values?.brand?.value || values?.brand,
      unit_id: values?.unit?.value || values?.unit,
      interval: values?.interval || 1,
      sku: values?.sku,
      // media
      images: [...mediaList?.images, ...fileList]?.map(
        (item, index) => item?.name,
      ),
      previews: mediaList?.previews?.map((item) => item?.name),
    };

    if (isRequest) {
      dispatch(
        setMenuData({
          activeMenu,
          data: {
            ...activeMenu.data,
            ...values,
            active: Number(values.active),
            brand_id: values.brand?.value,
            category_id: values.category?.value || values.category,
            shop_id: values.shop?.value,
            unit_id: values.unit?.value,
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
            ...Object.assign(
              {},
              ...fileList.map((item, index) => ({
                [`images[${index}]`]: item.name,
              })),
            ),
          },
        }),
      );
      next();
      return;
    }

    let isMainInfoChanged = false;
    Object.entries(values).forEach(([key, value]) => {
      if (key.startsWith('title') || key.startsWith('description')) {
        if (activeMenu.data && activeMenu.data[key] !== value) {
          isMainInfoChanged = true;
        }
      }
      if (key === 'category') {
        if (activeMenu.data?.category?.value !== value?.value) {
          isMainInfoChanged = true;
        }
      }
      if (key === 'brand') {
        if (activeMenu.data?.brand?.value !== value?.value) {
          isMainInfoChanged = true;
        }
      }
      const changedFile = fileList?.find((file) => file.status === 'done');
      if (
        !!changedFile ||
        fileList?.length !== activeMenu.data?.images?.length
      ) {
        isMainInfoChanged = true;
      }
    });
    if (action_type === 'edit') {
      const tempParams = { ...params };
      tempParams.title = {
        ...Object.assign(
          {},
          ...languages.map((lang) => ({
            [lang.locale]: values[`title[${lang.locale}]`],
          })),
        ),
      };
      tempParams.description = {
        ...Object.assign(
          {},
          ...languages.map((lang) => ({
            [lang.locale]: values[`description[${lang.locale}]`],
          })),
        ),
      };
      setMenuData({
        activeMenu,
        data: tempParams,
      });
      if (isMainInfoChanged && settings?.product_auto_approve === '0') {
        saveRequest(tempParams);
        return;
      }
      productUpdate(values, params);
    } else {
      productCreate(values, params);
    }
  };

  function saveRequest(values) {
    navigate(`/seller/product/${uuid}?step=1`, { state: values });
  }

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
            url: `seller/product/${data.uuid}`,
            name: t('add.product'),
            data: {
              ...values,
              initialMediaFile: createMediaFile(data.galleries),
            },
            refetch: false,
          }),
        );
        navigate(`/seller/product/${data.uuid}?step=1`, {
          state: { create: true },
        });
      })
      .finally(() => setLoadingBtn(false));
  }

  function productUpdate(values, params) {
    params.product_id = activeMenu.data?.product_id;
    productService
      .update(uuid, params)
      .then(() => {
        dispatch(
          setMenuData({
            activeMenu,
            data: { ...params, ...activeMenu?.data },
          }),
        );
        next();
      })
      .finally(() => setLoadingBtn(false));
  }

  function formatUnits(data) {
    return data.map((item) => ({
      label: item?.translation?.title,
      value: item?.id,
      key: item?.id,
    }));
  }

  useEffect(() => {
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
        url: `seller/category/add`,
        id: 'seller/category/add',
        name: t('edit.category'),
      }),
    );
    navigate(`/seller/category/add`);
  };

  const handleGenerateRandomNumbers = () => {
    const result = generateRandomNumbers(6);
    form.setFieldsValue({ sku: result });
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
        sku:
          activeMenu?.data?.stocks?.[0]?.sku ??
          generateRandomNumbers(randomNumbersLength),
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
                    {languages.map((item) => (
                      <Form.Item
                        key={'description' + item.id}
                        label={t('description')}
                        name={`description[${item.locale}]`}
                        rules={[
                          {
                            required: item.locale === defaultLang,
                            message: t('required'),
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
                  <Col span={8}>
                    <Form.Item
                      label={t('min.qty')}
                      name='min_qty'
                      rules={[{ required: true, message: t('required') }]}
                    >
                      <InputNumber min={1} className='w-100' />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label={t('max.qty')}
                      name='max_qty'
                      rules={[{ required: true, message: t('required') }]}
                    >
                      <InputNumber min={1} className='w-100' />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label={t('tax')} name='tax'>
                      <InputNumber min={0} className='w-100' addonAfter='%' />
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
                      <InputNumber min={1} className='w-100' />
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
                  <Col span={24}>
                    <Form.Item
                      label={t('category')}
                      name='category'
                      rules={[{ required: true, message: t('required') }]}
                    >
                      <AsyncTreeSelect
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
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={t('brand')}
                      name='brand'
                      rules={[
                        {
                          required: false,
                          message: t('required'),
                        },
                      ]}
                    >
                      <DebounceSelect fetchOptions={fetchUserBrandList} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={t('unit')}
                      name='unit'
                      rules={[{ required: true, message: t('required') }]}
                    >
                      <DebounceSelect fetchOptions={fetchUnits} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={t('interval')}
                      name='interval'
                      rules={[
                        { required: true, message: t('required') },
                        {
                          type: 'number',
                          min: 1,
                          message: t('should.be.more.than.1'),
                        },
                      ]}
                    >
                      <InputNumber className='w-100' />
                    </Form.Item>
                  </Col>
                  <Col span={20} style={{ marginRight: '10px' }}>
                    <Form.Item
                      label={t('sku')}
                      name='sku'
                      rules={[{ required: true, message: t('required') }]}
                    >
                      <Input className='w-100' />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item label={' '} name='sku'>
                      <Button
                        icon={<DeploymentUnitOutlined />}
                        onClick={handleGenerateRandomNumbers}
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
                    <Form.Item name='images'>
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
