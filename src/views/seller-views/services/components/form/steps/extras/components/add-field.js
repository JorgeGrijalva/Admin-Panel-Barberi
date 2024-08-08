import { DebounceSelect } from 'components/search';
import { Button, Col, Modal, Row } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const ServiceFormAddFieldModal = ({
  isOpen,
  handleClose,
  handleAddField,
  fetchOptions,
}) => {
  const { t } = useTranslation();
  const [selectedService, setSelectedService] = useState([]);
  const onFinish = () => {
    if (!selectedService?.value) {
      toast.error(t('select.extra'));
      return;
    }
    handleAddField(selectedService);
  };
  return (
    <Modal
      visible={isOpen}
      onCancel={handleClose}
      footer={false}
      title={t('add.extra')}
    >
      <Row>
        <Col span={24}>
          <DebounceSelect
            fetchOptions={fetchOptions}
            allowClear={false}
            onSelect={setSelectedService}
            placeholder={t('select.extra')}
            className='w-100'
          />
        </Col>
      </Row>
      <div className='formFooterButtonsContainer mt-4'>
        <Button htmlType='button' type='primary' onClick={onFinish}>
          {t('add.extra')}
        </Button>
      </div>
    </Modal>
  );
};

export default ServiceFormAddFieldModal;
