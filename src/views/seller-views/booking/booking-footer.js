import { Button } from 'antd';
import React, { useState } from 'react';
import BookingTableAddModal from './booking-table-add-modal';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

const BookingFooter = () => {
  const { t } = useTranslation();
  const [tableAdd, setTableAdd] = useState(null);
  const { statistics } = useSelector(
    (state) => state.bookingTable,
    shallowEqual
  );
  return (
    <footer className='booking_footer'>
      <span className='booking_footer_statics'>
        <h3>{t('table')}</h3>
        <div className='booking_text'>
          <div className='booking_circle' style={{ background: 'red' }} />
          <p>
            {t('available')} : {statistics.available}
          </p>
        </div>
        <div className='booking_text'>
          <div className='booking_circle' style={{ background: 'green' }} />
          <p>
            {t('booked')} : {statistics.booked}
          </p>
        </div>
        <div className='booking_text'>
          <div className='booking_circle' style={{ background: 'yellow' }} />
          <p>
            {t('occupied')} : {statistics.occupied}
          </p>
        </div>
      </span>

      <span className='booking_footer_add_table mr-3'>
        <Button type='primary' size='small' onClick={() => setTableAdd(true)}>
          {t('add.table')}
        </Button>
      </span>

      {tableAdd && (
        <BookingTableAddModal
          visible={tableAdd}
          handleCancel={() => setTableAdd(null)}
        />
      )}
    </footer>
  );
};

export default BookingFooter;
