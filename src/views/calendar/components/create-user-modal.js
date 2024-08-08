import { useState, useContext } from 'react';
import { Button, Form, Input, Modal, Row, Col, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';
import userService from 'services/user';
import { toast } from 'react-toastify';
import { BookingContext } from '../provider';

const CreateUserModal = ({ isOpen, handleCancel }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { infoForm } = useContext(BookingContext);
  const [error, setError] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const handleClose = () => {
    form.resetFields();
    setError(null);
    handleCancel();
  };

  const onFinish = (values) => {
    setLoadingBtn(true);
    const payload = {
      ...values,
      role: 'user',
    };
    userService
      .create(payload)
      .then(({ data }) => {
        const clientData = {
          label: `${data?.firstname || ''} ${data?.lastname || ''}`,
          value: data?.id,
          key: data?.id,
          disabled: undefined,
        };
        infoForm.setFieldsValue({ client: clientData });
        toast.success(t('successfully.added'));
        handleClose();
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Modal
      title={t('create.user')}
      visible={isOpen}
      onCancel={handleClose}
      footer={[
        <Button
          key='ok-button'
          type='primary'
          loading={loadingBtn}
          onClick={() => form.submit()}
        >
          {t('save')}
        </Button>,
        <Button key='cancel-button' onClick={handleClose}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form
        layout='vertical'
        name='create-user-form'
        form={form}
        onFinish={onFinish}
      >
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label={t('firstname')}
              name='firstname'
              help={error?.firstname ? error.firstname?.[0] : null}
              validateStatus={error?.firstname ? 'error' : 'success'}
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('lastname')}
              name='lastname'
              help={error?.lastname ? error?.lastname?.[0] : null}
              validateStatus={error?.lastname ? 'error' : 'success'}
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('phone')}
              name='phone'
              help={error?.phone ? error.phone[0] : null}
              validateStatus={error?.phone ? 'error' : 'success'}
              rules={[{ required: true, message: t('required') }]}
            >
              <InputNumber min={0} className='w-100' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('email')}
              name='email'
              help={error?.email ? error.email[0] : null}
              validateStatus={error?.email ? 'error' : 'success'}
              rules={[
                { required: true, message: t('required') },
                { type: 'email', message: t('invalid.email') },
              ]}
            >
              <Input type='email' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
