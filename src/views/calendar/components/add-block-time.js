import React, { useContext } from 'react';
import { Form } from 'antd';
import { BookingContext } from '../provider';
import moment from 'moment';
import BlocktimeFormItems from '../forms/blocktime-form';
import { masterDisabledTimesServices } from 'services/master-disabled-times';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchMasterDisabledTimesAsAdmin } from 'redux/slices/disabledTimes';

const InfoForm = () => {
  const dispatch = useDispatch();
  const { defaultLang } = useSelector((state) => state.formLang);
  const { selectedSlots, setViewContent, blocktimeForm } =
    useContext(BookingContext);

  const onFinish = (values) => {
    masterDisabledTimesServices
      .create({
        repeats: values.repeats,
        end_type: values.end_type,
        master_id: values.master_id?.value,
        to: moment(values.to).format('HH:mm'),
        custom_repeat_type: values.every?.type,
        from: moment(values.from).format('HH:mm'),
        date: moment(values.date).format('YYYY-MM-DD'),
        end_value: values.end_value || values.end_value_date,
        [`title[${defaultLang}]`]: values[`title[${defaultLang}]`],
        custom_repeat_value: values.on_days &&
          values.every?.number && [values.every?.number, ...values.on_days],
        [`description[${defaultLang}]`]: values[`description[${defaultLang}]`],
      })
      .then(() => {
        setViewContent('');
        dispatch(fetchMasterDisabledTimesAsAdmin({ perPage: 100 }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Form
      form={blocktimeForm}
      layout='vertical'
      onFinish={onFinish}
      initialValues={{
        date: moment(),
        end_type: 'never',
        repeats: 'dont_repeat',
        from: moment(selectedSlots?.start, 'HH:mm:ss'),
        to: moment(selectedSlots?.end, 'HH:mm:ss'),
        every: { type: 'day', number: 1 },
      }}
    >
      <BlocktimeFormItems form={blocktimeForm} />
    </Form>
  );
};

export default InfoForm;
