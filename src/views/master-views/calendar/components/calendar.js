import { Card, Spin } from 'antd';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useSelector } from 'react-redux';
import bookingService from 'services/master/booking';
import { BookingContext } from '../provider';
import { useNavigate } from 'react-router-dom';
import { fetchMasterDisabledTimes } from 'redux/slices/disabledTimes';
import { useDispatch } from 'react-redux';
import { useQueryParams } from 'helpers/useQueryParams';

const CalendarView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localizer = momentLocalizer(moment); // or globalizeLocalizer
  const { bookingList, loading } = useSelector((state) => state.booking);
  const { disabledTimes } = useSelector((state) => state.disabledTimes);
  const queryParams = useQueryParams();

  const {
    infoForm,
    setIsLoading,
    setViewContent,
    setIsModalOpen,
    setSelectedSlots,
    setCalculatedData,
    setServiceData,
  } = useContext(BookingContext);

  const showModal = ({ start, end }) => {
    setIsModalOpen(true);
    setSelectedSlots({ start, end });
  };

  useEffect(() => {
    if (queryParams.values?.notify_service_id) {
      const event = {
        id: queryParams.values?.notify_service_id,
        parent_id: queryParams.values?.notify_service_id,
      };
      handleSelectEvent(event);
    }
  }, [queryParams.values?.notify_service_id]);

  const calculate = (data, items) => {
    bookingService
      .calculate({
        user_id: data.user_id,
        payment_id: data.payment_id,
        data: items.map((item) => ({
          data: item.data,
          note: item.note,
          service_master_id: item.service_master.id,
        })),
        start_date: moment.utc(data?.start).format('YYYY-MM-DD HH:mm'),
        ids: data.ids,
      })
      .then(({ data }) => {
        const newItems = data.items.map((item, index) => ({
          ...item,
          ...items[index],
          booking_id: items[index].id,
          status: items[index].status,
          type: items[index].type,
          notes: items[index].notes,
        }));
        setCalculatedData({ ...data, items: newItems });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  const handleSelectEvent = useCallback((event) => {
    if (event.disabled) {
      setViewContent('updateBlockTime');
      navigate(`?disabled_slot_id=${event.id}`);
      return;
    }
    setViewContent('updateForm');
    setIsLoading(true);
    navigate(`?service_id=${event.id}`);
    bookingService
      .getBookingById(event.parent_id)
      .then(({ data }) => {
        setServiceData(data);
        setSelectedSlots({
          start: data[data?.length - 1].start_date,
          end: data[data?.length - 1].end_date,
        });
        calculate(
          {
            user_id: data[0]?.user_id,
            start: data[0]?.start_date,
            payment_id: data[0]?.transaction?.payment_system?.id,
            ids: data.map((item) => item.id),
          },
          data,
        );
        infoForm.setFieldsValue({
          id: event.parent_id,
          shop: {
            label: data[0]?.shop?.translation?.title,
            value: data[0]?.shop?.id,
            key: data[0]?.shop?.id,
          },
          client: {
            label: `${data[0]?.user?.firstname} ${data[0]?.user?.lastname}`,
            value: data[0]?.user?.id,
            key: data[0]?.user?.id,
          },
          payment_id: {
            label: data[0]?.transaction?.payment_system?.tag || 'cash',
            value: data[0]?.transaction?.payment_system?.id,
            key: data[0]?.transaction?.payment_system?.id,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(),
    }),
    [],
  );

  const eventStyleGetter = (event, start, end, isSelected) => {
    if (event.disabled)
      return {
        className: 'disabled-slot',
      };
    else return '';
  };

  useEffect(() => {
    dispatch(fetchMasterDisabledTimes({ perPage: 100 }));
  }, [dispatch]);

  return (
    <Card className='h-100'>
      <Spin spinning={loading}>
        <Calendar
          localizer={localizer}
          startAccessor='start'
          endAccessor='end'
          defaultDate={defaultDate}
          events={[...bookingList, ...disabledTimes]}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={showModal}
          selectable
          scrollToTime={scrollToTime}
          timeslots={3}
          step={30}
          defaultView='day'
          eventPropGetter={eventStyleGetter}
        />
      </Spin>
    </Card>
  );
};

export default CalendarView;
