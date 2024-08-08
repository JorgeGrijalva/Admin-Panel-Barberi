import { Alert, Button, Form, Input, Typography } from 'antd';
import React, { useContext, useState } from 'react';
import { BookingContext } from '../provider';
import { t } from 'i18next';
import bookingService from 'services/seller/booking';
const { Title } = Typography;

const UpdateNote = () => {
  const [form] = Form.useForm();
  const { service_id, calculatedData, setCalculatedData } =
    useContext(BookingContext);
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
  };

  const onFinish = (values) => {
    setLoading(true);
    bookingService
      .updateNote(service_id, values)
      .then(({ data }) => {
        handleCancel();
        setCalculatedData((prev) => ({
          ...prev,
          items: calculatedData?.items?.map((item) => {
            if (item.booking_id === Number(service_id)) {
              return { ...item, notes: data.notes };
            } else return item;
          }),
        }));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  const noteList = calculatedData?.items?.find(
    (item) => item.booking_id === Number(service_id)
  );

  return (
    <React.Fragment>
      <Title level={2}>{t('notes')}</Title>
      {noteList?.notes?.map((item) => (
        <Alert message={item} className='mb-2' />
      ))}
      <Form form={form} onFinish={onFinish} layout='vertical' className='mt-5'>
        <Form.Item name='note' rules={[{ required: true }]} label='add.note'>
          <Input.TextArea />
        </Form.Item>
        <Button htmlType='submit' type='primary' loading={loading}>
          {t('submit')}
        </Button>
      </Form>
    </React.Fragment>
  );
};

export default UpdateNote;
