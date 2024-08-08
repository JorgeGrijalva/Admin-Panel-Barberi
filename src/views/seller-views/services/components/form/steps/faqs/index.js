import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Card, Col, Form, Input, Row, Switch } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';
import servicesService from 'services/seller/services';
import getLanguageFields from 'helpers/getLanguageFields';
import { disableRefetch } from 'redux/slices/menu';
import useDidUpdate from 'helpers/useDidUpdate';
import getTranslationFields from 'helpers/getTranslationFields';
import { toast } from 'react-toastify';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const ServiceFaqs = ({ prev, next }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchService = useCallback(
    (id) => {
      setLoading(true);
      servicesService
        .getById(id)
        .then(({ data }) => {
          const resData =
            activeMenu.id === 'create.service' &&
            data?.service_faqs.length === 0
              ? activeMenu.data
              : data;

          const body = resData?.service_faqs?.map((item) => ({
            ...getLanguageFields(languages, item, ['question', 'answer']),
            active: !!item?.active,
          }));
          form.setFieldsValue({ faqs: body });
        })
        .finally(() => setLoading(false));
    },
    [id],
  );

  const fetch = () => {
    fetchService(id);
    dispatch(disableRefetch(activeMenu));
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, []);

  useDidUpdate(() => {
    if (activeMenu.refetch) {
      fetch();
    }
  }, [activeMenu.refetch]);

  const onFinish = (values) => {
    const body = values?.faqs?.map((value) => ({
      active: value?.active ? 1 : 0,
      question: getTranslationFields(languages, value, 'question'),
      answer: getTranslationFields(languages, value, 'answer'),
      type: 'web',
    }));

    setLoadingBtn(true);
    servicesService
      .createFaqs(id, { faqs: body })
      .then(() => {
        toast.success(t('successfully.updated'));
        next();
      })
      .finally(() => setLoadingBtn(false));
  };
  return (
    <Form form={form} layout='vertical' onFinish={onFinish}>
      <Card loading={loading}>
        <Form.List name='faqs'>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Row
                  style={{ display: 'flex', marginBottom: 8 }}
                  align='baseline'
                  gutter={24}
                  className='mb-3'
                  key={key}
                >
                  <Col span={10}>
                    {languages.map((item) => (
                      <Form.Item
                        label={t('question')}
                        name={[name, `question[${item?.locale || 'en'}]`]}
                        key={[name, item?.locale]}
                        hidden={item?.locale !== defaultLang}
                        rules={[
                          {
                            required: item?.locale === defaultLang,
                            message: t('required'),
                          },
                          {
                            type: 'string',
                            min: 2,
                            max: 200,
                            message: t('min.2.max.200.chars'),
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    ))}
                  </Col>
                  <Col span={10}>
                    {languages.map((item) => (
                      <Form.Item
                        label={t('answer')}
                        name={[name, `answer[${item?.locale || 'en'}]`]}
                        key={[name, item?.locale]}
                        hidden={item?.locale !== defaultLang}
                        rules={[
                          {
                            required: item?.locale === defaultLang,
                            message: t('required'),
                          },
                          {
                            type: 'string',
                            min: 2,
                            max: 200,
                            message: t('min.2.max.200.chars'),
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    ))}
                  </Col>
                  <Col>
                    <Form.Item
                      label={t('active')}
                      name={[name, 'active']}
                      valuePropName='checked'
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  {/*<MinusCircleOutlined  />*/}
                  <Form.Item label=' '>
                    <Button
                      type='danger'
                      onClick={() => remove(name)}
                      icon={<DeleteOutlined />}
                      disabled={fields?.length === 1}
                    />
                  </Form.Item>
                </Row>
              ))}
              <Form.Item>
                <Button
                  type='dashed'
                  onClick={() => add({ active: true })}
                  block
                  icon={<PlusOutlined />}
                >
                  {t('add.faq')}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>
      <Card>
        <div className='formFooterButtonsContainer'>
          <Button onClick={prev}>{t('prev')}</Button>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('next')}
          </Button>
        </div>
      </Card>
    </Form>
  );
};

export default ServiceFaqs;
