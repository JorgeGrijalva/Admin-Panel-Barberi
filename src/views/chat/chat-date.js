import moment from 'moment';
import React from 'react';

const ChatDate = ({ date }) => {
  const isCurrentDay = moment(date, 'DD-MM-YYYY').isSame(moment(), 'day');

  return (
    <div
      className='chat-date'
      data-date={
        isCurrentDay ? 'Today' : moment(date, 'DD-MM-YYYY').format('D MMM')
      }
    />
  );
};

export default ChatDate;
