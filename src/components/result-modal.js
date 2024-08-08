import React from 'react';
import { Button, Modal, Result } from 'antd';
import { useTranslation } from 'react-i18next';

const ResultModal = ({
  open,
  handleCancel,
  text,
  click,
  loading,
  subTitle,
}) => {
  const { t } = useTranslation();

  return (
    <Modal closable={false} visible={open} footer={null} centered>
      <Result status='warning' title={text} subTitle={subTitle} />
      <div className='d-flex justify-content-end'>
        <Button
          type='primary'
          className='mr-2'
          onClick={click}
          loading={loading}
        >
          {t('yes')}
        </Button>
        <Button onClick={() => handleCancel()}>{t('no')}</Button>
      </div>
    </Modal>
  );
};

export default ResultModal;
