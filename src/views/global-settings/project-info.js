import React, { useState } from 'react';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import ImageUploadSingle from '../../components/image-upload-single';
import installationService from '../../services/installation';

export default function ProjectInfo({ next }) {
  const [form] = Form.useForm();
  const [logo, setLogo] = useState(null);
  const [favicon, setFavicon] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    const data = {
      ...values,
      favicon: values.favicon.name,
      logo: values.logo.name,
      delivery: '1',
      multy_shop: '1',
    };
    setLoading(true);
    installationService
      .setInitFile(data)
      .then(() => next())
      .finally(() => setLoading(false));
  };

  return (
    <Card
      title='Project info'
      className='w-100'
      extra={<p>Information required for the project</p>}
    >
      <Form
        layout='vertical'
        name='project-init'
        form={form}
        onFinish={onFinish}
        initialValues={{ multy_shop: '1', delivery: '1' }}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label='Title'
              name='name'
              rules={[{ required: true, message: 'Missing project name' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          {/* <Col span={8}>
            <Form.Item
              label='Type'
              name='multy_shop'
              rules={[{ required: true, message: 'Missing project type' }]}
            >
              <Radio.Group buttonStyle='solid'>
                <Radio.Button value='1'>Multi seller</Radio.Button>
                <Radio.Button value='0'>Single store</Radio.Button>
                <Radio.Button value='2'>Multi vendor</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='Delivery'
              name='delivery'
              rules={[{ required: true, message: 'Missing project delivery' }]}
            >
              <Radio.Group buttonStyle='solid'>
                <Radio.Button value='1'>Shop</Radio.Button>
                <Radio.Button value='0'>Admin</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col> */}
          <Col>
            <Form.Item
              label='Logo'
              name='logo'
              rules={[{ required: true, message: 'Missing project logo' }]}
            >
              <ImageUploadSingle
                type='shops'
                image={logo}
                setImage={setLogo}
                form={form}
                name='logo'
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='Favicon'
              name='favicon'
              rules={[{ required: true, message: 'Missing project favicon' }]}
            >
              <ImageUploadSingle
                type='shops'
                image={favicon}
                setImage={setFavicon}
                form={form}
                name='favicon'
              />
            </Form.Item>
          </Col>
        </Row>
        <Button type='primary' htmlType='submit' loading={loading}>
          Save
        </Button>
      </Form>
    </Card>
  );
}
