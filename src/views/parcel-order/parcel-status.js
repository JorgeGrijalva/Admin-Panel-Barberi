import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import parcelOrderService from 'services/parcelOrder';
import { setRefetch } from 'redux/slices/menu';

export default function ParcelStatus({
  orderDetails: data,
  handleCancel,
  status,
}) {
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState(status);

  useEffect(() => {
    const statusIndex = status.findIndex((item) => item.name === data.status);
    let newStatuses = [
      status[statusIndex],
      status[statusIndex + 1],
      { name: 'canceled', id: 8, active: true },
    ];
    if (statusIndex < 0) {
      newStatuses = [status[statusIndex + 1], 'canceled'];
    }
    setStatuses(newStatuses);
  }, [data]);

  const onFinish = (values) => {
    setLoading(true);
    const payload = { ...values };
    parcelOrderService
      .updateStatus(data.id, payload)
      .then(() => {
        handleCancel();
        dispatch(setRefetch(activeMenu));
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      visible={!!data}
      title={data.title}
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
              <Select>
                {statuses?.map((item) => (
                  <Select.Option key={item?.name} value={item?.name}>
                    {t(item?.name)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
