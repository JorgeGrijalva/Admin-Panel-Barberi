import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, Input, Row, Space, Switch } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu, setMenuData } from '../../redux/slices/menu';
import { fetchBlogs } from '../../redux/slices/blog';
import blogService from '../../services/blog';
import LanguageList from '../../components/language-list';
import { useTranslation } from 'react-i18next';
import CkeEditor from '../../components/ckeEditor';
import MediaUpload from '../../components/upload';

export default function BlogAdd() {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [image, setImage] = useState(
    activeMenu.data?.image ? [activeMenu.data?.image] : []
  );
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  function getTranslationFields(values, field = 'title') {
    const list = languages.map((item) => ({
      [item.locale]: values[`${field}[${item.locale}]`],
    }));
    return Object.assign({}, ...list);
  }

  const onFinish = (values) => {
    const body = {
      type: 'blog',
      active: values.active ? 1 : 0,
      images: image.length ? image.map((item) => item.name) : undefined,
      title: getTranslationFields(values),
      description: getTranslationFields(values, 'description'),
      short_desc: getTranslationFields(values, 'short_desc'),
    };
    setLoadingBtn(true);
    const nextUrl = 'blogs';
    blogService
      .create(body)
      .then(() => {
        toast.success(t('successfully.created'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(fetchBlogs({}));
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Card title={t('add.blog')} extra={<LanguageList />}>
      <Form
        name='blog-add'
        layout='vertical'
        onFinish={onFinish}
        form={form}
        initialValues={{
          active: true,
          ...activeMenu.data,
        }}
      >
        <Row gutter={12}>
          <Col span={12}>
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
                ]}
                hidden={item.locale !== defaultLang}
              >
                <Input />
              </Form.Item>
            ))}
          </Col>
          <Col>
            <Form.Item
              label={t('image')}
              rules={[
                {
                  required: !image.length,
                  message: t('required'),
                },
              ]}
            >
              <MediaUpload
                type='blogs'
                imageList={image}
                setImageList={setImage}
                form={form}
                length='1'
                multiple={false}
              />
            </Form.Item>
          </Col>
          <Col>
            <div className='col-md-12 col-sm-6'>
              <Form.Item
                label={t('active')}
                name='active'
                valuePropName='checked'
              >
                <Switch />
              </Form.Item>
            </div>
          </Col>
          <Col span={12}>
            {languages.map((item) => (
              <Form.Item
                key={'short_desc' + item.locale}
                label={t('short.description')}
                name={`short_desc[${item.locale}]`}
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
            <CkeEditor languages={languages} form={form} lang={defaultLang} />
          </Col>
        </Row>
        <Space>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('save')}
          </Button>
        </Space>
      </Form>
    </Card>
  );
}
