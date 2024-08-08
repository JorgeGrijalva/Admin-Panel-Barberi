import React, { useEffect, useState } from 'react';
import { Button, Descriptions, Image, Modal, Rate } from 'antd';
import { useTranslation } from 'react-i18next';
import Loading from 'components/loading';
import reviewService from 'services/seller/review';
import moment from 'moment';

export default function OrderReviewShowModal({ id, handleCancel }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const comment = data?.comment?.split(',');
  const name = comment?.at(0);
  const phone = comment?.at(1);
  const description = comment?.at(2);

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
      title={t('shop.review')}
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
            {data?.user?.firstname + data?.user?.lastname}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('rating')}>
            <Rate disabled defaultValue={data?.rating ?? 0} />
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('phone.number')}>
            {data?.user?.phone}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('comment')}>
            {data?.comment}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('created.at')}>
            {moment(data.created_at).format('YYYY-MM-DD HH:mm')}
          </Descriptions.Item>
          {!!data?.galleries?.length && (
            <Descriptions.Item span={3} label={t('images')}>
              <div style={{ display: 'flex', gap: '10px' }}>
                {data?.galleries?.map((item) => (
                  <div>
                    <Image
                      width={50}
                      height={50}
                      src={item?.path || ''}
                      alt='img'
                      preview
                    />
                  </div>
                ))}
              </div>
            </Descriptions.Item>
          )}
        </Descriptions>
      ) : (
        <Loading />
      )}
    </Modal>
  );
}
