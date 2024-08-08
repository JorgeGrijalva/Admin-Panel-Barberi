import React, { useContext } from 'react';
import { Button, Modal } from 'antd';
import { Context } from '../context/context';
import { useTranslation } from 'react-i18next';

const CustomModal = ({
  text,
  click,
  loading,
  setText,
  setActive,
  setVerify,
}) => {
  const { t } = useTranslation();
  const { isModalVisible, setIsModalVisible } = useContext(Context);

  return (
    <Modal closable={false} visible={isModalVisible} footer={null} centered>
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
        <Button
          onClick={() => {
            setIsModalVisible(false);
            setText([]);
            setActive(null);
            setVerify(null);
          }}
        >
          {t('no')}
        </Button>
      </div>
    </Modal>
  );
};

export default CustomModal;
