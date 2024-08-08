import {
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
} from 'antd';
import { t } from 'i18next';
import React from 'react';
const options = [
  {
    label: 'M',
    value: 'monday',
  },
  {
    label: 'T',
    value: 'tuesday',
  },
  {
    label: 'W',
    value: 'wednesday',
  },
  {
    label: 'T',
    value: 'thursday',
  },
  {
    label: 'F',
    value: 'friday',
  },
  {
    label: 'S',
    value: 'saturday',
  },
  {
    label: 'S',
    value: 'sunday',
  },
];

const RepeatFormOption = ({ type, form }) => {
  const end_type = Form.useWatch('end_type', form);
  const every = Form.useWatch('every', form);

  if (type === 'dont_repeat') {
    return '';
  }
  if (type === 'custom') {
    return (
      <>
        <Col span={24}>
          <Form.Item name='every' label='every'>
            <Input.Group compact>
              <Form.Item name={['every', 'number']} noStyle>
                <InputNumber />
              </Form.Item>
              <Form.Item name={['every', 'type']} noStyle>
                <Select>
                  <Select.Option value='day'>{t('day')}</Select.Option>
                  <Select.Option value='week'>{t('week')}</Select.Option>
                  <Select.Option value='month'>{t('month')}</Select.Option>
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Col>
        {every?.type === 'week' && (
          <Col span={24}>
            <Form.Item name='on_days' label={t('on.days')}>
              <Checkbox.Group options={options} />
            </Form.Item>
          </Col>
        )}
        <Col span={24}>
          <Form.Item
            name='end_type'
            label={t('end')}
            placeholder={t('select.end')}
            rules={[{ required: true, message: t('required') }]}
          >
            <Select style={{ width: '100%' }}>
              <Select.Option value='never'>{t('never')}</Select.Option>
              <Select.Option value='date'>{t('date')}</Select.Option>
              <Select.Option value='after'>{t('after')}</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <EndFormItems end={end_type} />
      </>
    );
  }
  return (
    <>
      <Col span={24}>
        <Form.Item
          name='end_type'
          label={t('end')}
          placeholder={t('select.end')}
          rules={[{ required: true, message: t('required') }]}
        >
          <Select style={{ width: '100%' }}>
            <Select.Option value='never'>{t('never')}</Select.Option>
            <Select.Option value='date'>{t('date')}</Select.Option>
            <Select.Option value='after'>{t('after')}</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <EndFormItems end={end_type} />
    </>
  );
};

const EndFormItems = ({ end }) => {
  if (end === 'date') {
    return (
      <Col span={12}>
        <Form.Item name='end_value_date'>
          <DatePicker className='w-100' />
        </Form.Item>
      </Col>
    );
  }
  if (end === 'after') {
    return (
      <Col span={12}>
        <Form.Item label={t('occurrences')} name='end_value'>
          <InputNumber className='w-100' />
        </Form.Item>
      </Col>
    );
  }
  return '';
};
export default RepeatFormOption;
