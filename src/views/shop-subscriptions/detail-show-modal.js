import React, { useEffect, useState } from 'react';
import { Button, Descriptions, Modal, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/loading';
import transactionService from '../../services/transaction';
import ShopSubscriptionsService from '../../services/shop-subscriptions';
import numberToPrice from '../../helpers/numberToPrice';

export default function ShopSubscriptionModal({ id, handleCancel }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  function fetchSubscription(id) {
    setLoading(true);

    ShopSubscriptionsService.getById(id)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchSubscription(id);
  }, [id]);

  return (
    <Modal
      visible={!!id}
      title={t('shop.subscription')}
      onCancel={handleCancel}
      footer={
        <Button type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>
      }
    >
      {!loading ? (
        <Descriptions bordered>
          <Descriptions.Item span={3} label={t('shop.subscription.id')}>
            {data?.id}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('price')}>
            {numberToPrice(data?.price)}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('shop.id')}>
            {data?.shop_id}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('shop.title')}>
            {data?.shop?.translation?.title}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('subscription.title')}>
            {data?.subscription?.title}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('subscription.type')}>
            {data?.subscription?.type}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('transaction')}>
            {data?.transaction?.status === 'progress' ? (
              <Tag color='gold'>{t(data?.transaction?.status)}</Tag>
            ) : data?.transaction?.status === 'rejected' ? (
              <Tag color='error'>{t(data?.transaction?.status)}</Tag>
            ) : data?.transaction?.status === 'canceled' ? (
              <Tag color='error'>{t(data?.transaction?.status)}</Tag>
            ) : (
              <Tag color='cyan'>{t(data?.transaction?.status)}</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Loading />
      )}
    </Modal>
  );
}
