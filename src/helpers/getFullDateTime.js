import moment from 'moment';

export default function getFullDateTime(date) {
  if (date) {
    return moment(date).format('DD-MM-YYYY, HH:mm');
  }
  return '';
}
