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
import { fetchNotifications } from '../../redux/slices/notification';
import blogService from '../../services/blog';
import LanguageList from '../../components/language-list';
import getTranslationFields from '../../helpers/getTranslationFields';
import { useTranslation } from 'react-i18next';
import CkeEditorEdit from '../../components/ckeEditorEdit';

export default function NotificationClone() {
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
      type: 'notification',
      title: getTranslationFields(languages, values),
      description: getTranslationFields(languages, values, 'description'),
      short_desc: getTranslationFields(languages, values, 'short_desc'),
    };
    setLoadingBtn(true);
    const nextUrl = 'notifications';
    blogService
      .create(body)
      .then(() => {
        toast.success(t('successfully.updated'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(fetchNotifications({}));
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

  const fetchNotification = (uuid) => {
    setLoading(true);
    blogService
      .getById(uuid)
      .then((res) => {
        let blog = res.data;
        form.setFieldsValue({
          ...blog,
          ...getLanguageFields(blog),
        });
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchNotification(uuid);
    }
  }, [activeMenu.refetch]);

  return (
    <Card title={t('clone.notification')} extra={<LanguageList />}>
      {!loading ? (
        <Form
          name='notification-clone'
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
                      validator(_, value) {
                        if (!value && item?.locale === defaultLang) {
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
                  hidden={item.locale !== defaultLang}
                >
                  <Input />
                </Form.Item>
              ))}
            </Col>
            <Col span={24}>
              {languages.map((item) => (
                <Form.Item
                  key={'short_desc' + item.locale}
                  label={t('short.description')}
                  name={`short_desc[${item.locale}]`}
                  rules={[
                    {
                      validator(_, value) {
                        if (!value && item?.locale === defaultLang) {
                          return Promise.reject(new Error(t('required')));
                        } else if (value && value?.trim() === '') {
                          return Promise.reject(new Error(t('no.empty.space')));
                        } else if (value && value?.trim().length < 5) {
                          return Promise.reject(
                            new Error(t('must.be.at.least.5'))
                          );
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
            <Col span={24}>
              <CkeEditorEdit
                form={form}
                lang={defaultLang}
                languages={languages}
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
