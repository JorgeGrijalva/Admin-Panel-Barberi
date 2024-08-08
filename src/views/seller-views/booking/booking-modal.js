import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Select,
  TimePicker,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'react-redux';
import sellerBooking from 'services/seller/booking';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { fetchBookingTime } from 'redux/slices/booking-time';
import { weeks } from 'components/week';
import bookingClosedDays from 'services/seller/bookingClosedDays';
import bookingWorkingDays from 'services/seller/bookingWorkingDays';
import { toast } from 'react-toastify';
import sellerBookingTable from 'services/seller/booking-table';
import { fetchSellerBookingList } from 'redux/slices/booking-list';

export default function BookingModal({ visible, handleCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);
  const { reservation_enable_for_user, reservetion_time_durations } =
    useSelector((state) => state.globalSettings.settings, shallowEqual);

  const [selectDate, setSelectDate] = useState(null);
  const [selectStartTime, setSelectStartTime] = useState(null);
  const [closedDate, setClosedDate] = useState(null);
  const [workingDays, setWorkingDays] = useState(null);
  const [disabledTime, setDisabledTime] = useState(null);
  const { data: time } = useSelector(
    (state) => state.bookingTime,
    shallowEqual
  );
  const bookingTime = workingDays?.find(
    (item) => item?.day === weeks[selectDate?.getDay()]?.title
  );
  const filter = closedDate?.map((date) => date.day);

  function disabledDate(current) {
    const a = filter?.find(
      (date) => date === moment(current).format('YYYY-MM-DD')
    );
    const b = moment().add(-1, 'days') >= current;
    if (a) {
      return a;
    } else {
      return b;
    }
  }

  const range = (start, end, timeList) => {
    const x = parseInt(start);
    const y = parseInt(end);
    const number = [...Array(24).keys()];
    for (let i = x; i <= y; i++) {
      delete number[i];
    }

    for (let i = 0; i <= timeList?.length; i++) {
      const start_time = parseInt(
        moment(timeList?.[i]?.start_date).format('HH')
      );
      const end_time =
        parseInt(moment(timeList?.[i]?.end_date).format('HH')) - 1;

      for (let j = start_time; j <= end_time; j++) {
        number[j] = j;
      }
    }

    return number;
  };

  const middle = (start, end) => {
    const x = parseInt(start);
    const y = parseInt(end);
    const number = [...Array(60).keys()];
    for (let i = x; i <= y; i++) {
      delete number[i];
    }
    return number;
  };

  const disabledDateTime = () => ({
    disabledHours: () =>
      range(
        moment(new Date()).format('DD') === moment(selectDate).format('DD')
          ? bookingTime?.from.substring(0, 2) >= moment(new Date()).format('HH')
            ? bookingTime?.from.substring(0, 2)
            : moment(new Date()).format('HH')
          : bookingTime?.from.substring(0, 2),
        bookingTime?.to.substring(0, 2),
        disabledTime
      ),
    disabledMinutes: (selectedHour) => {
      const selectedDate = moment(selectDate).format('YYYY-MM-DD');
      const disabledMinutes = [];

      disabledTime.forEach((time) => {
        const startDate = moment(time.start_date).format('YYYY-MM-DD');

        if (selectedDate === startDate) {
          const startHour = moment(time.start_date).format('HH');
          const endHour = moment(time.end_date).format('HH');
          const startMinute = moment(time.start_date).format('mm');
          const endMinute = moment(time.end_date).format('mm');

          if (selectedHour === parseInt(startHour)) {
            disabledMinutes.push(...middle(0, parseInt(startMinute)));
          }

          if (selectedHour === parseInt(endHour)) {
            disabledMinutes.push(...middle(parseInt(endMinute) + 1, 60));
          }

          if (
            selectedHour > parseInt(startHour) &&
            selectedHour < parseInt(endHour)
          ) {
            disabledMinutes.push(...middle(0, 60));
          }
        }
      });

      return disabledMinutes;
    },
  });

  const startTime = moment('01:00', 'HH').format('HH');
  const endTime =
    moment(bookingTime?.to, 'HH').format('HH') -
    moment(selectStartTime, 'HH').format('HH');
  const interval = reservetion_time_durations;
  const result = [];
  let currentTime = moment(startTime, 'HH:mm');

  while (currentTime <= moment(endTime, 'HH:mm')) {
    result.push(currentTime.format('HH:mm'));
    currentTime = currentTime.add(interval, 'minute');
  }

  const onFinish = (values) => {
    setLoadingBtn(true)
    const selectedData = moment(selectDate).format('YYYY-MM-DD');
    const start_time = moment(values.start_time).format('HH:mm');
    const end_time = moment(values.end_time);
    const result = moment(
      values.start_time.add(values.end_time, 'hours')
    ).format('HH:mm');

    const payload = {
      table_id: visible.id,
      booking_id: time[0]?.id,
      start_date: selectedData + ' ' + start_time,
      end_date: end_time ? selectedData + ' ' + result : undefined,
    };
    
    sellerBooking.create(payload).then(() => {
      toast.success(t('successfully.created'));
      handleCancel();
      dispatch(fetchSellerBookingList({shop_section_id: visible?.shop_section_id}))
    }).finally(() => {
      setLoadingBtn(false)
    });
  };

  const fetchBookingClosedDays = () => {
    bookingClosedDays.getById(myShop.uuid).then((res) => {
      setClosedDate(res.data.closed_dates);
    });
  };

  const fetchBookingWorkingDays = () => {
    bookingWorkingDays.getById(myShop.uuid).then((res) => {
      setWorkingDays(res.data.dates.length !== 0 ? res.data.dates : []);
    });
  };

  const CheckSelectDate = () => {
    setLoadingBtn(true);
    const params = {
      date_from: moment(selectDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
    };
    sellerBookingTable
      .checkTable(visible.id, params)
      .then((res) => setDisabledTime(res))
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    fetchBookingWorkingDays();
    fetchBookingClosedDays();
    dispatch(fetchBookingTime());
  }, []);

  useEffect(() => {
    if (selectDate) CheckSelectDate();
  }, [selectDate]);

  return (
    <Modal
      title={t('new.order')}
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button
          key='ok-button'
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
          className='table_booking'
        >
          {t('confirm')}
        </Button>,
      ]}
    >
      <Form
        layout='vertical'
        name='booking-modal'
        form={form}
        onFinish={onFinish}
      >
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label={t('date')}
              name='date'
              rules={[{ required: true, message: t('required') }]}
            >
              <DatePicker
                disabledDate={disabledDate}
                picker='date'
                placeholder={t('date')}
                className='w-100'
                format={'YYYY-MM-DD'}
                onChange={(e) => setSelectDate(e ? new Date(e) : null)}
                showNow={false}
              />
            </Form.Item>

            <Form.Item
              label={t('start.time')}
              name='start_time'
              rules={[{ required: true, message: t('required') }]}
            >
              <TimePicker
                disabled={!selectDate || loadingBtn}
                picker='time'
                placeholder={t('')}
                className='w-100'
                format={'HH:mm'}
                showNow={false}
                disabledTime={disabledDateTime}
                onChange={(e) => setSelectStartTime(new Date(e))}
              />
            </Form.Item>

            {reservation_enable_for_user ? (
              <Form.Item
                label={t('durations')}
                name='end_time'
                rules={[{ required: true, message: t('required') }]}
              >
                <Select disabled={!selectDate || loadingBtn}>
                  {result.map((item) => (
                    <Select.Option key={item}>{item}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              ''
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
