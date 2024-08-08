// import moment from 'moment';

// export const getMomentAdd = (start, interval = 0) => {
//   let type = 'minutes';
//   let number = interval / 60;
//   if (number > 1) type = 'hours';
//   else if (number > 24) {
//     type = 'days';
//     number = number / 24;
//   } else if (number > 168) {
//     type = 'weeks';
//     number = number / 168;
//   }
//   if (type === 'minutes') number = interval;
//   const date = moment(start).add(number, type).format();

//   return new Date(date);
// };

import moment from 'moment';

export const getMomentAdd = (start, interval = 0) => {
  const hours = interval / 3600;
  let unit, adjustedInterval;

  if (hours >= 168) {
    unit = 'weeks';
    adjustedInterval = hours / 168;
  } else if (hours >= 24) {
    unit = 'days';
    adjustedInterval = hours / 24;
  } else if (hours >= 1) {
    unit = 'hours';
    adjustedInterval = hours;
  } else {
    unit = 'minutes';
    adjustedInterval = interval;
  }

  const date = moment(start).add(adjustedInterval, unit).toDate();
  return date;
};
