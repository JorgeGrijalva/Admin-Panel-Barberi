import { Button, Descriptions, Modal, Spin } from 'antd';
import numberToPrice from 'helpers/numberToPrice';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import advertService from 'services/seller/advert';

const AdDetail = ({ id, onClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const getAd = useCallback(() => {
    setLoading(true);
    if (!!id) {
      advertService
        .getById(id)
        .then((res) => {
          setData(res.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    getAd();
  }, [id, getAd]);

  return (
    <Modal
      visible={!!id}
      title={t('ad.detail')}
      onCancel={onClose}
      footer={[<Button onClick={onClose}>{t('close')}</Button>]}
    >
      {loading ? (
        <div className='flex justify-content-center my-6'>
          <Spin />
        </div>
      ) : (
        <Descriptions bordered>
          <Descriptions.Item span={3} label={t('title')}>
            {data?.translation?.title}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('price')}>
            {numberToPrice(data?.price)}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('time')}>
            {data?.time} {data?.time_type}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default AdDetail;
