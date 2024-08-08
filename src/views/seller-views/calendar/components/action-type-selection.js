import { CalendarOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import { useContext } from 'react';
import { BookingContext } from '../provider';

const ActionTypeSelection = () => {
  const { selectedSlots, isModalOpen, setIsModalOpen, setViewContent } =
    useContext(BookingContext);
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSelectEvent = (type) => {
    setViewContent(type);
    setIsModalOpen(false);
  };
  return (
    <Modal
      title={`${moment(selectedSlots?.start)?.format('HH:mm')}`}
      visible={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={280}
      footer={null}
      className='calendar-modal'
    >
      <Button
        type='text'
        className='w-100'
        icon={<CalendarOutlined />}
        onClick={() => handleSelectEvent('addService')}
        style={{ borderRadius: 0, textAlign: 'left', fontSize: 16 }}
      >
        {t('add.booking')}
      </Button>
      <Button
        type='text'
        className='w-100'
        icon={<StopOutlined />}
        onClick={() => handleSelectEvent('blockTime')}
        style={{ borderRadius: 0, textAlign: 'left', fontSize: 16 }}
      >
        {t('add.blocked.time')}
      </Button>
    </Modal>
  );
};

export default ActionTypeSelection;
