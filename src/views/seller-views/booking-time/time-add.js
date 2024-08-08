import React, { useState, useEffect } from 'react';
import moment from 'moment';
import bookingWorkingDays from 'services/seller/bookingWorkingDays';
import bookingClosedDays from 'services/seller/bookingClosedDays';
import { weeks } from 'components/shop/weeks';
import BookingTimeForm from 'components/forms/booking-time-form';
import { Form } from 'antd';
import { shallowEqual, useSelector } from 'react-redux';
import sellerBookingTime from 'services/seller/booking-time';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromMenu } from 'redux/slices/menu';
import { fetchBookingTime } from 'redux/slices/booking-time';

const BookingTimeAdd = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [days, setDays] = useState([]);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [lines, setLines] = useState(new Array(7).fill(false));
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoadingBtn(true);
    const closeDatesBody = {
      dates: days
        ? days.map((item) => moment(item).format('YYYY-MM-DD'))
        : undefined,
    };

    const workingDaysBody = {
      dates: values.working_days.map((item) => ({
        day: item.title,
        from: moment(item.from ? item.from : '00').format('HH-mm'),
        to: moment(item.to ? item.to : '00').format('HH-mm'),
        disabled: item.disabled,
      })),
    };

    const workingMaxTime = {
      max_time: values.max_time,
    };
    const nextUrl = 'seller/booking/time';
    Promise.all([
      sellerBookingTime.create(workingMaxTime),
      bookingClosedDays.update(myShop.uuid, closeDatesBody),
      values.working_days.length !== 0
        ? bookingWorkingDays.update(myShop.uuid, workingDaysBody)
        : undefined,
    ]).then(() => {
      toast.success(t('successfully.updated'));
      dispatch(fetchBookingTime());
      dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
      navigate(`/${nextUrl}`);
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      working_days: weeks,
    });
  }, []);

  return (
    <BookingTimeForm
      onFinish={onFinish}
      form={form}
      lines={lines}
      loadingBtn={loadingBtn}
      days={days}
      setDays={setDays}
      setLines={setLines}
      weeks={weeks}
    />
  );
};

export default BookingTimeAdd;
