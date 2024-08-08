import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, Input, Row, Space } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { disableRefetch, setMenuData } from '../../redux/slices/menu';
import privacyService from '../../services/privacy';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/loading';
import LanguageList from '../../components/language-list';
import getTranslationFields from '../../helpers/getTranslationFields';

export default function Terms() {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

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
    }));
    return Object.assign({}, ...result);
  }

  function fetchTerms() {
    setLoading(true);
    privacyService
      .getTerms()
      .then(({ data }) =>
        form.setFieldsValue({
          ...getLanguageFields(data),
        })
      )
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  }

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchTerms();
    }
  }, [activeMenu.refetch]);

  const onFinish = (values) => {
    const body = {
      title: getTranslationFields(languages, values),
      description: getTranslationFields(languages, values, 'description'),
    };
    setLoadingBtn(true);
    privacyService
      .createTerms(body)
      .then(() => {
        toast.success(t('successfully.saved'));
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Card title={t('terms')} extra={<LanguageList />}>
      {!loading ? (
        <Form
          name='terms-form'
          layout='vertical'
          onFinish={onFinish}
          form={form}
          initialValues={activeMenu.data}
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
            <Col span={24}>
              {languages.map((item) => (
                <Form.Item
                  label={t('description')}
                  name={`description[${item.locale}]`}
                  valuePropName='data'
                  getValueFromEvent={(event, editor) => {
                    const data = editor.getData();
                    return data;
                  }}
                  rules={[
                    {
                      required: item.locale === defaultLang,
                      message: t('required'),
                    },
                  ]}
                  hidden={item.locale !== defaultLang}
                >
                  <CKEditor editor={ClassicEditor} />
                </Form.Item>
              ))}
            </Col>
          </Row>
          <Space>
            <Button type='primary' htmlType='submit' loading={loadingBtn}>
              {t('save')}
            </Button>
          </Space>
        </Form>
      ) : (
        <Loading />
      )}
    </Card>
  );
}
