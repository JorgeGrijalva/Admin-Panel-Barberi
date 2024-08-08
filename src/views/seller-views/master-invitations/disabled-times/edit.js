import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import moment from 'moment/moment';
import { Button, Card, Space } from 'antd';
import DisabledTimeForm from './form';
import LanguageList from '../../../../components/language-list';
import { masterDisabledTimesServices } from '../../../../services/seller/master-disabled-times';

function DisabledTimeEdit({ setVisibleComponent, editId }) {
  const { t } = useTranslation();
  const { languages } = useSelector((state) => state.formLang);
  const [loading, setLoading] = useState(false);
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
    masterDisabledTimesServices
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
    return masterDisabledTimesServices.update(editId, payload);
  };

  useEffect(() => {
    getDisabledTimesById(editId);
  }, []);

  return (
    <Card
      title={t('edit.disabled.time')}
      loading={loading}
      extra={
        <Space>
          <Button onClick={() => setVisibleComponent('table')}>
            {t('back')}
          </Button>
          <LanguageList />
        </Space>
      }
    >
      {!loading && (
        <DisabledTimeForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          setVisibleComponent={setVisibleComponent}
        />
      )}
    </Card>
  );
}

export default DisabledTimeEdit;
