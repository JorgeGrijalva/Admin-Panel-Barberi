import React, { useEffect, useState } from 'react';
import { Input, Form, Row, Col, Button, Card, Switch, Select } from 'antd';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import languagesService from '../../services/languages';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  disableRefetch,
  removeFromMenu,
  setMenuData,
} from '../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import createImage from '../../helpers/createImage';
import Loading from '../../components/loading';
import MediaUpload from '../../components/upload';
import { fetchLang } from '../../redux/slices/languages';
import lang from '../../helpers/lang.json';
import useDemo from '../../helpers/useDemo';

export default function LanguageAdd() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { isDemo } = useDemo();
  const [image, setImage] = useState(
    activeMenu?.data?.image ? [activeMenu?.data?.image] : []
  );

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(
        setMenuData({ activeMenu, data: { ...activeMenu.data, ...data } })
      );
    };
  }, []);

  const fetchLanguage = (id) => {
    setLoading(true);
    languagesService
      .getById(id)
      .then((res) => {
        let language = res.data;
        setImage([createImage(language.img)]);
        form.setFieldsValue({
          ...language,
          image: [createImage(language.img)],
        });
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      title: values?.title,
      locale: values?.locale,
      images: image.length ? [image[0]?.name] : undefined,
      active: Number(values?.active),
      backward: values?.backward,
      default: values?.default,
    };

    const nextUrl = 'settings/languages';
    if (!id) {
      languagesService
        .create(body)
        .then(() => {
          dispatch(fetchLang());
          toast.success(t('successfully.created'));
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          navigate(`/${nextUrl}`);
        })
        .finally(() => setLoadingBtn(false));
    } else {
      languagesService
        .update(id, body)
        .then(() => {
          dispatch(fetchLang());
          toast.success(t('successfully.updated'));
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          navigate(`/${nextUrl}`);
        })
        .finally(() => setLoadingBtn(false));
    }
  };

  useEffect(() => {
    if (activeMenu.refetch && id) {
      fetchLanguage(id);
    }
  }, [activeMenu.refetch]);

  const options = lang.map((item) => ({
    label: item?.Native_name.toUpperCase() + ' ' + item.Language_name,
    value: item.short_code,
    key: item.Native_name,
  }));

  return (
    <Card title={id ? t('edit.language') : t('add.language')}>
      {!loading ? (
        <Form
          form={form}
          name='form'
          layout='vertical'
          initialValues={{
            ...activeMenu.data,
            active: false,
            backward: false,
            default: false,
          }}
          onFinish={onFinish}
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={t('title')}
                name='title'
                rules={[
                  {
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject(new Error(t('required')));
                      } else if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value && value?.trim().length < 2) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.2'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('short.code')}
                name='locale'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                ]}
              >
                <Select
                  filterOption={(input, option) =>
                    (option?.label ?? '').includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  showSearch
                  allowClear
                  options={options}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
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
                  type='languages'
                  imageList={image}
                  setImageList={setImage}
                  form={form}
                  multiple={false}
                />
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
              <Form.Item label='RTL' name='backward' valuePropName='checked'>
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t('default')}
                name='default'
                valuePropName='checked'
              >
                <Switch disabled={isDemo} />
              </Form.Item>
            </Col>
          </Row>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('save')}
          </Button>
        </Form>
      ) : (
        <Loading />
      )}
    </Card>
  );
}
