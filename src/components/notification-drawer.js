import React, { useContext } from 'react';
import { Button, Drawer, List } from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu } from 'redux/slices/menu';
import { useNavigate } from 'react-router-dom';
import notificationService from 'services/notification';
import { setParcelMode } from 'redux/slices/theme';
import { toast } from 'react-toastify';

const modelType = {
  admin: {
    parcelorder: 'parcelorder',
    order: 'order',
    blog: 'blog',
    booking: 'booking',
    shop: 'shop',
  },
  manager: {
    order: 'order',
    blog: 'blog',
    shop: 'shop',
  },
  seller: {
    order: 'order',
    booking: 'booking',
    shop: 'shop',
  },
  moderator: {
    order: 'order',
    booking: 'booking',
    shop: 'shop',
  },
  deliveryman: {
    order: 'order',
  },
  master: {
    booking: 'booking',
  },
  parcelorder: 'parcelorder', // for admin
  order: 'order', // for all roles
  blog: 'blog', // for admin and manager
  booking: 'booking', // for seller, moderator and master
  shop: 'shop', // for admin and manager
};

export default function NotificationDrawer({
  handleClose,
  visible,
  list,
  readAll,
  loading,
  paginate,
  setPaginate,
}) {
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const { theme } = useSelector((state) => state.theme, shallowEqual);
  const { direction } = useSelector((state) => state.theme.theme, shallowEqual);
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual,
  );
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeParcel = Number(settings?.active_parcel);

  const goToShow = (id, type = modelType.order, url, name, nameId) => {
    dispatch(
      addMenu({
        url,
        id: nameId,
        name: t(name),
      }),
    );
    navigate(`/${url}`);
  };

  const fetchReadAtNotification = (id) => {
    notificationService.readAt(id).then(() => {});
  };

  const handleClickNotification = (item) => {
    if (!modelType[user?.role || 'admin'].hasOwnProperty(item?.model_type)) {
      return;
    }
    const type = item?.model_type;
    const notificationId = item?.id;
    const id = item?.data?.id;
    let url = '',
      name = '',
      nameId = '';

    switch (user?.role) {
      case 'admin':
        switch (type) {
          case modelType.order:
            url = `order/details/${id}`;
            name = 'order.details';
            nameId = 'order_details';
            break;

          case modelType.parcelorder:
            if (activeParcel === 0) {
              toast.warning(
                t('first.activate.the.parcel.in.settings.permissions'),
              );
              navigate('/settings/general');
              handleClose();
              return;
            }
            if (!theme.parcelMode) {
              dispatch(setParcelMode(true));
            }
            url = `parcel-orders?parcelId=${id}`;
            name = 'parcel.orders';
            nameId = 'parcel_orders';
            break;

          case modelType.blog:
            url = `blogs?blogId=${id}`;
            name = 'blogs';
            nameId = 'blogs_02';
            break;

          case modelType.shop:
            url = `shops?shopId=${id}`;
            name = 'shops';
            nameId = 'shops';
            break;

          default:
            break;
        }
        break;

      case 'manager':
        switch (type) {
          case modelType.order:
            url = `order/details/${id}`;
            name = 'order.details';
            nameId = 'order_details';
            break;
          case modelType.blog:
            url = `blogs?blogId=${id}`;
            name = 'blogs';
            nameId = 'blogs_02';
            break;
          case modelType.shop:
            url = `shops?shopId=${id}`;
            name = 'shops';
            nameId = 'shops';
            break;
          default:
            break;
        }
        break;

      case 'seller':
        switch (type) {
          case modelType.order:
            url = `seller/order/details/${id}`;
            name = 'order.details';
            nameId = 'order_details';
            break;
          case modelType.booking:
            url = `seller/bookings?bookingId=${id}`;
            name = 'bookings';
            nameId = 'seller-bookings';
            break;
          case modelType.shop:
            url = `my-shop`;
            name = 'my.shop';
            nameId = 'my-shop';
            break;
          default:
            break;
        }
        break;

      case 'moderator':
        switch (type) {
          case modelType.order:
            url = `seller/order/details/${id}`;
            name = 'order.details';
            nameId = 'order_details';
            break;
          case modelType.booking:
            url = `seller/bookings?bookingId=${id}`;
            name = 'bookings';
            nameId = 'seller-bookings';
            break;
          case modelType.shop:
            url = `my-shop`;
            name = 'my.shop';
            nameId = 'my-shop';
            break;
          default:
            break;
        }
        break;

      case 'deliveryman':
        switch (type) {
          case modelType.order:
            url = `deliveryman/order/details/${item?.data?.order?.id}`;
            name = 'order.details';
            nameId = 'order_details';
            break;
          default:
            break;
        }
        break;

      case 'master':
        switch (type) {
          case modelType.booking:
            url = `master/calendar?notify_service_id=${id}`;
            name = 'bookings';
            nameId = 'master-bookings';
            break;
          default:
            break;
        }
        break;

      default:
        break;
    }

    if (theme.parcelMode) {
      dispatch(setParcelMode(false));
    }

    goToShow(id, type, url, name, nameId);
    fetchReadAtNotification(notificationId);
    handleClose();
  };

  const handleReadAll = () => {
    readAll().finally(() => handleClose());
  };

  return (
    <Drawer
      title={t('notifications')}
      placement={direction === 'rtl' ? 'right' : 'left'}
      closable={false}
      onClose={handleClose}
      visible={visible}
      key={'left'}
      extra={<Button onClick={handleReadAll}>{t('read.all')}</Button>}
    >
      <List
        size='small'
        itemLayout='horizontal'
        dataSource={list}
        loading={loading}
        renderItem={(item) => (
          <List.Item
            className='list-clickable'
            onClick={() => handleClickNotification(item)}
          >
            <div
              className='py-1'
              style={{
                display: 'flex',
                alignItems: 'center',
                columnGap: '10px',
              }}
            >
              {!item?.read_at && (
                <span
                  style={{
                    display: 'block',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: 'tomato',
                  }}
                />
              )}
              <span
                className='font-weight-bold'
                style={{
                  width: 'calc(100% - 15x)',
                  wordBreak: 'break-all',
                }}
              >
                {item?.title}
              </span>
            </div>
          </List.Item>
        )}
      />
      <Button
        onClick={() => setPaginate({ page: paginate.page + 1 })}
        className='w-100 mt-4'
        type='primary'
        disabled={loading}
      >
        {t('load.more')}
      </Button>
    </Drawer>
  );
}
