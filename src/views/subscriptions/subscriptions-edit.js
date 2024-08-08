import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Switch,
} from 'antd';
import { useTranslation } from 'react-i18next';
import subscriptionService from '../../services/subscriptions';
import Loading from '../../components/loading';

export default function SubscriptionEditModal({
  modal,
  handleCancel,
  refetch,
}) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    const payload = {
      ...values,
      active: Number(values.active),
      with_report: Number(values.with_report),
      type: 'shop',
    };
    setLoadingBtn(true);
    subscriptionService
      .update(modal.id, payload)
      .then(() => {
        handleCancel();
        refetch();
      })
      .finally(() => setLoadingBtn(false));
  };

  const fetchSubscriptionList = () => {
    setLoading(true);
    subscriptionService
      .getById(modal.id)
      .then((res) => {
        console.log('data', res.data);
        form.setFieldsValue({
          ...res.data,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubscriptionList();
  }, [modal]);

  return (
    <React.Fragment>
      <Modal
        visible={!!modal}
        title={t('edit.subscription')}
        onCancel={handleCancel}
        style={{ minWidth: 800 }}
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
        {loading ? (
          <Loading />
        ) : (
          <Form
            form={form}
            layout='vertical'
            onFinish={onFinish}
            initialValues={{
              active: Boolean(modal?.active),
              with_report: Boolean(modal?.with_report),
              ...modal,
            }}
          >
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  label={t('title')}
                  name='title'
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

              <Col span={12}>
                <Form.Item
                  label={t('period')}
                  name='month'
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <InputNumber min={0} max={12} className='w-100' />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={t('product_limit')}
                  name='product_limit'
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <InputNumber min={0} className='w-100' />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={t('order_limit')}
                  name='order_limit'
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <InputNumber min={0} className='w-100' />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={t('price')}
                  name='price'
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <InputNumber min={0} className='w-100' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('booking.limit')}
                  name='booking_limit'
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <InputNumber min={0} className='w-100' />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={t('with_report')}
                  name='with_report'
                  valuePropName='checked'
                >
                  <Switch />
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
            </Row>
          </Form>
        )}
      </Modal>
    </React.Fragment>
  );
}
