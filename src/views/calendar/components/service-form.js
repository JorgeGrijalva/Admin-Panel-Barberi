import React, { useContext, useState } from 'react';
import { Form } from 'antd';
import { defaultCenter } from 'configs/app-global';
import { BookingContext } from '../provider';
import servicesService from 'services/services';
import mastersService from 'services/rest/masters';
import { getMomentAdd } from 'helpers/getMomentAdd';
import ServiceFormItems from '../forms/service-form';
import bookingService from 'services/booking';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { updateBookingData } from 'redux/slices/booking';
import { useSelector } from 'react-redux';

const ServiceForm = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const {
    infoData,
    selectedSlots,
    setViewContent,
    calculatedData,
    setCalculatedData,
  } = useContext(BookingContext);
  const { defaultLang } = useSelector((state) => state.formLang);
  const { bookingList } = useSelector((state) => state.booking);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [location, setLocation] = useState(defaultCenter);
  const [value, setValue] = useState('');
  const shop = infoData?.shop;

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
  const handleEventList = () => {
    let time = getMomentAdd(selectedSlots.start, selectedService?.interval);
    if (bookingList.length > 0) {
      time = getMomentAdd(
        bookingList?.[bookingList.length - 1]?.end,
        bookingList?.[bookingList.length - 1]?.pause,
      );
      dispatch(
        updateBookingData({
          id: selectedService.id,
          pause: selectedService.pause,
          title: selectedService.translation.title,
          start: time,
          end: getMomentAdd(time, selectedService?.interval),
        }),
      );
    } else
      dispatch(
        updateBookingData({
          id: selectedService.id,
          pause: selectedService.pause,
          title: selectedService.translation.title,
          start: new Date(selectedSlots.start),
          end: time,
        }),
      );
  };
  const calculate = (data) => {
    return bookingService.calculate({
      user_id: infoData.client.value,
      payment_id: infoData.payment_id.value,
      data: data.map((item) => ({
        note: item.note,
        data: item.data,
        service_master_id: item.service_master?.id,
        service_extras: item?.service_extras,
      })),
      start_date: moment(selectedSlots?.start).format('YYYY-MM-DD HH:mm'),
    });
  };
  const onFinish = (values) => {
    let prevServices = [];
    if (calculatedData?.items)
      prevServices = calculatedData?.items?.map((item) => ({
        ...item,
        service_extras: item?.extras?.length
          ? item?.extras?.map((extra) => extra?.id)
          : undefined,
      }));
    const newServiceData = {
      note: values.note,
      data: { address: values[`address[${defaultLang}]`], ...location },
      service_master: selectedMaster?.service_master,
      service_extras: values?.extras?.length
        ? values?.extras?.map((item) => item?.value)
        : undefined,
    };
    calculate([...prevServices, newServiceData])
      .then(({ data }) => {
        form.resetFields();
        handleEventList();
        setCalculatedData(data);
        setViewContent('addService');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Form layout='vertical' form={form} onFinish={onFinish}>
      <ServiceFormItems
        shop={shop}
        form={form}
        setOpen={setViewContent}
        location={location}
        setLocation={setLocation}
        getMasterByID={getMasterByID}
        getServiceByID={getServiceByID}
        selectedService={selectedService}
        value={value}
        setValue={setValue}
        defaultLang={defaultLang}
      />
    </Form>
  );
};

export default ServiceForm;
