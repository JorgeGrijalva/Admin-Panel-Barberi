import moment from 'moment';
import { useTranslation } from 'react-i18next';

export default function useUserActivity(date) {
  const { t } = useTranslation();
  let currDate = moment();
  let dateToTest = moment(date);
  let hours = currDate.diff(dateToTest, 'hours');
  let minues = currDate.diff(dateToTest, 'minutes');

  if (hours > 23) {
    return moment(date).format('Do MMM, H:mm');
  }
  if (hours > 0) {
    return hours + ' ' + t('hours.ago');
  }
  return minues + ' ' + t('minutes.ago');
}
