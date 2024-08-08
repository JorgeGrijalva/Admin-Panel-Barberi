import React, { useContext } from 'react';
import { BookingContext } from '../provider';
import numberToPrice from 'helpers/numberToPrice';
import { Button } from 'antd';
import { t } from 'i18next';

const InfoFormFooter = () => {
  const {
    calculatedData,
    infoForm,
    setCalculatedData,
    sumInterval,
    setViewContent,
  } = useContext(BookingContext);
  return (
    <div>
      <div className='w-100 d-flex between my-2'>
        <strong className='font-size-5'>Total</strong>
        <strong className='font-size-5'>
          {`${numberToPrice(calculatedData?.total_price)} (${
            sumInterval || 0
          }min)`}
        </strong>
      </div>
      <div className='w-100 d-flex gap-2'>
        <Button
          type='primary'
          className='w-100'
          onClick={infoForm.submit}
          disabled={!calculatedData?.status}
        >
          {t('checkout')}
        </Button>
        <Button
          type='danger'
          className='w-100'
          onClick={() => {
            setViewContent('');
            infoForm.resetFields();
            setCalculatedData({});
          }}
        >
          {t('cancel')}
        </Button>
      </div>
    </div>
  );
};

export default InfoFormFooter;
