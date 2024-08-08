import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import orderService from '../../../services/waiter/order';
import { setRefetch } from '../../../redux/slices/menu';

const allStatuses = ['new', 'accepted', 'ready', 'on_a_way', 'delivered'];

export default function OrderStatusModal({ orderDetails: data, handleCancel }) {
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState(allStatuses);

  useEffect(() => {
    const statusIndex = allStatuses.findIndex((item) => item === data.status);
    let newStatuses = [
      allStatuses[statusIndex],
      allStatuses[statusIndex + 1],
      'canceled',
    ];
    if (statusIndex < 0) {
      newStatuses = [allStatuses[statusIndex + 1], 'canceled'];
    }
    setStatuses(newStatuses);
  }, [data]);

  const onFinish = (values) => {
    setLoading(true);
    const params = { ...values };
    orderService
      .updateStatus(data.id, params)
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
        <Button type='primary' onClick={() => form.submit()} loading={loading}>
          {t('save')}
        </Button>,
        <Button type='default' onClick={handleCancel}>
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
                {statuses.map((item, idx) => (
                  <Select.Option key={item + idx} value={item}>
                    {t(item)}
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
