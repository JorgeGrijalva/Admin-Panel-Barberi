import React from 'react';
import { useContext } from 'react';
import { BookingContext } from '../provider';
import { Avatar, Card, Empty, Typography } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
const { Title } = Typography;
const BookingActivity = () => {
  const { serviceData, service_id } = useContext(BookingContext);
  const currentService = serviceData?.find((item) => item.id == service_id);
  const isEmpty = Boolean(!currentService?.activities?.length);

  return (
    <div className='h-100'>
      <Title>{t('activities')}</Title>
      {currentService?.activities?.map((item) => (
        <Card className='mb-2' key={item.id}>
          <Card.Meta
            avatar={<Avatar src={item.user?.img} size='large' />}
            title={item.user.firstname}
            description={moment(item.created_at).format('MMMM Do YYYY, h:mm a')}
          />
          <Card.Meta description={item.note} className='mt-3' />
        </Card>
      ))}

      {isEmpty && <Empty description={t('activities.not.found')} />}
    </div>
  );
};

export default BookingActivity;
