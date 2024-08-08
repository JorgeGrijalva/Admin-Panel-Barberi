import { t } from 'i18next';
const { useContext } = require('react');
const { BookingContext } = require('../provider');
const { Button } = require('antd');

const UpdateServiceFooter = () => {
  const { serviceForm } = useContext(BookingContext);
  return (
    <div className='d-flex gap-2'>
      <Button type='primary' className='w-100' onClick={serviceForm.submit}>
        {t('apply')}
      </Button>
    </div>
  );
};

export default UpdateServiceFooter;
