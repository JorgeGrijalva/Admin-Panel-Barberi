import { Button, Col, DatePicker, Drawer, Form, Radio, Row } from 'antd';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { DebounceSelect } from '../../components/search';
import { setMenuData } from '../../redux/slices/menu';
import shopService from '../../services/restaurant';

const CustomDrower = ({ handleClose, openDrower, dates, setDates }) => {
  const { t } = useTranslation();
  const { direction } = useSelector((state) => state.theme.theme, shallowEqual);
  const dispatch = useDispatch();
  const [date_from, setData_From] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [form] = Form.useForm();

  const handleSend = (values) => {
   
    dispatch(
      setMenuData({
        activeMenu,
        data: {
          shop_id: values.shop_id,
          delivery_type: values.delivery_type,
          date_from: values.date_from ? JSON.stringify(values.date_from) : null,
          date_to: values.date_to ? JSON.stringify(values.date_to) : null,
        },
      })
    );
    handleClose();
  };

  const handleClear = () => {
    dispatch(
      setMenuData({
        activeMenu,
        data: {
          shop_id: null,
          delivery_type: null,
          date_from: null,
          date_to: null,
        },
      })
    );
    form.resetFields();
  };

  async function fetchShops(search) {
    const params = { search, status: 'approved' };
    return shopService.getAll(params).then(({ data }) =>
      data.map((item) => ({
        label: item.translation?.title,
        value: item.id,
      }))
    );
  }

  const getInitialTimes = () => {
    if (!activeMenu.data?.date_from || !activeMenu.data?.date_to) {
      return {};
    }
    const date_from = JSON.parse(activeMenu.data?.date_from);
    const date_to = JSON.parse(activeMenu.data?.date_to);
    return {
      date_from: moment(date_from),
      date_to: moment(date_to),
    };
  };

  useEffect(() => {
    setData_From(activeMenu?.data?.date_from);
  }, [activeMenu?.data]);

  return (
    <Drawer
      title={t('filter')}
      placement={direction === 'rtl' ? 'left' : 'right'}
      closable={false}
      onClose={handleClose}
      visible={openDrower}
      key={'left'}
      footer={
        <Row gutter={12}>
          <Col span={12}>
            <Button
              style={{ width: '100%' }}
              type='primary'
              onClick={() => form.submit()}
            >
              {t('filter.result')}
            </Button>
          </Col>
          <Col span={12}>
            <Button
              style={{ width: '100%' }}
              type='primary'
              onClick={() => handleClear()}
            >
              {t('clear')}
            </Button>
          </Col>
        </Row>
      }
    >
      <Form
        form={form}
        onFinish={handleSend}
        layout='vertical'
        initialValues={{
          ...getInitialTimes(),
          shop_id: activeMenu.data?.shop_id,
          delivery_type: activeMenu.data?.delivery_type,
        }}
      >
        <Row gutter={4}>
          <Col span={24}>
            <Form.Item label={t('shop/restaurant')} name='shop_id'>
              <DebounceSelect
                placeholder={t('select.shop')}
                fetchOptions={fetchShops}
                style={{ minWidth: 150 }}
                allowClear={true}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={t('order.type')} name='delivery_type'>
              <Radio.Group>
                <Col>
                  <Radio value={'pickup'}> {t('pickup')}</Radio>
                </Col>
                <Col className='mt-1'>
                  <Radio value={'delivery'}> {t('delivery')}</Radio>
                </Col>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24} className='mt-2'>
            <Form.Item label={t('data.start')} name='date_from'>
              <DatePicker className='w-100' onChange={(e) => setData_From(e)} />
            </Form.Item>
            <div className='text-center'>----{t('to')}----</div>
            <Form.Item label={t('data.end')} name='date_to'>
              <DatePicker className='w-100' disabled={!date_from} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default CustomDrower;
