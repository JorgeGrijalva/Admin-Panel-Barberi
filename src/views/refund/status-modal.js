import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setRefetch } from '../../redux/slices/menu';
import refundService from '../../services/refund';
import TextArea from 'antd/lib/input/TextArea';
import { toast } from 'react-toastify';

export default function StatusModal({
  orderDetails: data,
  handleCancel,
  status,
}) {
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(data.status);

  const onFinish = (values) => {
    setLoading(true);
    const params = { ...values };
    refundService
      .update(data.id, params)
      .then(() => {
        handleCancel();
        dispatch(setRefetch(activeMenu));
      }).catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      visible={!!data}
      title={t('refund')}
      closable={false}
      footer={[
        <Button
          key='save-form'
          type='primary'
          onClick={() => form.submit()}
          loading={loading}
        >
          {t('save')}
        </Button>,
        <Button key='cansel-modal' type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{ status: data.status }}
      >
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label={t('status')}
              name='status'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <Select onChange={(e) => setCurrent(e)}>
                {status.map((item, index) => (
                  <Select.Option key={index} value={item}>
                    {t(item)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {current !== 'accepted' && (
              <Form.Item
                label={t('answer')}
                name='answer'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
