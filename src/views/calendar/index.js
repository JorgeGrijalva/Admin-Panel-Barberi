import React, { useEffect } from 'react';
import ActionTypeSelection from './components/action-type-selection';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import BookingContextProvider from './provider';
import { useDispatch } from 'react-redux';
import { fetchBookingList } from 'redux/slices/booking';
import CalendarView from './components/calendar';
import ServiceViews from './components/service-views';
import AddForm from './components/add-form';
import BookingFilter from './components/filter';
import FormDetail from './components/form-detail';
import UpdateStatus from './components/update-status';

const MyCalendar = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBookingList());
  }, [dispatch]);

  return (
    <BookingContextProvider>
      <BookingFilter />
      <CalendarView />
      <ActionTypeSelection />
      <ServiceViews />
      <AddForm />
      <FormDetail />
      <UpdateStatus />
    </BookingContextProvider>
  );
};

export default MyCalendar;
