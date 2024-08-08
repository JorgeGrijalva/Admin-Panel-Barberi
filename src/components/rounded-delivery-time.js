import moment from 'moment';

export default function RoundedTime({ time, reservetion_time_durations }) {
  const startTime = '01:00';
  const endTime = String(moment(time[0].max_time, 'HH:mm').format('HH:mm'));
  const interval = reservetion_time_durations;
  const result = [];

  let currentTime = moment(startTime, 'HH:mm');

  while (currentTime < moment(endTime, 'HH:mm')) {
    result.push(currentTime.format('HH:mm'));
    currentTime = currentTime.add(interval, 'minute');
  }

  return result;
}
