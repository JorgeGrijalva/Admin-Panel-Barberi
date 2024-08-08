import React, { useContext, useState } from 'react';
import { Form, Input, Spin } from 'antd';
import { BookingContext } from '../provider';
import bookingService from 'services/seller/booking';
import ServiceUpdateFormItems from '../forms/service-update-form';
import servicesService from 'services/services';
import mastersService from 'services/rest/masters';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { fetchSellerBookingList } from 'redux/slices/booking';

const UpdateService = () => {
  const dispatch = useDispatch();
  const { serviceForm, setCalculatedData, setViewContent, isLoalding } =
    useContext(BookingContext);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedMaster, setSelectedMaster] = useState(null);

  const shop = Form.useWatch('shop', serviceForm);

  const getServiceByID = (data) => {
    servicesService
      .getById(data.value)
      .then((res) => {
        setSelectedService(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getMasterByID = (data) => {
    mastersService
      .getById(data.value)
      .then(({ data }) => {
        const service_master = data?.service_masters.find(
          (item) => item.service_id === selectedService.id,
        );
        setSelectedMaster({ ...data, service_master });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onFinish = (values) => {
    const body = {
      note: values?.note,
      service_master_id: selectedMaster?.service_master?.id,
      end_date: moment(values.end_date).format('YYYY-MM-DD HH:mm'),
      start_date: moment(values.start_date).format('YYYY-MM-DD HH:mm'),
      service_extras: values?.extras?.length
        ? values?.extras?.map((item) => item.value)
        : undefined,
    };
    bookingService
      .update(values.id, body)
      .then(() => {
        setViewContent('');
        serviceForm.resetFields();
        setCalculatedData({});
        dispatch(fetchSellerBookingList({}));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Spin spinning={isLoalding}>
      <Form form={serviceForm} layout='vertical' onFinish={onFinish}>
        <Form.Item name='id' className='d-none'>
          <Input />
        </Form.Item>
        <ServiceUpdateFormItems
          form={serviceForm}
          shop={shop}
          setViewContent={setViewContent}
          getMasterByID={getMasterByID}
          getServiceByID={getServiceByID}
          selectedService={selectedService}
        />
      </Form>
    </Spin>
  );
};

export default UpdateService;
