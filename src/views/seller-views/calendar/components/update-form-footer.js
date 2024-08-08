import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, message } from 'antd';
import { t } from 'i18next';
import { useDispatch } from 'react-redux';
import { fetchSellerBookingList } from 'redux/slices/booking';
import bookingService from 'services/seller/booking';

const { useContext, useState } = require('react');
const { BookingContext } = require('../provider');
const { default: numberToPrice } = require('helpers/numberToPrice');

const Footer = () => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState();
  const { calculatedData, sumInterval, service_id, setViewContent } =
    useContext(BookingContext);

  const handleDelete = () => {
    setIsDeleting(true);
    bookingService
      .delete({ [`ids[0]`]: service_id })
      .then(() => {
        setViewContent('');
        dispatch(fetchSellerBookingList());
        message.success(t('booking.successfully.delete'));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setIsDeleting(false));
  };
  return (
    <div className='w-100 d-flex between my-2'>
      <Popconfirm
        title={t('delete.the.booking')}
        onConfirm={handleDelete}
        okText={t('yes')}
        cancelText={t('no')}
      >
        <Button loading={isDeleting} type='danger' icon={<DeleteOutlined />} />
      </Popconfirm>
      <div className='d-flex gap-2 my-2'>
        <strong className='font-size-5'>{t('total')}:</strong>
        <strong className='font-size-5 text-nowrap'>
          {`${numberToPrice(calculatedData?.total_price)} (${sumInterval}min)`}
        </strong>
      </div>
      {/* <div className='w-100 d-flex gap-2'>
        <Button
          type='primary'
          className='w-100'
          onClick={form.submit}
          disabled={!calculatedData?.status && !isUpdate}
        >
          {t('update')}
        </Button>
        <Button
          type='danger'
          className='w-100'
          onClick={() => {
            setOpen(false);
            form.resetFields();
            setCalculatedData({});
          }}
        >
          {t('close')}
        </Button>
      </div> */}
    </div>
  );
};

export default Footer;
