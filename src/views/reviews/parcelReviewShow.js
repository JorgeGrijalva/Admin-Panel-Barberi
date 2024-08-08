import React, { useEffect, useState } from 'react';
import { Button, Descriptions, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/loading';
import reviewService from '../../services/review';

export default function ParcelReviewShowModal({ id, handleCancel }) {
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
            {data?.parcel_order?.username_from} <a href={`tel:${data?.parcel_order?.phone_from}`}>{data?.parcel_order?.phone_from}</a>
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('receiver')}>
            {data?.parcel_order?.username_to} <a href={`tel:${data?.parcel_order?.phone_to}`}>{data?.parcel_order?.phone_to} </a> 
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('deliveryman')}>
            {data.deliveryman?.firstname} {data.deliveryman?.lastname || ''}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('rating')}>
            {data.rating}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('comment')}>
            {data.comment}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('parcel.order.id')}>
            {data?.parcel_order?.id}
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
