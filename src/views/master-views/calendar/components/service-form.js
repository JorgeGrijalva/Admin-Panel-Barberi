import React, { useContext, useState } from 'react';
import { Form } from 'antd';
import { defaultCenter } from 'configs/app-global';
import { BookingContext } from '../provider';
import servicesService from 'services/master/serviceMaster';
import { getMomentAdd } from 'helpers/getMomentAdd';
import ServiceFormItems from '../forms/service-form';
import bookingService from 'services/master/booking';
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
  const [location, setLocation] = useState(defaultCenter);
  const [value, setValue] = useState('');
  const { user } = useSelector((state) => state.auth);
  const shop = user?.invite?.shop;

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
          title: selectedService.service.translation.title,
          start: time,
          end: getMomentAdd(time, selectedService?.interval),
        }),
      );
    } else
      dispatch(
        updateBookingData({
          id: selectedService.id,
          pause: selectedService.pause,
          title: selectedService.service.translation.title,
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
      service_master: selectedService,
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
