import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import transactionService from '../../services/transaction';
import { fetchTransactions } from '../../redux/slices/transaction';

const status = ['paid', 'canceled'];

export default function StatusModal({
  transactionDetails: data,
  handleCancel,
  paramsData,
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    transactionService
      .updateTransactionStatus(data.id, values)
      .then(() => {
        handleCancel();
        dispatch(fetchTransactions(paramsData));
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      visible={!!data}
      title={t('transaction.status')}
      closable={false}
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
                  validator(_, value) {
                    if (!value || value === 'progress')
                      return Promise.reject(new Error(t('required')));
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Select>
                {status.map((item, index) => (
                  <Select.Option key={index} value={item}>
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
