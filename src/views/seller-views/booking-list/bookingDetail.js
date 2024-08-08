import { Button, Descriptions, Modal, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import sellerBooking from 'services/seller/booking';

const BookingDetail = ({ id, handleClose }) => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    sellerBooking
      .getById(id)
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        handleClose();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <Modal
      visible={!!id}
      title={t('booking.detail')}
      onCancel={handleClose}
      footer={[
        <Button type='default' onClick={handleClose}>
          {t('close')}
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label={t('start.date')}>
            {moment(data?.start_date).format('YYYY-MM-DD HH:MM')}
          </Descriptions.Item>
          <Descriptions.Item label={t('booking.zone')}>
            {data?.table?.shop_section.translation?.title}
          </Descriptions.Item>
          <Descriptions.Item label={t('table')}>
            {data?.table?.name}
          </Descriptions.Item>
          <Descriptions.Item label={t('user')}>
            {data?.user?.firstname} {data?.user?.lastname}{' '}
            <a href={`tel:${data?.user?.phone}`}>{data?.user?.phone}</a>
          </Descriptions.Item>
          <Descriptions.Item label={t('guests')}>
            {data?.guest}
          </Descriptions.Item>
          <Descriptions.Item label={t('comment')}>
            {data?.note}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </Modal>
  );
};

export default BookingDetail;
