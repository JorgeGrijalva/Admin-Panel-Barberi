import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Space, InputNumber } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

const ReceptNutritions = ({ prev, loading }) => {
  const { t } = useTranslation();
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );
  return (
    <>
      <Row gutter={12}>
        <Col span={24}>
          <Form.List
            name='nutrition'
            initialValue={[
              {
                weight: undefined,
                percentage: undefined,
                en: undefined,
                ru: undefined,
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, i) => (
                  <Row gutter={12} align='middle'>
                    <Col span={7}>
                      {languages.map((item) => (
                        <Form.Item
                          key={'name' + item.id}
                          label={t('name')}
                          name={[name, item.locale]}
                          rules={[
                            {
                              validator(_, value) {
                                if (!value && item?.locale === defaultLang) {
                                  return Promise.reject(
                                    new Error(t('required'))
                                  );
                                } else if (value && value?.trim() === '') {
                                  return Promise.reject(
                                    new Error(t('no.empty.space'))
                                  );
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
                    <Col span={7}>
                      <Form.Item
                        {...restField}
                        label={t('weight')}
                        name={[name, 'weight']}
                        rules={[
                          {
                            required: true,
                            message: t('required'),
                          },
                          {
                            type: 'number',
                            min: 0,
                            message: t('must.be.positive'),
                          },
                        ]}
                      >
                        <InputNumber className='w-100' addonAfter='g' />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        {...restField}
                        label={t('percentage')}
                        name={[name, 'percentage']}
                        rules={[
                          {
                            required: true,
                            message: t('required'),
                          },
                          {
                            type: 'number',
                            min: 0,
                            max: 100,
                            message: t('must.be.between.0.and.100'),
                          },
                        ]}
                      >
                        <InputNumber className='w-100' addonAfter='%' />
                      </Form.Item>
                    </Col>
                    {i !== 0 && (
                      <Col span={3} className='d-flex justify-content-end'>
                        <Button
                          onClick={() => remove(name)}
                          danger
                          className='w-100'
                          type='primary'
                          icon={<DeleteOutlined />}
                        />
                      </Col>
                    )}
                  </Row>
                ))}

                <Form.Item>
                  <Button onClick={() => add()} block icon={<PlusOutlined />}>
                    {t('add.nutrition')}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
      <Space>
        <Button type='primary' htmlType='button' onClick={() => prev()}>
          {t('prev')}
        </Button>
        <Button type='primary' htmlType='submit' loading={loading}>
          {t('submit')}
        </Button>
      </Space>
    </>
  );
};

export default ReceptNutritions;
