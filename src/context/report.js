import moment from 'moment';
import React, { createContext, useState } from 'react';

export const ReportContext = createContext(undefined);

export const ReportContextProvider = ({ children }) => {
  const options = [
    {
      value: 'day',
      label: 'Day',
    },
    {
      value: 'month',
      label: 'Month',
    },
    {
      value: 'year',
      label: 'Year',
    },
  ];

  const [date_from, setDateFrom] = useState(
    moment().subtract(1, 'months').format('YYYY-MM-DD')
  );

  const [date_to, setDateTo] = useState(moment().format('YYYY-MM-DD'));
  const [by_time, setByTime] = useState('day');
  const [chart, setChart] = useState('count');
  const [chart_type, setChartType] = useState('area');
  const handleByTime = (value) => {
    setByTime(value);
  };

  const handleChart = (value) => {
    setChart(value);
  };

  const handleDateRange = (dates, dateStrings) => {
    if (dates) {
      setDateFrom(dateStrings[0]);
      setDateTo(dateStrings[1]);
    }
  };

  return (
    <ReportContext.Provider
      value={{
        options,
        handleByTime,
        date_from,
        setDateFrom,
        date_to,
        setDateTo,
        by_time,
        setByTime,
        chart,
        setChart,
        handleChart,
        chart_type,
        setChartType,
        handleDateRange,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
