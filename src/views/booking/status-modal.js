import { useTranslation } from 'react-i18next';
import { Col, Form, Modal, Row, Select, Space, Button } from 'antd';
import React, { useState } from 'react';

const statuses = ['new', 'progress', 'booked', 'ended', 'canceled'];

const StatusModal = ({ data, handleSubmit, handleClose }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [loadingBtn, setLoadingBtn] = useState(false);

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      status: values?.status,
    };
    handleSubmit(data?.id, body)
      .then(() => handleClose())
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Modal
      visible={!!data}
      footer={
        <Space>
          <Button onClick={handleClose}>{t('cancel')}</Button>
          <Button
            type='primary'
            onClick={() => form.submit()}
            loading={loadingBtn}
          >
            {t('save')}
          </Button>
        </Space>
      }
      onCancel={handleClose}
    >
      <Form
        form={form}
        initialValues={{ status: data?.status }}
        layout='vertical'
        onFinish={onFinish}
      >
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item name='status' label={t('status')}>
              <Select>
                {statuses.map((status) => (
                  <Select.Option value={status}>{t(status)}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default StatusModal;
