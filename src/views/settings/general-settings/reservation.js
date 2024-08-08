import { Button, Card, Col, Form, InputNumber, Row, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { setMenuData } from '../../../redux/slices/menu';
import settingService from '../../../services/settings';
import { fetchSettings as getSettings } from '../../../redux/slices/globalSettings';
import { Time } from './deliveryman_time';

const Reservation = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateSettings(data) {
    setLoadingBtn(true);
    settingService
      .update(data)
      .then(() => {
        toast.success(t('successfully.updated'));
        dispatch(getSettings());
      })
      .finally(() => setLoadingBtn(false));
  }

  const onFinish = (values) => updateSettings(values);

  return (
    <Form
      layout='vertical'
      form={form}
      name='global-settings'
      onFinish={onFinish}
      initialValues={{
        ...activeMenu.data,
      }}
    >
      <Card title={t('Reservation')}>
        <Row gutter={12}>
          <Col span={12}>
          <Form.Item
            label={t('reservetion_time_durations')}
            name='reservetion_time_durations'
          >
            <Select options={Time} />
          </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('reservation_before_time')}
              name='reservation_before_time'
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value < 0 || value > 59) {
                      return Promise.reject(
                        new Error(t('must.be.between.0.and.59'))
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber addonAfter={t('hour')} className='w-100' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('notification_time_before')}
              name='notification_time_before'
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value < 0 || value > 59) {
                      return Promise.reject(
                        new Error(t('must.be.between.0.and.59'))
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber addonAfter={t('minut')} className='w-100' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('min_reservation_time')}
              name='min_reservation_time'
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value < 0 || value > 59) {
                      return Promise.reject(
                        new Error(t('must.be.between.0.and.59'))
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber addonAfter={t('hour')} className='w-100' />
            </Form.Item>
          </Col>
        </Row>
        <Button
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
        >
          {t('save')}
        </Button>
      </Card>
    </Form>
  );
};

export default Reservation;
