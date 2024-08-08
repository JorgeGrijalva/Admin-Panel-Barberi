import React, { useContext } from 'react';
import { t } from 'i18next';
import { Button, Card, Empty, Typography } from 'antd';
import { BookingContext } from '../provider';
import moment from 'moment';
const { Title, Text } = Typography;

const BookingForms = () => {
  const { setIsAddForm, calculatedData, setFormDetailId } =
    useContext(BookingContext);

  const formList = calculatedData?.items?.flatMap(
    (item) => item.data.form || []
  );

  return (
    <div>
      <div className='d-flex between'>
        <Title>{t('forms')}</Title>
        <Button type='text' size='large' onClick={() => setIsAddForm(true)}>
          {t('add.form')}
        </Button>
      </div>
      {formList?.length === 0 && (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <>
                <strong>No client forms added yet.</strong> <br /> Forms will
                appear here if required by any services in the appointment or if
                added manually.
              </>
            }
          />
        </Card>
      )}
      {calculatedData?.items?.map(
        (item) =>
          item.data.form && (
            <div key={item.id}>
              {item.data.form?.map((item) => (
                <Card key={item?.id}>
                  <Text type='secondary'>
                    {moment().format('ddd Do MMM, h:mm a')}
                  </Text>

                  <Text type='success' className='ml-2'>
                    • {t('complated')}
                  </Text>
                  <Title level={4} className='mt-2'>
                    {item?.translation?.title}
                  </Title>
                  <Button onClick={() => setFormDetailId(item.id)}>
                    {t('view.form')}
                  </Button>
                </Card>
              ))}
            </div>
          )
      )}
    </div>
  );
};

export default BookingForms;
