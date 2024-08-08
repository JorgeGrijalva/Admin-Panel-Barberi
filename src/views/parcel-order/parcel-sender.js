import React, { useState } from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { RefetchSearch } from 'components/refetch-search';
import Map from 'components/map';
import userService from 'services/user';
import { toast } from 'react-toastify';

const ParcelSender = ({ form, next, location, setLocation }) => {
  const { t } = useTranslation();

  const [userRefetch, setUserRefetch] = useState(null);
  const [userList, setUserList] = useState([]);

  async function fetchUserList(search) {
    const params = { search, roles: 'user', 'empty-shop': 1 };
    setUserRefetch(false);
    return userService.search(params).then((res) => {
      setUserList(res.data);
      return res.data.map((item) => ({
        label: [item?.firstname, item?.lastname].join(' '),
        value: item.id,
        key: item.id,
      }));
    });
  }

  const handleChange = (item) => {
    const userData = userList.find((el) => el.id === item.value);
    form.setFieldsValue({
      username_from: [userData.firstname, userData.lastname].join(' '),
      phone_from: userData.phone,
    });
  };

  return (
    <>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label={t('user')}
            name='user_from'
            rules={[{ required: true, message: t('required') }]}
          >
            <RefetchSearch
              fetchOptions={fetchUserList}
              refetch={userRefetch}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            label={t('username')}
            name='username_from'
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
            name='phone_from'
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
                name='house_from'
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
                name='stage_from'
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
                name='room_from'
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
            name='address_from'
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
            setAddress={(value) => form.setFieldsValue({ address_from: value })}
          />
        </Col>
      </Row>
      <Space>
        <Button
          type='primary'
          htmlType='button'
          onClick={() => {
            const hasInvalidValue = Object.values(
              form.getFieldsValue([
                'user_from',
                'username_from',
                'phone_from',
                'stage_from',
                'room_from',
                'address_from',
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
export default ParcelSender;
