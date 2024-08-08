import React from 'react';
import { Button, Modal, Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';

export default function DeliverymanRequestModal({ data, handleClose }) {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('request.details')}
      visible={!!data}
      onCancel={handleClose}
      footer={
        <Button type='default' onClick={handleClose}>
          {t('cancel')}
        </Button>
      }
    >
      <Descriptions bordered>
        <Descriptions.Item span={3} label={t('id')}>
          {data?.id}
        </Descriptions.Item>
        <Descriptions.Item span={3} label={t('firstname')}>
          {t(data?.model?.firstname)}
        </Descriptions.Item>
        <Descriptions.Item span={3} label={t('lastname')}>
          {t(data?.model?.lastname)}
        </Descriptions.Item>
        <Descriptions.Item span={3} label={t('car')}>
          {t(data?.data?.brand)} {t(data?.data?.model)}
        </Descriptions.Item>
        <Descriptions.Item span={3} label={t('car.number')}>
          {t(data?.data?.number)}
        </Descriptions.Item>
        <Descriptions.Item span={3} label={t('color')}>
          {t(data?.data?.color)}
        </Descriptions.Item>
        <Descriptions.Item span={3} label={t('height')}>
          {t(data?.data?.height)}
          {'  '}
          {t('m')}
        </Descriptions.Item>
        <Descriptions.Item span={3} label={t('width')}>
          {t(data?.data?.width)}
          {'  '}
          {t('m')}
        </Descriptions.Item>
        <Descriptions.Item span={3} label={t('status')}>
          {data?.data?.online ? t('online') : t('offline')}
        </Descriptions.Item>
        <Descriptions.Item span={3} label={t('fuel')}>
          {t(data?.data?.type_of_technique)}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}
