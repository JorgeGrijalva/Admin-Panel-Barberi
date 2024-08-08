import React, { useEffect, useState } from 'react';
import { BellOutlined } from '@ant-design/icons';
import NotificationDrawer from './notification-drawer';
import { Badge } from 'antd';
import notificationService from 'services/notification';
import useDidUpdate from 'helpers/useDidUpdate';
// import PushNotification from './push-notification';

const initialPerPage = 15;

export default function NotificationBar() {
  const [notificationDrawer, setNotificationDrawer] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [newNotification, setNewNotification] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginate, setPaginate] = useState({
    page: 1,
    perPage: initialPerPage,
  });

  const fetchNotificationStatistic = () => {
    notificationService.getStatistics().then((res) => {
      setNewNotification(res);
    });
  };

  const fetchNotificationList = (paginate) => {
    setLoading(true);
    const params = {
      type: 'notification',
      column: 'id',
      sort: 'desc',
      perPage: initialPerPage,
      page: 1,
      ...paginate,
    };
    notificationService
      .getAll(params)
      .then((res) => {
        console.log('fired');
        setNotificationList((prev) => [...prev, ...res?.data]);
      })
      .finally(() => setLoading(false));
  };

  const fetchReadAllNotifications = () => {
    return notificationService.readAll();
  };

  useEffect(() => {
    fetchNotificationStatistic();
    const intervalId = setInterval(fetchNotificationStatistic, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useDidUpdate(() => {
    if (paginate?.page > 1) {
      fetchNotificationList(paginate);
    }
  }, [paginate?.page]);

  const handleOpenNotificationDrawer = () => {
    fetchNotificationList(paginate);
    setNotificationDrawer(true);
  };

  const handleReadAllNotifications = () => {
    setLoading(true);
    return fetchReadAllNotifications().finally(() => setLoading(false));
  };

  const handleClose = () => {
    setNotificationDrawer(false);
    setPaginate({ page: 1, perPage: initialPerPage });
    setNotificationList([]);
  };

  const sumOfAllNotificationStatistics =
    newNotification?.new_order ||
    0 + newNotification?.new_user_by_referral ||
    0 + newNotification?.news_publish ||
    0 + newNotification?.notification ||
    0 + newNotification?.status_changed ||
    0;

  return (
    <>
      <span className='icon-button' onClick={handleOpenNotificationDrawer}>
        <Badge count={sumOfAllNotificationStatistics}>
          <BellOutlined style={{ fontSize: 20 }} />
        </Badge>
      </span>

      <NotificationDrawer
        visible={notificationDrawer}
        handleClose={handleClose}
        list={notificationList}
        readAll={handleReadAllNotifications}
        loading={loading}
        paginate={paginate}
        setPaginate={setPaginate}
      />
      {/*<PushNotification refetch={fetchNotificationList} />*/}
    </>
  );
}
