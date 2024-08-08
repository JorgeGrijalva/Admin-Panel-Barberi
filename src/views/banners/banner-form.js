import React, { useState } from 'react';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { DebounceSelect } from 'components/search';
import MediaUpload from 'components/upload';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import productService from 'services/product';
import VideoUploaderWithModal from 'components/video-uploader';

export default function BannerForm({ form, handleSubmit }) {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );

  //states
  const [image, setImage] = useState(
    activeMenu.data?.img.filter((item) => !item.isVideo) || [],
  );
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [mediaList, setMediaList] = useState(
    activeMenu?.data?.initialMediaFile || { images: [], previews: [] },
  );

  //functions
  function fetchProductsOptions(search) {
    const params = {
      search,
      perPage: 10,
      status: 'published',
    };
    return productService.getAll(params).then((res) => formatProduct(res.data));
  }

  //helper functions
  function formatProduct(data) {
    return data.map((item) => ({
      label: item?.translation?.title,
      value: item.id,
      key: item.id,
    }));
  }

  //submit form
  const onFinish = (values) => {
    setLoadingBtn(true);
    handleSubmit(values, image, mediaList).finally(() => setLoadingBtn(false));
  };
  return (
    <Form
      name='banner-form'
      layout='vertical'
      onFinish={onFinish}
      form={form}
      initialValues={{ clickable: true, ...activeMenu.data }}
      className='d-flex flex-column h-100'
    >
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card title={t('images')} className='h-100'>
                <Form.Item
                  rules={[
                    {
                      required: !image.length,
                      message: t('required'),
                    },
                  ]}
                  label={t('image')}
                  name='images'
                >
                  <MediaUpload
                    type='banners'
                    imageList={image}
                    setImageList={setImage}
                    form={form}
                    length='1'
                    multiple={false}
                  />
                </Form.Item>
              </Card>
            </Col>
            <Col span={24}>
              <Card title={t('video')} className='h-100'>
                <VideoUploaderWithModal
                  name='banners'
                  form={form}
                  mediaList={mediaList}
                  setMediaList={setMediaList}
                />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Card title={t('basic.info')} className='h-100'>
            {languages.map((item) => (
              <Form.Item
                key={'title' + item.locale}
                label={t('title')}
                name={`title[${item.locale}]`}
                rules={[
                  {
                    required: item.locale === defaultLang,
                    message: t('required'),
                  },
                  {
                    validator(_, value) {
                      if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
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
                <Input maxLength={50} />
              </Form.Item>
            ))}
            {languages.map((item) => (
              <Form.Item
                key={'description' + item.locale}
                label={t('description')}
                name={`description[${item.locale}]`}
                rules={[
                  {
                    required: item.locale === defaultLang,
                    message: t('required'),
                  },
                  {
                    validator(_, value) {
                      if (value && value?.trim() === '') {
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
                hidden={item.locale !== defaultLang}
              >
                <Input.TextArea maxLength={150} />
              </Form.Item>
            ))}
            <Form.Item
              label={t('products')}
              name={'products'}
              rules={[{ required: true, message: t('required') }]}
            >
              <DebounceSelect
                mode='multiple'
                fetchOptions={fetchProductsOptions}
                debounceTimeout={200}
              />
            </Form.Item>
          </Card>
        </Col>
        <Col span={24}>
          <div className='d-flex justify-content-end'>
            <div className='pb-5'>
              <Button type='primary' htmlType='submit' loading={loadingBtn}>
                {t('submit')}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Form>
  );
}
