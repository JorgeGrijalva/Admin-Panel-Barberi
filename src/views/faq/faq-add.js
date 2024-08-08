import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, Row, Space } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu, setMenuData } from '../../redux/slices/menu';
import LanguageList from '../../components/language-list';
import getTranslationFields from '../../helpers/getTranslationFields';
import { fetchFaqs } from '../../redux/slices/faq';
import { useTranslation } from 'react-i18next';
import TextArea from 'antd/lib/input/TextArea';
import faqService from '../../services/faq';

export default function FaqAdd() {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const onFinish = (values) => {
    const body = {
      question: getTranslationFields(languages, values, 'question'),
      answer: getTranslationFields(languages, values, 'answer'),
    };
    setLoadingBtn(true);
    const nextUrl = 'settings/faqs';
    faqService
      .create(body)
      .then(() => {
        toast.success(t('successfully.created'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(fetchFaqs({}));
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Card title={t('add.faq')} extra={<LanguageList />}>
      <Form
        name='faq-add'
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
                <TextArea rows={2} maxLength={150} />
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
                <TextArea rows={6} maxLength={300} />
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
    </Card>
  );
}
