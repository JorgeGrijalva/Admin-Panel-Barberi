import { Button, Modal } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ExtraDeleteModal({
  id,
  loading,
  handleClose,
  text,
  click,
}) {
  const { t } = useTranslation();
  return (
    <Modal closable={false} visible={!!id} footer={null} centered>
      <p>{text}</p>
      <div className='d-flex justify-content-end'>
        <Button
          type='primary'
          className='mr-2'
          onClick={click}
          loading={loading}
        >
          {t('yes')}
        </Button>
        <Button onClick={handleClose}>{t('no')}</Button>
      </div>
    </Modal>
  );
}
