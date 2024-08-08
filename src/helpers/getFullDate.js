import moment from 'moment';

export default function getFullDate(date) {
  if (date) {
    return moment(date).format('DD-MM-YYYY');
  }
  return '';
}
