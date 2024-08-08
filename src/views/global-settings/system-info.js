import React, { useState } from 'react';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import LanguageModal from './languageModal';
import installationService from '../../services/installation';

export default function SystemInfo({ next }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const onFinish = (values) => {
    const data = {
      ...values,
      rate: 1,
      active: 1,
    };
    setLoading(true);
    installationService
      .createCurrency(data)
      .then(() => next())
      .finally(() => setLoading(false));
  };

  return (
    <Card
      title='System info'
      extra={<p>Here you can add system language and currency</p>}
      className='w-100'
    >
      <Row gutter={24}>
        <Col span={12}>
          <Button
            type='default'
            icon={<PlusCircleOutlined />}
            onClick={() => setModal(true)}
          >
            Add language
          </Button>
        </Col>
      </Row>

      <Form form={form} onFinish={onFinish}>
        <Row gutter={24} className='mt-5'>
          <Col span={12}>
            <Form.Item
              label='Currency title'
              name='title'
              rules={[{ required: true, message: 'Missing title' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='Currency symbol'
              name='symbol'
              rules={[{ required: true, message: 'Missing symbol' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Button type='primary' htmlType='submit' loading={loading}>
          Submit
        </Button>
      </Form>

      {modal && (
        <LanguageModal modal={modal} handleCancel={() => setModal(false)} />
      )}
    </Card>
  );
}
