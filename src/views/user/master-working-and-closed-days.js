import { useTranslation } from 'react-i18next';
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
import { shallowEqual, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { BsChevronCompactDown, BsChevronCompactUp } from 'react-icons/bs';
import { weeks } from '../../components/shop/weeks';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { DayPicker } from 'react-day-picker';
import { masterClosedDaysServices } from '../../services/master-closed-days';
import masterWorkingDaysService from '../../services/master-working-days';

const MasterClosedDays = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const deleteDay = (e) => setDays(days.filter((item) => item !== e));
  const disabledDays = [
    { from: new Date(1900, 4, 18), to: new Date(moment().subtract(1, 'days')) },
  ];
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const masterId = activeMenu?.data?.id;
  const [list, setList] = useState(true);
  const [days, setDays] = useState([]);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lines, setLines] = useState(new Array(7).fill(false));

  const fetchClosedDays = () =>
    masterClosedDaysServices.getById(masterId).then((res) => {
      const parsedDays = res.data.closed_dates.map(
        (item) => new Date(item.date),
      );
      setDays(parsedDays);
    });
  const fetchWorkingDays = () => {
    return masterWorkingDaysService.getById(masterId).then((res) => {
      setLines(
        res.data.dates.length !== 0
          ? res.data.dates.map((item) => item.disabled)
          : [],
      );

      res.data.dates.length !== 0 &&
        form.setFieldsValue({
          working_days: res.data.dates.map((item) => ({
            title: item.day,
            from: moment(item.from, 'HH:mm:ss'),
            to: moment(item.to, 'HH:mm:ss'),
            disabled: Boolean(item.disabled),
          })),
        });
    });
  };

  const getDays = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchClosedDays(), fetchWorkingDays()]);
    } finally {
      setLoading(false);
    }
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

  const handleChange = (idx) => {
    const newLines = [...lines];
    newLines[idx] = !lines[idx];
    setLines(newLines);
  };

  const onFinish = (values) => {
    setLoadingBtn(true);

    const workingDaysBody = {
      dates: values.working_days.map((item) => ({
        day: item.title,
        from: moment(item.from ? item.from : '00').format('HH:mm'),
        to: moment(item.to ? item.to : '00').format('HH:mm'),
        disabled: item.disabled,
      })),
    };

    const closedDaysParam = {
      dates: days
        ? days.map((day) => moment(day).format('YYYY-MM-DD'))
        : undefined,
      master_id: masterId,
    };

    Promise.all([
      masterClosedDaysServices.update(masterId, closedDaysParam),
      masterWorkingDaysService.update(masterId, workingDaysBody),
    ])
      .then((res) => {
        toast.success(t('successfully.created'));
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    getDays().then();
  }, []);

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

  useEffect(() => {
    form.setFieldsValue({ working_days: weeks });
  }, []);

  return (
    <Card loading={loading}>
      <Form onFinish={onFinish} form={form}>
        <Row gutter={12}>
          <Col span={12}>
            <Card title={t('master.working.days')}>
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
            </Card>
          </Col>
          <Col span={12}>
            <Card title={t('master.closed.days')}>
              <p>{t('restaurant.closed.days.text')}</p>
              {!loading && (
                <Form.Item
                  rules={[{ required: false, message: t('required') }]}
                >
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
              )}
            </Card>
          </Col>
        </Row>
        <Button type='primary' htmlType='submit' loading={loadingBtn}>
          {t('submit')}
        </Button>
      </Form>
    </Card>
  );
};

export default MasterClosedDays;
