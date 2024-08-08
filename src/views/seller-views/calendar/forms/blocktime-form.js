import React from 'react';
import {
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  TimePicker,
  Typography,
} from 'antd';
import { t } from 'i18next';
import { DebounceSelect } from 'components/search';
import { fetchMasterList } from '../helpers';
import RepeatFormOption from './repeat-form-option';
import { shallowEqual, useSelector } from 'react-redux';

const { Title } = Typography;

const BlocktimeFormItems = ({ form }) => {
  const repeats = Form.useWatch('repeats', form);
  const { myShop } = useSelector((state) => state.myShop);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Title className='my-4' level={2}>
          {t('add.blocked.time')}
        </Title>
      </Col>
      <Col span={24}>
        {languages
          .filter((item) => item.locale === defaultLang)
          .map((item) => (
            <Form.Item
              key={'title' + item.locale}
              label={t('title')}
              name={`title[${item.locale}]`}
              rules={[
                {
                  required: item.locale === defaultLang,
                  message: t('required'),
                },
              ]}
            >
              <Input />
            </Form.Item>
          ))}
      </Col>
      <Col span={12}>
        <Form.Item
          name='master_id'
          label={t('select.master')}
          placeholder={t('select.master')}
          rules={[{ required: true, message: t('required') }]}
        >
          <DebounceSelect
            fetchOptions={() =>
              fetchMasterList({
                shop_id: myShop?.id,
              })
            }
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={t('date')}
          name='date'
          rules={[
            {
              required: true,
              message: t('required'),
            },
          ]}
        >
          <DatePicker className='w-100' />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={t('from')}
          name='from'
          rules={[
            {
              required: true,
              message: t('required'),
            },
          ]}
        >
          <TimePicker className='w-100' showTime />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={t('to')}
          name='to'
          rules={[
            {
              required: true,
              message: t('required'),
            },
          ]}
        >
          <TimePicker className='w-100' showTime />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          name='repeats'
          label={t('repeats')}
          placeholder={t('select.repeat')}
          rules={[{ required: true, message: t('required') }]}
        >
          <Select style={{ width: '100%' }}>
            <Select.Option value='dont_repeat'>
              {t('dont_repeat')}
            </Select.Option>
            <Select.Option value='day'>{t('day')}</Select.Option>
            <Select.Option value='week'>{t('week')}</Select.Option>
            <Select.Option value='month'>{t('month')}</Select.Option>
            <Select.Option value='custom'>{t('custom')}</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <RepeatFormOption type={repeats} form={form} />
      <Col span={24} style={{ flexGrow: 1 }}>
        {languages
          .filter((item) => item.locale === defaultLang)
          .map((item) => (
            <Form.Item
              key={'description' + item.locale}
              label={t('description')}
              name={`description[${item.locale}]`}
              rules={[
                {
                  required: item.locale === defaultLang,
                  message: t('required'),
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
          ))}
      </Col>
    </Row>
  );
};

export default BlocktimeFormItems;
