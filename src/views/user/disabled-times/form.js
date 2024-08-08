import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  TimePicker,
} from 'antd';
import {
  customRepeatTypes,
  endTypes,
  repeatsTypes,
  weekDays,
} from './disabled-time-constansts';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  fetchMasterDisabledTimesAsAdmin,
  fetchMasterDisabledTimesAsSeller,
} from 'redux/slices/disabledTimes';

function DisabledTimeForm({
  initialValues = {},
  onSubmit,
  setVisibleComponent,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu);
  const [selectedRepeatType, setSelectedRepeatType] = useState(
    initialValues?.repeats || '',
  );
  const [selectedEndType, setSelectedEndType] = useState(
    initialValues?.end_type || '',
  );
  const [selectedCustomRepeatType, setSelectedCustomRepeatType] = useState(
    initialValues?.custom_repeat_type || '',
  );
  const [loadingBtn, setLoadingBtn] = useState(false);

  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );

  const disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };

  const onFinish = (values) => {
    setLoadingBtn(true);

    const endValue =
      values.end_value !== undefined
        ? selectedEndType === 'date'
          ? moment(values?.end_value_date).format('YYYY-MM-DD')
          : values?.end_value_number
        : undefined;

    const customRepeatValues =
      selectedRepeatType === 'custom'
        ? selectedCustomRepeatType === 'week'
          ? [
              values?.custom_repeat_value?.every,
              ...values?.custom_repeat_value?.weekDays,
            ]
          : [values?.custom_repeat_value?.every]
        : undefined;

    const params = {
      ...values,
      date: moment(values?.date).format('YYYY-MM-DD'),
      from: moment(values?.from).format('HH:mm'),
      to: moment(values?.to).format('HH:mm'),
      end_value: endValue,
      can_booking: values?.can_booking ? 1 : 0,
      custom_repeat_value: customRepeatValues,
      master_id: activeMenu.data?.id,
    };
    delete params.end_value_date;
    delete params.end_value_number;

    return onSubmit(params)
      .then(() => {
        toast.success('successfully.added');
        setVisibleComponent('table');
        dispatch(
          fetchMasterDisabledTimesAsAdmin({
            master_id: activeMenu.data?.id,
          }),
        );
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  return (
    <Form initialValues={initialValues} layout='vertical' onFinish={onFinish}>
      <Row gutter={24}>
        <Divider orientation='left' plain>
          {t('overview')}
        </Divider>
        <Col span={8}>
          {languages.map((item) => (
            <Form.Item
              key={'title' + item.id}
              label={t('name')}
              name={`title[${item.locale}]`}
              rules={[
                {
                  validator(_, value) {
                    if (!value && item?.locale === defaultLang) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value && value?.length < 2) {
                      return Promise.reject(new Error(t('min.2.letters')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              hidden={item.locale !== defaultLang}
            >
              <Input />
            </Form.Item>
          ))}
        </Col>
        <Col span={8}>
          {languages.map((item) => (
            <Form.Item
              key={'description' + item.locale}
              label={t('description')}
              name={`description[${item.locale}]`}
              rules={[
                {
                  validator(_, value) {
                    if (!value && item?.locale === defaultLang) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value && value?.trim().length < 5) {
                      return Promise.reject(new Error(t('must.be.at.least.5')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              hidden={item.locale !== defaultLang}
            >
              <Input maxLength={150} />
            </Form.Item>
          ))}
        </Col>
        <Col span={8}>
          <Form.Item
            name='can_booking'
            label={t('can.booking')}
            valuePropName='can_booking'
          >
            <Switch defaultChecked={initialValues.can_booking} />
          </Form.Item>
        </Col>
        <Divider orientation='left' plain>
          {t('date')}
        </Divider>
        <Col span={8}>
          <Form.Item
            name='date'
            label={t('date')}
            rules={[{ required: true, message: t('required') }]}
          >
            <DatePicker className='w-100' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='from'
            label={t('from')}
            rules={[{ required: true, message: t('required') }]}
          >
            <TimePicker className='w-100' format={'HH:mm'} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='to'
            label={t('to')}
            rules={[{ required: true, message: t('required') }]}
          >
            <TimePicker className='w-100' format={'HH:mm'} />
          </Form.Item>
        </Col>
        <Divider orientation='left' plain>
          {t('repeat')}
        </Divider>
        <Col span={8}>
          <Form.Item
            name='repeats'
            label={t('repeats')}
            rules={[{ required: true, message: t('required') }]}
            help={
              selectedRepeatType === 'month'
                ? `Repeat on the ${moment().date()} of every month`
                : undefined
            }
          >
            <Select onChange={setSelectedRepeatType}>
              {repeatsTypes.map((item) => (
                <Select.Option key={item} value={item}>
                  {t(item)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {selectedRepeatType === 'custom' && (
          <>
            <Divider orientation='left' plain>
              {t('custom.repeat')}
            </Divider>
            <Col span={8}>
              <Form.Item label={t('every')}>
                <Row>
                  <Col span={8}>
                    <Form.Item
                      name={['custom_repeat_value', 'every']}
                      rules={[{ required: true, message: t('required') }]}
                    >
                      <InputNumber min={1} className='w-100' />
                    </Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item
                      name={['custom_repeat_type']}
                      rules={[{ required: true, message: t('required') }]}
                    >
                      <Select onChange={setSelectedCustomRepeatType}>
                        {customRepeatTypes.map((item) => (
                          <Select.Option value={item} key={item}>
                            {t(item)}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            {selectedCustomRepeatType === 'week' && (
              <Col span={8}>
                <Form.Item
                  name={['custom_repeat_value', 'weekDays']}
                  rules={[{ required: true, message: t('required') }]}
                  label={t('on.days')}
                >
                  <Select
                    mode='multiple'
                    allowClear
                    style={{ width: '100%' }}
                    placeholder='Please select'
                  >
                    {weekDays.map((item) => (
                      <Select.Option value={item} key={item}>
                        {t(item)}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
          </>
        )}
        {selectedRepeatType !== 'dont_repeat' && (
          <>
            <Divider orientation='left' plain>
              {t('ends')}
            </Divider>
            <Col span={8}>
              <Form.Item
                name='end_type'
                label={t('end.type')}
                rules={[{ required: true, message: t('required') }]}
              >
                <Select onChange={setSelectedEndType}>
                  {endTypes.map((item) => (
                    <Select.Option key={item} value={item}>
                      {t(item)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {selectedEndType === 'date' ? (
              <Col span={8}>
                <Form.Item
                  name='end_value_date'
                  label={t('end.value')}
                  rules={[{ required: true, message: t('required') }]}
                >
                  <DatePicker className='w-100' />
                </Form.Item>
              </Col>
            ) : selectedEndType === 'after' ? (
              <Col span={8}>
                <Form.Item
                  name='end_value_number'
                  label={t('occurrences')}
                  rules={[{ required: true, message: t('required') }]}
                >
                  <InputNumber min={1} className='w-100' />
                </Form.Item>
              </Col>
            ) : null}
          </>
        )}
      </Row>
      <Button type='primary' htmlType='submit' loading={loadingBtn}>
        {t('submit')}
      </Button>
    </Form>
  );
}

// function ordinalSuffix(n) {
//   let s = ['th', 'st', 'nd', 'rd'],
//     v = n % 100;
//   return n + (s[(v - 20) % 10] || s[v] || s[0]);
// }

export default DisabledTimeForm;
