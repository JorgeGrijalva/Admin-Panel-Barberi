import React from 'react';
import { Button, Col, DatePicker, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { setBookingData } from 'redux/slices/booking';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

const tabs = [
  { label: 'all', value: '1' },
  { label: 'available', value: '2' },
  { label: 'booked', value: '3' },
  { label: 'occupied', value: '4' },
];

const Filter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.booking, shallowEqual);

  const onChange = (_, dateString) => {
    dispatch(
      setBookingData({
        free_from: JSON.stringify(dateString),
      })
    );
  };

  return (
    <>
      <span className='booking_header'>
        <h2 className='booking_title'>{t('Tables')}</h2>
        <DatePicker
          showTime
          onChange={onChange}
          format='YYYY-MM-DD HH:mm'
          className='booking_date'
        />
      </span>
      <Row gutter={12}>
        {tabs.map((item, idx) => (
          <Col span={6} key={idx}>
            <Button
              type={data.current_tab === item.label ? 'primary' : ''}
              onClick={() =>
                dispatch(setBookingData({ current_tab: item.label }))
              }
              className='booking_header_button'
            >
              {t(item.label)}
            </Button>
          </Col>
        ))}
      </Row>
    </>
  );
};
export default Filter;
