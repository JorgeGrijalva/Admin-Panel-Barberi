import React from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';
import MediaUpload from '../../components/upload';
import shopService from '../../services/restaurant';
import { DebounceSelect } from '../../components/search';
import categoryService from '../../services/category';

const { TextArea } = Input;

const ReceptMain = ({ next, image, setImage, back, setBack }) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  function fetchCategory(search) {
    const params = {
      active: 1,
      type: 'receipt',
      search,
    };
    return categoryService.getAll(params).then((res) => {
      return res.data.map((category) => ({
        label: category.translation.title,
        value: category.id,
      }));
    });
  }

  async function fetchShops(search) {
    const params = { search, status: 'approved' };
    return shopService.getAll(params).then(({ data }) =>
      data.map((item) => ({
        label: item.translation?.title,
        value: item.id,
      }))
    );
  }

  return (
    <>
      <Row gutter={12}>
        <Col span={8}>
          {languages.map((item) => (
            <Form.Item
              key={'name' + item.id}
              label={t('name')}
              name={['title', item.locale]}
              rules={[
                {
                  validator(_, value) {
                    if (!value && item?.locale === defaultLang) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value && value?.trim().length < 2) {
                      return Promise.reject(new Error(t('must.be.at.least.2')));
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
        <Col span={8}>
          <Form.Item
            label={t('shop/restaurant')}
            name='shop_id'
            rules={[
              {
                required: true,
                message: t('required'),
              },
            ]}
          >
            <DebounceSelect
              placeholder={t('select.shop')}
              fetchOptions={fetchShops}
              style={{ minWidth: 150 }}
              allowClear={false}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            key='category_id'
            label={t('category')}
            name='category_id'
            rules={[
              {
                required: true,
                message: t('required'),
              },
            ]}
          >
            <DebounceSelect
              fetchOptions={fetchCategory}
              placeholder={t('select.category')}
              style={{ minWidth: 150 }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          {languages.map((item) => (
            <Form.Item
              key={'description' + item.id}
              label={t('description')}
              name={['description', item.locale]}
              rules={[
                {
                  validator(_, value) {
                    if (!value && item?.locale === defaultLang) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value && value?.trim().length < 2) {
                      return Promise.reject(new Error(t('must.be.at.least.2')));
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
        <Col span={6}>
          <Form.Item
            key='calories'
            label={t('calories')}
            name='calories'
            rules={[
              {
                required: true,
                message: t('required'),
              },
            ]}
          >
            <InputNumber className='w-100' min={0} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            key='servings'
            label={t('servings')}
            name='servings'
            rules={[
              {
                required: true,
                message: t('required'),
              },
            ]}
          >
            <InputNumber className='w-100' min={0} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            key='active_time'
            label={t('active.time')}
            name='active_time'
            rules={[
              {
                required: true,
                message: t('required'),
              },
            ]}
          >
            <InputNumber className='w-100' min={0} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            key='total_time'
            label={t('total.time')}
            name='total_time'
            rules={[
              {
                required: true,
                message: t('required'),
              },
            ]}
          >
            <InputNumber className='w-100' min={0} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('discount.type')}
            name='discount_type'
            rules={[{ required: true, message: t('required') }]}
          >
            <Select
              options={[
                { label: t('fix'), value: 'fix' },
                { label: t('percent'), value: 'percent' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('discount.price')}
            name='discount_price'
            rules={[{ required: true, message: t('required') }]}
          >
            <InputNumber className='w-100' min={0} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={t('background')}
            name='back_img'
            rules={[
              {
                validator(_, value) {
                  if (back?.length === 0) {
                    return Promise.reject(new Error(t('required')));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <MediaUpload
              type='receipts'
              imageList={back}
              setImageList={setBack}
              form={form}
              multiple={false}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('image')}
            name='image'
            rules={[
              {
                validator(_, value) {
                  if (image?.length === 0) {
                    return Promise.reject(new Error(t('required')));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <MediaUpload
              type='receipts'
              imageList={image}
              setImageList={setImage}
              form={form}
              multiple={false}
            />
          </Form.Item>
        </Col>
      </Row>
      <Button
        type='primary'
        htmlType='button'
        onClick={() => {
          form
            .validateFields([
              ['title', defaultLang],
              ['description', defaultLang],
              'calories',
              'servings',
              'active_time',
              'total_time',
              'discount_type',
              'discount_price',
              'category_id',
              'shop_id',
              'back_img',
              'image',
            ])
            .then((value) => {
              next();
            });
        }}
      >
        {t('next')}
      </Button>
    </>
  );
};

export default ReceptMain;
