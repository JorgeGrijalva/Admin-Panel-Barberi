import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Col, Form, Input, InputNumber, Modal, Row } from 'antd';
import { shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import sellerbookingService from '../../../services/seller/booking-zone';
import MediaUpload from 'components/upload';

const BookingZoneAddModal = ({ visible, handleCancel }) => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [form] = Form.useForm();
  const [image, setImage] = useState(
    activeMenu.data?.image ? [activeMenu.data?.image] : []
  );
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );
  const [loadingBtn, setLoadingBtn] = useState(false);

  const onFinish = (values) => {
    const body = {
      ...values,
      area: String(values.area),
      images: image?.map((img) => img.name),
    };
    setLoadingBtn(true);
    sellerbookingService
      .create(body)
      .then(() => {
        toast.success(t('successfully.created'));
        handleCancel();
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Modal
      title={t('add.booking.zone')}
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button
          key='ok-button'
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
          className='table_booking'
        >
          {t('confirm')}
        </Button>,
      ]}
    >
      <Form
        name='basic'
        layout='vertical'
        onFinish={onFinish}
        form={form}
        initialValues={{ active: true, ...activeMenu.data }}
      >
        <Row gutter={12}>
          <Col span={12}>
            {languages.map((item) => (
              <Form.Item
                key={'title' + item.id}
                label={t('title')}
                name={['title', item.locale]}
                rules={[
                  {
                    validator(_, value) {
                      if (!value && item?.locale === defaultLang) {
                        return Promise.reject(new Error(t('required')));
                      } else if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value && value?.trim().length < 2) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.2'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                hidden={item.locale !== defaultLang}
              >
                <Input />
              </Form.Item>
            ))}
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('area')}
              name='area'
              rules={[
                { required: true, message: t('required') },
                {
                  type: 'number',
                  min: 1,
                  message: t('must.be.at.least.1'),
                },
              ]}
            >
              <InputNumber className='w-100' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={t('image')}>
              <MediaUpload
                type='shop-galleries'
                imageList={image}
                setImageList={setImage}
                form={form}
                multiple={false}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default BookingZoneAddModal;
