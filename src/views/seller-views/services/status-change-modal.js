import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Col, Select, Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const StatusChangeModal = ({
  statuses,
  visible,
  data,
  handleSubmit,
  handleCancel,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(data?.status);

  const onFinish = (values) => {
    setLoading(true);

    const params = {
      status: values?.status,
      id: data?.id,
      status_note: values?.status_note,
    };

    handleSubmit(params).finally(() => {
      setLoading(false);
      handleCancel();
    });
  };

  return (
    <Modal
      title={t('change.status')}
      visible={visible}
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
        onFinish={onFinish}
        layout='vertical'
        initialValues={{
          status: data?.status,
        }}
      >
        <Col span={24}>
          <Form.Item
            label={t('status')}
            name='status'
            rules={[
              {
                required: true,
                message: t('please.select.status'),
              },
            ]}
          >
            <Select onChange={(e) => setSelectedStatus(e)}>
              {statuses.map((item, idx) => (
                <Select.Option key={item + idx} value={item}>
                  {t(item)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {selectedStatus === statuses[2] && (
          <Col span={24}>
            <Form.Item
              label={t('status.note')}
              name='status_note'
              rules={[
                {
                  required: selectedStatus === statuses[2],
                  message: t('required'),
                },
              ]}
            >
              <TextArea rows={2} />
            </Form.Item>
          </Col>
        )}
      </Form>
    </Modal>
  );
};

export default StatusChangeModal;
