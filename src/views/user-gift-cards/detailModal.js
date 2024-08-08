import React, { useEffect, useState } from 'react';
import { Button, Descriptions, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import Loading from 'components/loading';
import numberToPrice from 'helpers/numberToPrice';
import userGiftCardsService from 'services/user-gift-cards';
import { useSelector, shallowEqual } from 'react-redux';

export default function DetailModal({ id, handleCancel }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  function fetchDetail(id) {
    setLoading(true);
    userGiftCardsService
      .getById(id)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchDetail(id);
  }, [id]);

  return (
    <Modal
      visible={!!id}
      title={t('gift.card')}
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
          <Descriptions.Item span={3} label={t('gift.card')}>
            {data.giftCart?.translation?.title}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('gift.card.id')}>
            {data.giftCart?.id}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('time')}>
            {data.giftCart?.time}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('shop.id')}>
            {data.giftCart?.shop_id}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('price')}>
            {numberToPrice(
              data?.price,
              defaultCurrency?.symbol,
              defaultCurrency?.position,
            )}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('user.id')}>
            {data.user?.id}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('user')}>
            {data.user?.firstname} {data.user?.lastname}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Loading />
      )}
    </Modal>
  );
}
