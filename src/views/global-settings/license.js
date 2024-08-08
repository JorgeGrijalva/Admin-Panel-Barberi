import React, { useState } from 'react';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import installationService from '../../services/installation';

export default function License({ next }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    setLoading(true);
    installationService
      .checkLicence(values)
      .then(() => next())
      .finally(() => setLoading(false));
  };

  return (
    <Card
      title='Licence'
      extra={<p>Fill the licence credentials</p>}
      className='w-100'
    >
      <Form form={form} onFinish={onFinish}>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label='Purchase ID'
              name='purchase_id'
              rules={[{ required: true, message: 'Missing purchase id' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='Purchase code'
              name='purchase_code'
              rules={[{ required: true, message: 'Missing purchase code' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Button
          type='primary'
          htmlType='submit'
          className='mt-4'
          loading={loading}
        >
          Save
        </Button>
      </Form>
    </Card>
  );
}
