import React, { useContext, useEffect, useState } from 'react';
import { Form, Spin } from 'antd';
import { BookingContext } from '../provider';
import moment from 'moment';
import BlocktimeFormItems from '../forms/blocktime-form';
import { masterDisabledTimesServices } from 'services/master-disabled-times';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchMasterDisabledTimesAsAdmin } from 'redux/slices/disabledTimes';
import disabledTimes from 'services/master/serviceDisabledTimes';
import getTranslationFields from 'helpers/getTranslationFields';

const UpdateBlockTime = () => {
  const dispatch = useDispatch();
  const { languages } = useSelector((state) => state.formLang);
  const { setViewContent, disabled_slot_id, blocktimeForm } =
    useContext(BookingContext);
  const [spinning, setSpinning] = useState(false);

  const onFinish = (values) => {
    masterDisabledTimesServices
      .update(disabled_slot_id, {
        repeats: values.repeats,
        end_type: values.end_type,
        master_id: values.master_id?.value,
        to: moment(values.to).format('HH:mm'),
        custom_repeat_type: values.every?.type,
        from: moment(values.from).format('HH:mm'),
        date: moment(values.date).format('YYYY-MM-DD'),
        end_value: values.end_value?.toString() || values.end_value_date,
        title: getTranslationFields(languages, values),
        description: getTranslationFields(languages, values, 'description'),
        custom_repeat_value: values.on_days &&
          values.every?.number && [values.every?.number, ...values.on_days],
      })
      .then(() => {
        setViewContent('');
        dispatch(fetchMasterDisabledTimesAsAdmin({ perPage: 100 }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function getLanguageFields(data) {
    if (!data?.translations) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.title,
      [`description[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.description,
    }));
    return Object.assign({}, ...result);
  }

  useEffect(() => {
    if (disabled_slot_id) {
      setSpinning(true);
      disabledTimes
        .getById(disabled_slot_id)
        .then(({ data }) => {
          const body = {
            master_id: {
              label: `${data?.master?.firstname || ''} ${
                data?.master?.lastname || ''
              }`,
              value: data?.master?.id,
              key: data?.master?.id,
            },
            every: {
              type: data.custom_repeat_type,
              number: data.custom_repeat_value?.[0],
            },
            on_days: data.custom_repeat_value?.filter(
              (item, index) => index !== 0
            ),
            repeats: data.repeats,
            end_type: data.end_type,
            end_value: data.end_value,
            date: moment(data.date, 'YYYY-MM-DD'),
            end_value_date:
              data.end_type === 'date'
                ? moment(data.end_value.replace(/\"/g, ''), 'YYYY-MM-DD')
                : '',
            from: moment(data?.from, 'HH:mm:ss'),
            to: moment(data?.to, 'HH:mm:ss'),
            ...getLanguageFields(data),
          };

          blocktimeForm.setFieldsValue(body);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => setSpinning(false));
    }
  }, [disabled_slot_id]);

  return (
    <Spin spinning={spinning}>
      <Form form={blocktimeForm} layout='vertical' onFinish={onFinish}>
        <BlocktimeFormItems form={blocktimeForm} />
      </Form>
    </Spin>
  );
};

export default UpdateBlockTime;
