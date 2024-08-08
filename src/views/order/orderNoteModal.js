import React, { useState } from 'react';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import orderService from '../../services/order';
import { toast } from 'react-toastify';

export default function OrderNoteModal({
  result,
  changeColumnData,
  statusChangedOrder,
  setStatusChangedOrder,
  modalNoteType,
}) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const handleCancel = () => setStatusChangedOrder((prev) => !prev);
  const onFinish = (values) => {
    setLoading(true);
    const params = { ...values, status: modalNoteType };
    orderService
      .updateStatus(statusChangedOrder, params)
      .then(({ data }) => {
        handleCancel();
        changeColumnData(result);
        toast.success(`#${data.id} order status changed`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      visible={!!statusChangedOrder}
      onCancel={handleCancel}
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
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label={
                modalNoteType === 'pause' ? t('pause.note') : t('canceled.note')
              }
              name={modalNoteType === 'pause' ? 'pause_note' : 'canceled_note'}
              rules={[
                {
                  required: modalNoteType === 'canceled',
                  message: t('required'),
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
