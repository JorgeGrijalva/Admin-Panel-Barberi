import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu, setMenuData } from '../../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import sellerBookingTable from '../../../services/seller/booking-table';
import sellerBookingZone from '../../../services/seller/booking-zone';
import { AsyncSelect } from 'components/async-select';
import { DebounceSelect } from 'components/search';

const BookingTableAdd = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const onFinish = (values) => {
    console.log('value', values);
    const body = {
      ...values,
      chair_count: String(values.chair_count),
      shop_section_id: values.shop_section_id.value,
    };
    setLoadingBtn(true);
    const nextUrl = 'seller/booking/tables';
    sellerBookingTable
      .create(body)
      .then(() => {
        toast.success(t('successfully.created'));
        navigate(`/${nextUrl}`);
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
      })
      .finally(() => setLoadingBtn(false));
  };

  function fetchZone(search) {
    return sellerBookingZone.getAll({ search }).then((res) =>
      res.data.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
      }))
    );
  }

  return (
    <Card title={t('add.booking.table')}>
      <Form
        name='basic'
        layout='vertical'
        onFinish={onFinish}
        form={form}
        initialValues={{ active: true, ...activeMenu.data }}
      >
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label={t('zona')}
              name={'shop_section_id'}
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <DebounceSelect fetchOptions={fetchZone} debounceTimeout={300} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label='name'
              name={`name`}
              rules={[{ required: true, message: '' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t('chair.count')}
              name='chair_count'
              rules={[{ required: true, message: t('required') }]}
            >
              <InputNumber className='w-100' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('tax')}
              name='tax'
              rules={[{ required: true, message: t('required') }]}
            >
              <InputNumber className='w-100' />
            </Form.Item>
          </Col>
        </Row>
        <Button type='primary' htmlType='submit' loading={loadingBtn}>
          {t('submit')}
        </Button>
      </Form>
    </Card>
  );
};

export default BookingTableAdd;
