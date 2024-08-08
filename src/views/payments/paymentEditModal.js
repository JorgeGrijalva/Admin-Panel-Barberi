import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setRefetch } from '../../redux/slices/menu';
import paymentService from '../../services/payment';
import Loading from '../../components/loading';
import LanguageList from '../../components/language-list';
import getTranslationFields from '../../helpers/getTranslationFields';
import getLanguageFields from '../../helpers/getLanguageFields';

export default function PaymentEditModal({ modal, handleCancel }) {
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  function fetchPayment(id) {
    setLoading(true);
    paymentService
      .getById(id)
      .then(({ data }) => {
        const fields = ['title', 'client_title', 'secret_title'];
        const translations = getLanguageFields(languages, data, fields);
        form.setFieldsValue({ ...data, ...translations });
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (modal) {
      fetchPayment(modal.id);
    }
  }, [modal]);

  const onFinish = (values) => {
    const params = {
      client_id: values.client_id,
      secret_id: values.secret_id,
      title: getTranslationFields(languages, values, 'title'),
      client_title: getTranslationFields(languages, values, 'client_title'),
      secret_title: getTranslationFields(languages, values, 'secret_title'),
    };
    setLoadingBtn(true);
    paymentService
      .update(modal.id, params)
      .then(() => {
        handleCancel();
        dispatch(setRefetch(activeMenu));
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Modal
      visible={!!modal}
      title={t('edit.payment')}
      onCancel={handleCancel}
      footer={[
        <Button
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
          key='save-btn'
        >
          {t('save')}
        </Button>,
        <Button type='default' onClick={handleCancel} key='cancel-btn'>
          {t('cancel')}
        </Button>,
      ]}
    >
      {!loading ? (
        <>
          <div className='d-flex justify-content-end'>
            <LanguageList />
          </div>
          <Form form={form} layout='vertical' onFinish={onFinish}>
            <Row gutter={12}>
              <Col span={24}>
                {languages.map((item) => (
                  <Form.Item
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
                    label={t('client.title')}
                    name={`client_title[${item.locale}]`}
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
                    label={t('secret.title')}
                    name={`secret_title[${item.locale}]`}
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
              <Col span={24}>
                <Form.Item
                  label={t('client.id')}
                  name='client_id'
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={t('secret.id')}
                  name='secret_id'
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      ) : (
        <Loading />
      )}
    </Modal>
  );
}
