import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, Input, Row, Select, Switch } from 'antd';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu, setMenuData } from 'redux/slices/menu';
import { fetchPages } from 'redux/slices/pages';
import { useTranslation } from 'react-i18next';
import LanguageList from 'components/language-list';
import MediaUpload from 'components/upload';
import { IMG_URL, api_url } from 'configs/app-global';
import { typeList } from './type-list';
import CkeEditor from 'components/ckeEditor';
import axios from 'axios';
import getTranslationFields from 'helpers/getTranslationFields';

const PageAdd = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [type, setType] = useState(null);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const { pages } = useSelector((state) => state.pages, shallowEqual);

  const createImage = (name) => {
    return {
      name,
      url: IMG_URL + name,
    };
  };
  const [image, setImage] = useState(
    activeMenu.data?.galleries?.[0]
      ? [createImage(activeMenu.data.galleries?.[0].path)]
      : [],
  );

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      images: image.map((img) => img.name),
      active: Number(values.active),
      type: values.type,
      title: getTranslationFields(languages, values, 'title'),
      description: getTranslationFields(languages, values, 'description'),
      buttons: {
        google_play_button_link: values?.google_play_button_link,
        app_store_button_link: values?.app_store_button_link,
      },
    };
    axios({
      method: 'post',
      url: `${api_url}dashboard/admin/pages`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      data: body,
      params: {},
    })
      .then(() => {
        const nextUrl = 'pages';
        toast.success(t('successfully.created'));
        batch(() => {
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          dispatch(fetchPages({}));
        });
        navigate(`/${nextUrl}`);
      })
      .catch((err) => toast.error(err.response?.data?.message))
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Card title={t('add.pages')} className='h-100' extra={<LanguageList />}>
      <Form
        name='page-add'
        layout='vertical'
        onFinish={onFinish}
        form={form}
        initialValues={{ active: true, ...activeMenu.data }}
        className='d-flex flex-column h-100'
      >
        <Row gutter={12}>
          <Col span={12}>
            {languages.map((item) => (
              <Form.Item
                key={'title' + item.locale}
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
          <Col span={12} />
          <Col span={24}>
            <CkeEditor form={form} languages={languages} lang={defaultLang} />
          </Col>

          <Col span={12}>
            <Form.Item
              label={t('type')}
              name='type'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <Select
                onChange={(e) => setType(e)}
                options={typeList.filter(
                  (i) => !pages.some((e) => e.type === i.value),
                )}
                className='w-100'
              />
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
          {type !== 'delivery' && type !== 'about' && (
            <>
              <Col span={12}>
                <Form.Item
                  label={t('google_play_button_link')}
                  name='google_play_button_link'
                >
                  <Input className='w-100' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('app_store_button_link')}
                  name='app_store_button_link'
                >
                  <Input className='w-100' />
                </Form.Item>
              </Col>
            </>
          )}
          <Col span={12}>
            <Form.Item label={t('image')}>
              <MediaUpload
                type='other'
                imageList={image}
                setImageList={setImage}
                form={form}
                multiple={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className='flex-grow-1 d-flex flex-column justify-content-end'>
          <div className='pb-5'>
            <Button type='primary' htmlType='submit' loading={loadingBtn}>
              {t('submit')}
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default PageAdd;
