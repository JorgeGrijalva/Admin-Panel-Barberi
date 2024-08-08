import React from 'react';
import { Alert } from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

const SubscriptionsDate = () => {
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const { t } = useTranslation();
  const { subscription } = useSelector(
    (state) => state.myShop.myShop,
    shallowEqual,
  );

  return (
    <div>
      {subscription && user?.role === 'seller' && (
        <Alert
          className='mb-2'
          message={
            <div>
              {t('your.current.subscription')}{' '}
              <span className='font-weight-bold'>{subscription?.type}</span>{' '}
              {t('will.expire.at')}{' '}
              {moment(new Date()).isBefore(subscription?.expired_at) ? (
                <span className='text-primary'>
                  {moment(subscription?.expired_at).format('YYYY-MM-DD')}
                </span>
              ) : (
                <span className='text-danger'>
                  {moment(subscription?.expired_at).format('YYYY-MM-DD')}
                </span>
              )}
            </div>
          }
          type='info'
        />
      )}
    </div>
  );
};

export default SubscriptionsDate;
