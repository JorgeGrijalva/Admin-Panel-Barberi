import { useParams } from 'react-router-dom';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import serviceDisabledTimes from '../../../services/master/serviceDisabledTimes';
import { useDispatch, useSelector } from 'react-redux';
import { disableRefetch } from '../../../redux/slices/menu';
import DisabledTimeForm from './disabled-time-form';
import moment from 'moment';
import LanguageList from '../../../components/language-list';

function DisabledTimeEdit() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu);
  const { languages } = useSelector((state) => state.formLang);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({});

  function getLanguageFields(data) {
    if (!data) {
      return {};
    }
    const { translations = [] } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.title,
      [`description[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.description,
    }));
    return Object.assign({}, ...result);
  }

  const getDisabledTimesById = (id) => {
    setLoading(true);
    serviceDisabledTimes
      .getById(id)
      .then(({ data }) => {
        const values = {
          ...data,
          ...getLanguageFields(data),
          can_booking: Boolean(data.can_booking),
          date: moment(data.date),
          from: moment(data.from, 'HH:mm'),
          to: moment(data.to, 'HH:mm'),
        };
        if (data.end_value) {
          if (data.end_type === 'date') {
            values.end_value_date = moment(data.end_value);
          } else {
            values.end_value_number = data.end_value;
          }
        }
        if (data.repeats === 'custom') {
          values.custom_repeat_value = {};
          values.custom_repeat_value.every = data?.custom_repeat_value[0];

          if (data.custom_repeat_type === 'week') {
            values.custom_repeat_value.weekDays =
              data?.custom_repeat_value?.slice(1);
          }
        }

        setInitialValues(values);
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (payload) => {
    return serviceDisabledTimes.update(id, payload);
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      getDisabledTimesById(id);
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  return (
    <Card
      title={t('edit.disabled.time')}
      loading={loading}
      extra={<LanguageList />}
    >
      {!loading && (
        <DisabledTimeForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
        />
      )}
    </Card>
  );
}

export default DisabledTimeEdit;
