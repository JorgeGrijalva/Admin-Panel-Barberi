import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Space,
  Switch,
  Tag,
  TimePicker,
} from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { BsChevronCompactDown, BsChevronCompactUp } from 'react-icons/bs';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { DayPicker } from 'react-day-picker';

const ShopDeliveryForm = ({
  onFinish,
  prev,
  form,
  lines,
  loadingBtn,
  days,
  setDays,
  setLines,
  weeks,
}) => {
  const { t } = useTranslation();
  const deleteDay = (e) => setDays(days.filter((item) => item !== e));
  const disabledDays = [
    { from: new Date(1900, 4, 18), to: new Date(moment().subtract(1, 'days')) },
  ];
  const [list, setList] = useState(true);

  const footer =
    days && days.length > 0 ? (
      <Row>
        <Tag
          style={{
            fontSize: 14,
            padding: '4px 10px',
            width: '100%',
            marginTop: '10px',
          }}
        >
          {t('Your.existing.vacations')}
        </Tag>
        <Col span={24} className='mt-2'>
          {days.slice(0, list ? 1 : days.length).map((item, index) => (
            <Space
              key={index}
              className='d-flex justify-content-between'
              style={{ borderBottom: '1px solid #4D5B75' }}
            >
              <Col span={24} style={{ fontSize: 14, marginTop: '8px' }}>
                {moment(item).format('YYYY-MM-DD')}
              </Col>
              <Col span={24}>
                <Tag
                  color='red'
                  className='cursor-pointer mt-3 mb-2'
                  style={{ fontSize: 14 }}
                  onClick={() => deleteDay(item)}
                >
                  {t('remove')}
                </Tag>
              </Col>
            </Space>
          ))}
          <Button
            className='mt-3 w-100'
            onClick={() => {
              setList(!list);
            }}
          >
            {list ? <BsChevronCompactDown /> : <BsChevronCompactUp />}
          </Button>
        </Col>
      </Row>
    ) : (
      <Tag style={{ fontSize: 14, padding: '4px 10px', width: '100%' }}>
        Please pick one or more days.
      </Tag>
    );

  const handleChange = (idx) => {
    const newLines = [...lines];
    newLines[idx] = !lines[idx];
    setLines(newLines);
  };

  const middle = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  const disabledDateTime = () => ({
    disabledHours: () => middle(0, 1),
    disabledMinutes: () => middle(0, 0),
    disabledSeconds: () => middle(0, 60),
  });
  return (
    <Form form={form} layout='vertical' onFinish={onFinish}>
      <Row gutter={12}>
        <Col span={12}>
          <Card title={t('restaurant.working.days')}>
            <Row gutter={8}>
              <Col span={24}>
                <Form.List name='working_days'>
                  {(fields) => {
                    return (
                      <div>
                        {fields.map((field, index) => (
                          <Row key={field.key} gutter={12} align='center'>
                            <Col span={7}>
                              <Form.Item name={[index, 'day']}>
                                <span>{t(weeks[index].title)}</span>
                              </Form.Item>
                            </Col>
                            {lines[field.key] ? (
                              <Col span={13} className='mt-2'>
                                <span>{t('shop.closed')}</span>
                              </Col>
                            ) : (
                              <>
                                <Col span={7}>
                                  <Form.Item
                                    rules={[
                                      {
                                        required: lines[field.key] === false,
                                      },
                                    ]}
                                    name={[index, 'from']}
                                  >
                                    <TimePicker
                                      disabledTime={disabledDateTime}
                                      picker='time'
                                      placeholder={t('start.time')}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={6}>
                                  <Form.Item
                                    rules={[
                                      {
                                        required: lines[field.key] === false,
                                      },
                                    ]}
                                    name={[index, 'to']}
                                  >
                                    <TimePicker
                                      disabledTime={disabledDateTime}
                                      picker='time'
                                      placeholder={t('end.time')}
                                    />
                                  </Form.Item>
                                </Col>
                              </>
                            )}
                            <Col span={4}>
                              <Form.Item
                                name={[index, 'disabled']}
                                valuePropName='checked'
                              >
                                <Switch
                                  checkedChildren={<CheckOutlined />}
                                  unCheckedChildren={<CloseOutlined />}
                                  checked={lines[field.key]}
                                  onChange={() => handleChange(field.key)}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        ))}
                      </div>
                    );
                  }}
                </Form.List>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title={t('restaurant.closed.days')}>
            <p>{t('restaurant.closed.days.text')}</p>
            <Form.Item rules={[{ required: false, message: t('required') }]}>
              <DayPicker
                className='datepicker'
                mode='multiple'
                disabled={disabledDays}
                min={1}
                selected={days}
                onSelect={setDays}
                footer={footer}
                showOutsideDays
              />
            </Form.Item>
          </Card>
        </Col>
        <Col span={24}>
          <Space>
            <Button type='primary' htmlType='submit' loading={loadingBtn}>
              {t('next')}
            </Button>
            <Button htmlType='submit' onClick={() => prev()}>
              {t('prev')}
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};

export default ShopDeliveryForm;
