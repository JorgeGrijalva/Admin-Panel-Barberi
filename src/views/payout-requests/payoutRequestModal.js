import React, { useState } from 'react';
import { Button, Descriptions, Modal } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setRefetch } from '../../redux/slices/menu';
import walletService from '../../services/wallet';
import numberToPrice from '../../helpers/numberToPrice';
import moment from 'moment';

export default function PayoutRequestModal({ data, handleCancel }) {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  const acceptRequest = () => {
    setLoadingAccept(true);
    const payload = { status: 'paid' };
    walletService
      .statusChange(data.uuid, payload)
      .then(() => {
        handleCancel();
        dispatch(setRefetch(activeMenu));
      })
      .finally(() => setLoadingAccept(false));
  };

  const rejectRequest = () => {
    setLoadingReject(true);
    const payload = { status: 'rejected' };
    walletService
      .statusChange(data.uuid, payload)
      .then(() => {
        handleCancel();
        dispatch(setRefetch(activeMenu));
      })
      .finally(() => setLoadingReject(false));
  };

  return (
    <Modal
      visible={!!data}
      title={t('pay.to.seller')}
      onCancel={handleCancel}
      footer={[
        <Button
          key='pay-btn'
          type='primary'
          onClick={acceptRequest}
          loading={loadingAccept}
        >
          {t('pay')}
        </Button>,
        <Button
          key='reject-btn'
          type='danger'
          onClick={rejectRequest}
          loading={loadingReject}
        >
          {t('reject')}
        </Button>,
      ]}
    >
      <Descriptions bordered>
        <Descriptions.Item label={t('seller')} span={3}>
          {data.user?.firstname} {data.user?.lastname}
        </Descriptions.Item>
        <Descriptions.Item label={t('phone')} span={3}>
          {data.user?.phone}
        </Descriptions.Item>
        <Descriptions.Item label={t('requested.amount')} span={3}>
          {numberToPrice(data.price, defaultCurrency.symbol)}
        </Descriptions.Item>
        <Descriptions.Item label={t('note')} span={3}>
          {data.note}
        </Descriptions.Item>
        <Descriptions.Item label={t('created.at')} span={3}>
          {moment(data?.created_at).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}
