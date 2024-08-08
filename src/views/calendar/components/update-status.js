import { Button, Form, Modal, Select } from 'antd';
import { useContext } from 'react';
import { BookingContext } from '../provider';
import { t } from 'i18next';
import bookingService from 'services/booking';

const UpdateStatus = () => {
  const [form] = Form.useForm();
  const { updateStatus, setUpdateStatus, setCalculatedData } =
    useContext(BookingContext);

  const handleCancel = () => {
    setUpdateStatus(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    bookingService
      .changeStatus(updateStatus.booking_id, values)
      .then(({ data }) => {
        handleCancel();
        setCalculatedData((prev) => ({
          ...prev,
          items: prev.items.map((item) => ({
            ...item,
            status:
              item.booking_id === updateStatus.booking_id
                ? data.status
                : item.status,
          })),
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Modal
      title={t('update.status')}
      visible={updateStatus}
      onCancel={handleCancel}
      width={280}
      footer={null}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout='vertical'
        initialValues={{ status: updateStatus?.status }}
      >
        <Form.Item name='status' rules={[{ required: true }]} label='status'>
          <Select>
            <Select.Option value='new'>{t('new')}</Select.Option>
            <Select.Option value='canceled'>{t('canceled')}</Select.Option>
            <Select.Option value='booked'>{t('booked')}</Select.Option>
            <Select.Option value='progress'>{t('progress')}</Select.Option>
            <Select.Option value='ended'>{t('ended')}</Select.Option>
          </Select>
        </Form.Item>
        <Button htmlType='submit' type='primary'>
          {t('submit')}
        </Button>
      </Form>
    </Modal>
  );
};

export default UpdateStatus;
