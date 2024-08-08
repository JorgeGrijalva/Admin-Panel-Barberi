import React from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import Map from 'components/map';
import { toast } from 'react-toastify';

const ParcelReceiver = ({ form, next, prev, location, setLocation }) => {
  const { t } = useTranslation();

  return (
    <>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label={t('username')}
            name='username_to'
            rules={[
              {
                required: true,
                message: t('required'),
              },
              {
                validator: (_, value) => {
                  if (value && value?.trim() === '') {
                    return Promise.reject(new Error(t('no.empty.space')));
                  } else if (value && value?.trim().length < 2) {
                    return Promise.reject(new Error(t('must.be.at.least.2')));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item
            label={t('phone')}
            name='phone_to'
            rules={[
              { required: true, message: t('required') },
              {
                type: 'number',
                max: 99999999999999999999,
                message: t('max.length.20'),
              },
            ]}
          >
            <InputNumber
              className='w-100'
              parser={(value) => parseInt(value, 10)}
              min={0}
            />
          </Form.Item>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item
                label={t('house')}
                name='house_to'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                  {
                    validator: (_, value) => {
                      if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value && value?.trim().length < 1) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.1')),
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input maxLength={10} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t('stage')}
                name='stage_to'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                  {
                    validator: (_, value) => {
                      if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value && value?.trim().length < 1) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.1')),
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input maxLength={10} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t('room')}
                name='room_to'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                  {
                    validator: (_, value) => {
                      if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value && value?.trim().length < 1) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.1')),
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input maxLength={10} />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('address')}
            name='address_to'
            rules={[
              {
                required: true,
                message: t('required'),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Map
            location={location}
            setLocation={setLocation}
            setAddress={(value) => form.setFieldsValue({ address_to: value })}
          />
        </Col>
      </Row>
      <Space>
        <Button type='default' htmlType='button' onClick={prev}>
          {t('prev')}
        </Button>
        <Button
          type='primary'
          htmlType='button'
          onClick={() => {
            const hasInvalidValue = Object.values(
              form.getFieldsValue([
                'username_to',
                'phone_to',
                'house_to',
                'stage_to',
                'room_to',
              ]),
            )
              .map(Boolean)
              .includes(false);
            if (hasInvalidValue) {
              toast.warn('fill.in.form.values');
            } else {
              next();
            }
          }}
        >
          {t('next')}
        </Button>
      </Space>
    </>
  );
};
export default ParcelReceiver;
