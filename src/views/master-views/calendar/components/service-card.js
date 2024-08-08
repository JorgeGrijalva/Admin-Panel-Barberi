import { Button, Card, Divider } from 'antd';
import numberToPrice from 'helpers/numberToPrice';
import { t } from 'i18next';
import moment from 'moment';
import { useContext } from 'react';
import bookingService from 'services/master/booking';
import { BookingContext } from '../provider';
import { EditOutlined } from '@ant-design/icons';
import { shallowEqual, useSelector } from 'react-redux';

const ServiceCard = ({ item }) => {
  const {
    setViewContent,
    serviceForm,
    service_id,
    setUpdateStatus,
    setSelectedMaster,
  } = useContext(BookingContext);
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const handleClick = (id) => {
    if (!service_id) return;
    setViewContent('updateService');
    setSelectedMaster(item);
    bookingService
      .getById(id)
      .then(({ data }) => {
        serviceForm.setFieldsValue({
          id,
          shop: {
            key: data?.shop?.id,
            value: data?.shop?.id,
            label: data?.shop?.translation?.title,
          },
          service: {
            key: data?.service_master?.service?.id,
            value: data?.service_master?.service?.id,
            label: data?.service_master?.service?.translation?.title,
          },
          extras: data?.extras?.length
            ? data?.extras?.map((item) => ({
                key: item?.service_extra_id,
                value: item?.service_extra_id,
                label: item?.translation?.title || t('N/A'),
              }))
            : [],
          master: {
            key: data?.master?.id,
            value: data?.master?.id,
            label: `${data?.master?.firstname} ${data?.master?.lastname}`,
          },
          end_date: moment(data?.end_date).utc(),
          start_date: moment(data?.start_date).utc(),
          note: data?.note,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setUpdateStatus({ status: item.status, booking_id: item.booking_id });
  };

  return (
    <Card
      className={`service-card ${
        Boolean(item.errors?.length > 0) && !service_id && 'error'
      }`}
    >
      <ul className='mb-0'>
        <li className='mb-3 flex justify-content-between gap-2'>
          <strong className='font-size-5'>
            {item.service_master?.service?.translation?.title}
          </strong>
          {/*<Button*/}
          {/*  icon={<EditOutlined />}*/}
          {/*  onClick={() => handleClick(item.booking_id)}*/}
          {/*>*/}
          {/*  {t('edit')}*/}
          {/*</Button>*/}
        </li>
        <li>{`${moment.parseZone(item.start_date).format('LT')} - ${moment
          .parseZone(item.end_date)
          .format('LT')} (${item?.service_master?.interval}min + ${
          item?.service_master?.pause
        }min processing time)`}</li>
        {/* <li>{`${item.master?.firstname} ${item.master?.lastname}`}</li> */}
        {item?.status && (
          <li className='mt-2 d-flex gap-2'>
            <span>{t('status')}:</span>
            {t(item?.status)}{' '}
            <EditOutlined
              onClick={(e) => handleEdit(e)}
              className='edit-icon'
            />
          </li>
        )}
        {item?.type && (
          <li className='mt-2 d-flex gap-2'>
            <span>{t('type')}:</span>
            {t(item?.type)}
          </li>
        )}
        <li className='mt-2 d-flex gap-2'>
          <span>{t('shop')}:</span>
          {t(item?.shop?.translation?.title)}
        </li>
        <li className='mt-2 d-flex gap-2'>
          <span>{t('master.fullname')}:</span>
          {t(item?.master?.full_name)}
        </li>
        <li className='mt-2 d-flex gap-2'>
          <span>{t('service.name')}:</span>
          {t(item?.service_master?.service?.translation?.title)}
        </li>
        {!!item?.extras?.length &&
          item?.extras?.map((extra) => (
            <li className='mt-2 d-flex gap-2'>
              <span>{t('extra')}:</span>
              {t(extra?.translation?.title)} -{' '}
              {numberToPrice(
                extra?.price,
                defaultCurrency?.symbol,
                defaultCurrency?.position,
              )}
            </li>
          ))}
        <li className='mt-2 d-flex gap-2'>
          <span>{t('client')}:</span>
          {t(item?.user?.full_name)}
        </li>
        <li className='mt-2 d-flex gap-2'>
          <span>{t('payment.type')}:</span>
          {t(item?.transaction?.payment_system?.tag || 'cash')}
        </li>
        <li className='mt-2 d-flex gap-2'>
          <span>{t('transaction.status')}:</span>
          {t(item?.transaction?.status || 'progress')}
        </li>
        <li className='mt-2 d-flex gap-2'>
          <span>{t('commission.fee')}:</span>
          {numberToPrice(
            item?.commission_fee,
            defaultCurrency?.symbol,
            defaultCurrency?.position,
          )}
        </li>
        <li className='mt-2 d-flex gap-2'>
          <span>{t('discount')}:</span>
          {numberToPrice(
            item?.discount,
            defaultCurrency?.symbol,
            defaultCurrency?.position,
          )}
        </li>
        <li className='mt-2 d-flex gap-2'>
          <span>{t('gift.cart.price')}:</span>
          {numberToPrice(
            item?.gift_cart_price,
            defaultCurrency?.symbol,
            defaultCurrency?.position,
          )}
        </li>
        <li className='mt-2 d-flex gap-2'>
          <span>{t('service.fee')}:</span>
          {numberToPrice(
            item?.service_fee,
            defaultCurrency?.symbol,
            defaultCurrency?.position,
          )}
        </li>
        <li className='mt-2 d-flex gap-2'>
          <span>{t('service.master.price')}:</span>
          {numberToPrice(
            item?.service_master.price,
            defaultCurrency?.symbol,
            defaultCurrency?.position,
          )}
        </li>
        <Divider />
        <li className='mt-2 d-flex gap-2'>
          <strong>{t('total.price')}:</strong>
          {numberToPrice(
            item?.total_price,
            defaultCurrency?.symbol,
            defaultCurrency?.position,
          )}
        </li>
        {!service_id && (
          <div className='error-list'>
            {item.errors?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </div>
        )}
      </ul>
    </Card>
  );
};

export default ServiceCard;
