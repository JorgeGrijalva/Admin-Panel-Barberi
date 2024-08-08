import React, { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Switch,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import LanguageList from '../language-list';
import { shallowEqual, useSelector } from 'react-redux';
import TextArea from 'antd/lib/input/TextArea';
import MediaUpload from '../upload';
import categoryService from '../../services/category';

export default function CategoryModal({ visible, handleCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState([]);

  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      ...values,
      type: 'shop',
      active: values.active ? 1 : 0,
      keywords: values.keywords.join(','),
      parent_id: values.parent_id?.value === 0 ? null : values.parent_id?.value,
      'images[0]': image[0]?.name,
    };
    categoryService
      .create(body)
      .then(() => {
        toast.success(t('successfully.created'));
        handleCancel();
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Modal
      title={t('add.client')}
      visible={visible}
      onCancel={handleCancel}
      style={{ minWidth: '60vw' }}
      footer={[
        <Button
          key='ok-button'
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
        >
          {t('save')}
        </Button>,
        <Button key='cancel-button' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Card title={t('add.category')} extra={<LanguageList />}>
        <Form
          name='basic'
          layout='vertical'
          onFinish={onFinish}
          initialValues={{
            parent_id: { title: '---', value: 0, key: 0 },
            active: true,
          }}
          form={form}
        >
          <Row gutter={12}>
            <Col span={12}>
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
                      required: item.locale === defaultLang,
                      message: t('required'),
                    },
                  ]}
                  hidden={item.locale !== defaultLang}
                >
                  <Input placeholder={t('name')} />
                </Form.Item>
              ))}
            </Col>

            <Col span={12}>
              {languages.map((item, index) => (
                <Form.Item
                  key={item.locale + index}
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
                  <TextArea rows={4} />
                </Form.Item>
              ))}
            </Col>

            <Col span={12}>
              <Form.Item
                label={t('keywords')}
                name='keywords'
                rules={[{ required: true, message: t('required') }]}
              >
                <Select mode='tags' style={{ width: '100%' }}></Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t('parent.category')}
                name='parent_id'
                rules={[{ required: true, message: t('required') }]}
                help={
                  error ? (error.parent_id ? error.parent_id[0] : null) : null
                }
                validateStatus={error ? 'error' : 'success'}
              >
                <Select>
                  <Select.Option value={0}>---</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label={t('image')}>
                <MediaUpload
                  type='categories'
                  imageList={image}
                  setImageList={setImage}
                  form={form}
                  multiple={false}
                />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item
                label={t('active')}
                name='active'
                valuePropName='checked'
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Modal>
  );
}
