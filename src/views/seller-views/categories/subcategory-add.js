import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, Switch } from 'antd';
import { toast } from 'react-toastify';
import TextArea from 'antd/es/input/TextArea';
import { shallowEqual, useSelector } from 'react-redux';
import categoryService from 'services/seller/category';
import { useTranslation } from 'react-i18next';
import MediaUpload from 'components/upload';

const SubcategoryAdd = ({ parent = {}, setId, setIsRefetch }) => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const [image, setImage] = useState(
    activeMenu.data?.image ? [activeMenu.data?.image] : []
  );
  const [form] = Form.useForm();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [error, setError] = useState(null);

  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, []);

  const onFinish = (values) => {
    setLoadingBtn(true);

    const body = {
      ...values,
      type: parent?.type === 'main' ? 'sub_main' : 'child',
      active: values.active ? 1 : 0,
      keywords: values.keywords.join(','),
      parent_id: values.parent_id?.value,
      'images[0]': image[0]?.name,
    };
    categoryService
      .create(body)
      .then(() => {
        toast.success(t('successfully.created'));
        setId(null);
        form.resetFields();
        setIsRefetch(true);
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  };
  if (!parent?.id) return '';

  return (
    <Form
      name='basic'
      layout='vertical'
      onFinish={onFinish}
      initialValues={{
        active: true,
        ...parent,
      }}
      form={form}
    >
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            label={t('parent.category')}
            name='parent_id'
            rules={[{ required: false, message: t('required') }]}
          >
            <Select disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          {languages.map((item, index) => (
            <Form.Item
              key={item.title + index}
              label={t('name')}
              name={`title[${item.locale}]`}
              help={
                error
                  ? error[`title.${defaultLang}`]
                    ? error[`title.${defaultLang}`][0]
                    : null
                  : null
              }
              validateStatus={error ? 'error' : 'success'}
              rules={[
                {
                  required: true,
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
              <Input placeholder={t('name')} />
            </Form.Item>
          ))}
        </Col>

        <Col span={24}>
          {languages.map((item, index) => (
            <Form.Item
              key={item.locale + index}
              label={t('description')}
              name={`description[${item.locale}]`}
              rules={[
                {
                  required: true,
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
              <TextArea rows={4} />
            </Form.Item>
          ))}
        </Col>

        <Col span={24}>
          <Form.Item
            label={t('keywords')}
            name='keywords'
            rules={[
              {
                required: true,
                message: t('required'),
              },
            ]}
          >
            <Select mode='tags' style={{ width: '100%' }}></Select>
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
              type='categories'
              imageList={image}
              setImageList={setImage}
              form={form}
              multiple={false}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={t('active')} name='active' valuePropName='checked'>
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Button
        type='primary'
        htmlType='submit'
        loading={loadingBtn}
        className='w-100'
      >
        {t('submit')}
      </Button>
    </Form>
  );
};
export default SubcategoryAdd;
