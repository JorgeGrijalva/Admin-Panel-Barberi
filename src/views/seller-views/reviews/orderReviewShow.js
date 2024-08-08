import React, { useEffect, useState } from 'react';
import { Button, Descriptions, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import Loading from '../../../components/loading';
import reviewService from '../../../services/seller/review';

export default function OrderReviewShowModal({ id, handleCancel }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  function fetchReviews(id) {
    setLoading(true);
    reviewService
      .getById(id)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchReviews(id);
  }, [id]);

  return (
    <Modal
      visible={!!id}
      title={t('order.review')}
      onCancel={handleCancel}
      footer={
        <Button type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>
      }
    >
      {!loading ? (
        <Descriptions bordered>
          <Descriptions.Item span={3} label={t('id')}>
            {data.id}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('user')}>
            {data.user?.firstname} {data.user?.lastname || ''}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('rating')}>
            {data.rating}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('order.id')}>
            {data.order?.id}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('comment')}>
            {data.comment}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('created.at')}>
            {data.created_at}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Loading />
      )}
    </Modal>
  );
}
