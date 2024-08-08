import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Row,
  Space,
  Switch,
  Tag,
} from 'antd';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from 'components/loading';
import moment from 'moment';
import workingDays from 'services/seller/workingDays';
import closeDates from 'services/seller/closedDays';
import { useNavigate } from 'react-router-dom';
import { weeks } from 'components/shop/weeks';
import { DayPicker } from 'react-day-picker';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu } from 'redux/slices/menu';
import { fetchMyShop } from 'redux/slices/myShop';
import { BsChevronCompactDown, BsChevronCompactUp } from 'react-icons/bs';

const Delivery = ({ next, prev }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [days, setDays] = useState([]);
  const [lines, setLines] = useState(new Array(7).fill(false));
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const { myShop: shop } = useSelector((state) => state.myShop, shallowEqual);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const disabledDays = [
    { from: new Date(1900, 4, 18), to: new Date(moment().subtract(1, 'days')) },
  ];
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [list, setList] = useState(true);

  const onFinish = (values) => {
    setLoadingBtn(true);
    const closeDatesBody = {
      dates: days
        ? days.map((item) => moment(item).format('YYYY-MM-DD'))
        : undefined,
    };

    const workingDaysBody = {
      dates: values.working_days.map((item) => ({
        day: item.title,
        from: moment(item.from ? item.from : '00').format('HH:mm'),
        to: moment(item.to ? item.to : '00').format('HH:mm'),
        disabled: item.disabled,
      })),
    };
    const nextUrl = 'my-shop';

    closeDates
      .update(shop.uuid, closeDatesBody)
      .then(() => {
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(fetchMyShop());
      })
      .finally(() => setLoadingBtn(false));

    if (values.working_days.length !== 0) {
      workingDays
        .update(shop.uuid, workingDaysBody)
        .then(() => {
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          navigate(`/${nextUrl}`);
          dispatch(fetchMyShop());
        })
        .finally(() => setLoadingBtn(false));
    }
  };

  const getDays = () => {
    setLoading(true);
    closeDates.getById(shop.uuid).then((res) => {
      setDays(
        res.data.closed_dates
          .filter((date) => date.day > moment(new Date()).format('YYYY-MM-DD'))
          .map((itm) => new Date(itm.day)),
      );
    });

    workingDays
      .getById(shop.uuid)
      .then((res) => {
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
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    form.setFieldsValue({
      working_days: weeks,
    });
    if (shop.uuid) {
      getDays();
    }
  }, []);

  const deleteDay = (e) => setDays(days.filter((item) => item !== e));

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
    <>
      {!loading ? (
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <Row>
            <Col span={13}>
              <Card title={t('restaurant.working.days')}>
                <Row gutter={8}>
                  <Col span={24}>
                    <Form.List name='working_days'>
                      {(fields) => {
                        console.log('fields', fields);
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
                                            required:
                                              lines[field.key] === false,
                                          },
                                        ]}
                                        name={[index, 'from']}
                                      >
                                        <DatePicker
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
                                            required:
                                              lines[field.key] === false,
                                          },
                                        ]}
                                        name={[index, 'to']}
                                      >
                                        <DatePicker
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
            <Col span={11}>
              <Card title={t('restaurant.closed.days')}>
                <p>
                  If you can't answer the buyer's questions in time and want to
                  share this information with your buyers, you can add the dates
                  here.
                </p>
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
              </Card>
            </Col>
            <Col span={24}>
              <Space>
                <Button type='primary' htmlType='submit' loading={loadingBtn}>
                  {t('submit')}
                </Button>
                <Button htmlType='submit' onClick={() => prev()}>
                  {t('prev')}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Delivery;
