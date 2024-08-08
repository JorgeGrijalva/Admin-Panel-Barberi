import React, { useEffect, useState } from 'react';
import { Button, Descriptions, Modal, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/loading';
import transactionService from '../../services/transaction';
import numberToPrice from '../../helpers/numberToPrice';

export default function TransactionShowModal({ id, handleCancel }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  function fetchTransaction(id) {
    setLoading(true);
    transactionService
      .getById(id)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchTransaction(id);
  }, [id]);

  return (
    <Modal
      visible={!!id}
      title={t('transaction')}
      onCancel={handleCancel}
      footer={
        <Button type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>
      }
    >
      {!loading ? (
        <Descriptions bordered>
          <Descriptions.Item span={3} label={t('transaction.id')}>
            {data.id}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('client')}>
            {data.user?.firstname} {data.user?.lastname}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('price')}>
            {numberToPrice(data.price, data.payable?.order?.currency?.symbol)}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('payment.type')}>
            {t(data.payment_system?.tag)}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('created.at')}>
            {data.created_at}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('status')}>
            {data.status === 'progress' ? (
              <Tag color='gold'>{t(data.status)}</Tag>
            ) : data.status === 'rejected' ? (
              <Tag color='error'>{t(data.status)}</Tag>
            ) : (
              <Tag color='cyan'>{t(data.status)}</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('status.description')}>
            {data.status_description}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('note')}>
            {data.note}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Loading />
      )}
    </Modal>
  );
}
