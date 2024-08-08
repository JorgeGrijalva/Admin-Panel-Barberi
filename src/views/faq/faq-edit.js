import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, Row, Space } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  disableRefetch,
  removeFromMenu,
  setMenuData,
} from '../../redux/slices/menu';
import LanguageList from '../../components/language-list';
import getTranslationFields from '../../helpers/getTranslationFields';
import { fetchFaqs } from '../../redux/slices/faq';
import { useTranslation } from 'react-i18next';
import TextArea from 'antd/lib/input/TextArea';
import faqService from '../../services/faq';
import getLanguageFields from '../../helpers/getLanguageFields';
import Loading from '../../components/loading';

export default function FaqEdit() {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );
  const { uuid } = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  function fetchFaq(uuid) {
    setLoading(true);
    faqService
      .getById(uuid)
      .then(({ data }) => {
        const fields = ['answer', 'question'];
        form.setFieldsValue(getLanguageFields(languages, data, fields));
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  }

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchFaq(uuid);
    }
  }, [activeMenu.refetch]);

  const onFinish = (values) => {
    const body = {
      question: getTranslationFields(languages, values, 'question'),
      answer: getTranslationFields(languages, values, 'answer'),
    };

    setLoadingBtn(true);
    const nextUrl = 'settings/faqs';
    faqService
      .update(uuid, body)
      .then(() => {
        toast.success(t('successfully.updated'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(fetchFaqs({}));
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Card title={t('edit.faq')} extra={<LanguageList />}>
      {!loading ? (
        <Form
          name='faq-edit'
          layout='vertical'
          onFinish={onFinish}
          form={form}
          initialValues={activeMenu?.data}
        >
          <Row gutter={12}>
            <Col span={12}>
              {languages.map((item) => (
                <Form.Item
                  key={'question' + item.locale}
                  label={t('question')}
                  name={`question[${item.locale}]`}
                  rules={[
                    {
                      required: item.locale === defaultLang,
                      message: t('required'),
                    },
                  ]}
                  hidden={item.locale !== defaultLang}
                >
                  <TextArea rows={2} />
                </Form.Item>
              ))}
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              {languages.map((item) => (
                <Form.Item
                  key={'answer' + item.locale}
                  label={t('answer')}
                  name={`answer[${item.locale}]`}
                  rules={[
                    {
                      required: item.locale === defaultLang,
                      message: t('required'),
                    },
                  ]}
                  hidden={item.locale !== defaultLang}
                >
                  <TextArea rows={6} />
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
