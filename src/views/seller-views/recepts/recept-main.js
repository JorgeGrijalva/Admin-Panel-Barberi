import React from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';
import MediaUpload from '../../../components/upload';
import sellerCategory from '../../../services/seller/category';
import { AsyncSelect } from '../../../components/async-select';

const { TextArea } = Input;

const ReceptMain = ({ next, image, setImage }) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  function fetchCategory() {
    return sellerCategory.getAll({ active: 1, type: 'receipt' }).then((res) => {
      return res.data.map((category) => ({
        label: category.translation.title,
        value: category.id,
      }));
    });
  }

  return (
    <>
      <Row gutter={12}>
        <Col span={12}>
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
        <Col span={12}>
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
            <AsyncSelect fetchOptions={fetchCategory} debounceTimeout={200} />
          </Form.Item>
        </Col>
        <Col span={12}>
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
                    } else if (value && value?.trim().length < 5) {
                      return Promise.reject(new Error(t('must.be.at.least.5')));
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
              'images',
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
