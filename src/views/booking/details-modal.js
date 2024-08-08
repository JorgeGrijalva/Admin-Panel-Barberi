import { useState, useEffect } from 'react';
import { Button, Card, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import BookingDetailsBody from 'components/body/booking/details-modal';
import { useQueryParams } from 'helpers/useQueryParams';
import bookingService from 'services/booking';
const BookingDetailsModal = () => {
  const { t } = useTranslation();
  const queryParams = useQueryParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const id = queryParams.values?.bookingId;

  useEffect(() => {
    if (id) {
      const fetchBooking = () => {
        setLoading(true);
        bookingService
          .getById(id)
          .then((res) => setData(res?.data))
          .catch((error) => {
            console.error(error);
          })
          .finally(() => setLoading(false));
      };

      fetchBooking();
    }
  }, [id]);

  if (!id) {
    return null;
  }

  const handleClose = () => {
    queryParams.clear();
    setData(null);
  };
  return (
    <Modal
      visible={!!id}
      onCancel={handleClose}
      title={`${t('booking.details')} #${id}`}
      footer={<Button onClick={handleClose}>{t('close')}</Button>}
      width={1000}
    >
      <Card loading={loading}>
        <BookingDetailsBody data={data} />
      </Card>
    </Modal>
  );
};
export default BookingDetailsModal;
