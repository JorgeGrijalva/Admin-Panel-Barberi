import { Card, Form, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import transactionService from '../../services/transaction';
import { useParams } from 'react-router-dom';

const transactionOptions = [
  {
    label: 'progress',
    value: 'progress',
    key: 1,
  },
  {
    label: 'paid',
    value: 'paid',
    key: 2,
  },
  {
    label: 'canceled',
    value: 'canceled',
    key: 3,
  },
  {
    label: 'rejected',
    value: 'rejected',
    key: 4,
  },
  {
    label: 'refund',
    value: 'refund',
    key: 5,
  },
];

function TransactionDetails({ form }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [value, setValue] = useState(() =>
    form.getFieldValue('transactionStatus'),
  );
  const [loading, setLoading] = useState(false);

  function selectStatus(status) {
    setLoading(true);
    transactionService
      .updateStatus(id, { status })
      .then((res) => {
        setValue(res.data.transaction.status);
      })
      .catch(() => {
        form.setFieldsValue({ transactionStatus: value });
      })
      .finally(() => setLoading(false));
  }

  return (
    <Card title={t('transaction.details')}>
      <Form.Item
        name='transactionStatus'
        label={t('transaction.status')}
        rules={[{ required: true, message: t('required') }]}
      >
        <Select
          loading={loading}
          options={transactionOptions}
          onChange={selectStatus}
        />
      </Form.Item>
    </Card>
  );
}

export default TransactionDetails;
