import React, { useEffect } from 'react';
import {
  Button,
  Card,
  Descriptions,
  Empty,
  Form,
  Pagination,
  Spin,
} from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { fetchBookingZone, setCurrentZone } from 'redux/slices/booking-zone';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { fetchSellerBookingList } from 'redux/slices/booking-list';
import { setMenuData } from 'redux/slices/menu';

export default function OrderTabs() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { current_zone, zone, loading } = useSelector(
    (state) => state.bookingZone,
    shallowEqual
  );
  const {
    booking,
    loading: bookingListLoading,
    meta,
  } = useSelector((state) => state.bookingList, shallowEqual);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchBookingZone());
    }
  }, [activeMenu.refetch]);

  useEffect(() => {
    if (!!current_zone) {
      dispatch(
        fetchSellerBookingList({
          shop_section_id: current_zone?.id,
          page: activeMenu?.data?.page || 1,
        })
      );
    }
  }, [current_zone, activeMenu?.data?.page]);

  const handleChange = (item) => dispatch(setCurrentZone(item));

  function onChangePagination(page) {
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu?.data,  page },
      })
    );
  }

  return (
    <Card style={{ height: '100vh' }}>
      <Form layout='vertical' name='booking-form' form={form}>
        <div className='booking_tabs'>
          {loading ? (
            <Spin />
          ) : (
            zone.map((item) => (
              <Button
                type={
                  current_zone?.translation?.title === item.translation?.title
                    ? 'primary'
                    : 'text'
                }
                key={item?.id}
                onClick={() => handleChange(item)}
              >
                {item.translation?.title}
              </Button>
            ))
          )}
        </div>
        <div style={{fontSize: '16px', margin: '8px 0'}}>{t('user.bookings')}</div>
        <div style={{ overflowY: 'auto', height: '80vh' }}>
          <Spin spinning={bookingListLoading}>
            {booking && booking.length > 0 ? (
              booking?.map((booking) => (
                <Card bordered key={booking.id}>
                  <Descriptions column={1}>
                    <Descriptions.Item label={t('start.date')}>
                      {moment(booking.start_date).format('YYYY-MM-DD HH:MM')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('table')}>
                      {booking.table?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('user')}>
                      {booking?.user?.firstname} {booking?.user?.lastname}
                      {' tel: '}
                      <a href={`tel:${booking?.user?.phone}`}>
                        {' '}
                        {booking?.user?.phone}
                      </a>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('guests')}>
                      {booking.guest}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              ))
            ) : (
              <Empty />
            )}
          </Spin>
        </div>
          {booking && booking.length > 0 && (
            <div className='pt-3'>
            <Pagination
              total={meta.total}
              current={meta.current_page}
              pageSize={10}
              onChange={onChangePagination}
            />

            </div>
          )}
      </Form>
    </Card>
  );
}
