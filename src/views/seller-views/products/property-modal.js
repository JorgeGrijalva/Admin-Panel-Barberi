import React, { useEffect } from 'react';
import { Col, Form, Input, Modal, Row } from 'antd';
import LanguageList from '../../../components/language-list';
import { shallowEqual, useSelector } from 'react-redux';

export default function PropertyModal({
  editData,
  handleCancel,
  editProperty,
}) {
  const [form] = Form.useForm();
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  const onFinish = (values) => {
    const data = { ...editData, ...values };
    editProperty(data);
  };

  useEffect(() => {
    form.setFieldsValue(editData);
  }, [editData]);

  return (
    <Modal
      title='Edit product property'
      visible={!!editData}
      okText='Save'
      onCancel={handleCancel}
      onOk={() => form.submit()}
    >
      <Row className='mb-3'>
        <Col span={24}>
          <LanguageList />
        </Col>
      </Row>
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Row className='mt-4'>
          <Col span={24}>
            {languages.map((item) => (
              <Form.Item
                key={'key' + item.locale}
                label='Key'
                name={`key[${item.locale}]`}
                rules={[{ required: item.locale === defaultLang, message: '' }]}
                hidden={item.locale !== defaultLang}
              >
                <Input />
              </Form.Item>
            ))}
          </Col>
          <Col span={24}>
            {languages.map((item) => (
              <Form.Item
                key={'value' + item.locale}
                label='Value'
                name={`value[${item.locale}]`}
                rules={[{ required: item.locale === defaultLang, message: '' }]}
                hidden={item.locale !== defaultLang}
              >
                <Input />
              </Form.Item>
            ))}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
