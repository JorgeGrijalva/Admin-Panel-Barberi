import React, { useState } from 'react';
import { Button, Form, Input, Modal, Switch } from 'antd';
import ImageUploadSingle from '../../components/image-upload-single';
import installationService from '../../services/installation';
import { toast } from 'react-toastify';

export default function LanguageModal({ modal, handleCancel }) {
  const [form] = Form.useForm();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    const data = {
      ...values,
      active: 1,
      default: 1,
      images: [values.favicon.name],
    };
    setLoading(true);
    installationService
      .createLang(data)
      .then(() => {
        toast.success('Successfully created');
        handleCancel();
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      title='Add language'
      visible={modal}
      onCancel={handleCancel}
      footer={[
        <Button
          key='ok-button'
          type='primary'
          loading={loading}
          onClick={() => form.submit()}
        >
          Save
        </Button>,
        <Button key='cancel-button' onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Form layout='vertical' name='lang-form' form={form} onFinish={onFinish}>
        <Form.Item
          label='Title'
          name='title'
          rules={[{ required: true, message: 'Missing title' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Locale'
          name='locale'
          rules={[{ required: true, message: 'Missing locale' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label='Backward' name='backward' valuePropName='checked'>
          <Switch />
        </Form.Item>
        <Form.Item
          label='Image'
          name='image'
          rules={[{ required: true, message: 'Missing image' }]}
        >
          <ImageUploadSingle
            type='languages'
            image={image}
            setImage={setImage}
            form={form}
            name='image'
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
