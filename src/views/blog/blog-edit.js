import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, Input, Row, Space, Spin, Switch } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  disableRefetch,
  removeFromMenu,
  setMenuData,
} from '../../redux/slices/menu';
import { fetchBlogs } from '../../redux/slices/blog';
import blogService from '../../services/blog';
import LanguageList from '../../components/language-list';
import getTranslationFields from '../../helpers/getTranslationFields';
import createImage from '../../helpers/createImage';
import { useTranslation } from 'react-i18next';
import CkeEditorEdit from '../../components/ckeEditorEdit';
import MediaUpload from '../../components/upload';

export default function BlogEdit() {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { uuid } = useParams();

  const [image, setImage] = useState(
    activeMenu.data?.image ? [activeMenu.data?.image] : []
  );
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const onFinish = (values) => {
    const body = {
      type: 'blog',
      active: values.active ? 1 : 0,
      images: image.length ? image.map((item) => item.name) : undefined,
      title: getTranslationFields(languages, values),
      description: getTranslationFields(languages, values, 'description'),
      short_desc: getTranslationFields(languages, values, 'short_desc'),
    };
    setLoadingBtn(true);
    const nextUrl = 'blogs';
    blogService
      .update(uuid, body)
      .then(() => {
        toast.success(t('successfully.created'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(fetchBlogs({}));
      })
      .finally(() => setLoadingBtn(false));
  };

  function getLanguageFields(data) {
    if (!data) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.title,
      [`description[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.description,
      [`short_desc[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.short_desc,
    }));
    return Object.assign({}, ...result);
  }

  const fetchBlog = (uuid) => {
    setLoading(true);
    blogService
      .getById(uuid)
      .then((res) => {
        let blog = res.data;
        form.setFieldsValue({
          ...blog,
          ...getLanguageFields(blog),
          image: [createImage(blog.img)],
        });
        setImage([createImage(blog.img)]);
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchBlog(uuid);
    }
  }, [activeMenu.refetch]);

  return (
    <Card title={t('edit.blog')} extra={<LanguageList />}>
      {!loading ? (
        <Form
          name='blog-edit'
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
                      message: t('requried'),
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
            <Col span={24}>
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
              <CkeEditorEdit
                languages={languages}
                form={form}
                lang={defaultLang}
                getLanguageFields={getLanguageFields}
              />
            </Col>
          </Row>
          <Space>
            <Button type='primary' htmlType='submit' loading={loadingBtn}>
              {t('save')}
            </Button>
          </Space>
        </Form>
      ) : (
        <div className='d-flex justify-content-center align-items-center'>
          <Spin size='large' className='py-5' />
        </div>
      )}
    </Card>
  );
}
