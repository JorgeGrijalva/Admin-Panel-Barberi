import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Descriptions, Modal } from 'antd';
import sellerUserMembershipsService from 'services/seller/user-memberships';
import numberToPrice from 'helpers/numberToPrice';
import Loading from 'components/loading';

export default function DetailModal({ id, handleCancel }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  function fetchDetail(id) {
    setLoading(true);
    sellerUserMembershipsService
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
      title={t('membership')}
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
          <Descriptions.Item span={3} label={t('membership.id')}>
            {data.member_ship?.id}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('membership')}>
            {data.member_ship?.translation?.title}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('price')}>
            {numberToPrice(data?.price)}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('sessions')}>
            {data.sessions}
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('sessions.count')}>
            {data.sessions_count}
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
