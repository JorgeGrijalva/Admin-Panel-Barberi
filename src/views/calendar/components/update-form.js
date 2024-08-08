import React, { useContext } from 'react';
import { Form, Input, Spin } from 'antd';
import { BookingContext } from '../provider';
import UpdateFormItems from '../forms/info-form';
import bookingService from 'services/booking';

const UpdateForm = () => {
  const {
    infoForm,
    setCalculatedData,
    setIsUpdate,
    setOpenService,
    isLoalding,
    calculatedData,
  } = useContext(BookingContext);

  const client = Form.useWatch('client', infoForm);
  const payment_id = Form.useWatch('payment_id', infoForm);

  const onFinish = (values) => {
    const body = {
      user_id: values.client.value,
      payment_id: values.payment_id.value,
      data: calculatedData?.items.map((item) => ({
        note: item.note,
        data: item.data,
        service_master_id: item.service_master?.id,
      })),
      start_date: calculatedData?.start_date,
    };
    bookingService
      .update(values.id, body)
      .then(() => {
        setIsUpdate(false);
        infoForm.resetFields();
        setCalculatedData({});
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Spin spinning={isLoalding}>
      <Form form={infoForm} layout='vertical' onFinish={onFinish}>
        <Form.Item name='id' className='d-none'>
          <Input />
        </Form.Item>
        <UpdateFormItems
          title='update.booking'
          setOpenService={setOpenService}
          isDisabled={!(client && payment_id)}
        />
      </Form>
    </Spin>
  );
};

export default UpdateForm;
