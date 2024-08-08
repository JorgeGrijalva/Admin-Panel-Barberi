import React, { useContext } from 'react';
import { BookingContext } from '../provider';
import { Descriptions, Modal } from 'antd';
import { t } from 'i18next';

const FormDetail = () => {
  const { formDetailId, setFormDetailId, calculatedData } =
    useContext(BookingContext);

  const handleCancel = () => {
    setFormDetailId(null);
  };
  const formDetail = calculatedData?.items
    ?.flatMap((item) => item.data.form || [])
    .find((item) => item.id === formDetailId);

  return (
    <Modal
      footer={null}
      visible={formDetailId}
      onCancel={handleCancel}
      title={t('form.detail')}
    >
      <Descriptions title={formDetail?.translation?.title} layout='vertical'>
        {formDetail?.data?.map((item, id) =>
          item.answer_type === 'yes_or_no' ? (
            <Descriptions.Item key={id} label={item.question} span={12}>
              {item?.user_answer?.map((item) => (item ? t('yes') : t('no')))}
            </Descriptions.Item>
          ) : (
            <Descriptions.Item key={id} label={item.question} span={12}>
              {item?.user_answer?.map((item) =>
                item.answer_type === 'yes_or_no' ? (
                  <div className='ml-1'>{item}</div>
                ) : (
                  <div className='ml-1'>{item}</div>
                )
              )}
            </Descriptions.Item>
          )
        )}
      </Descriptions>
    </Modal>
  );
};

export default FormDetail;
