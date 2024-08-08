import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  InputNumber,
  Row,
  Space,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, shallowEqual } from 'react-redux';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { GetColorName } from 'hex-color-to-color-name';
import productService from 'services/product';
import { useParams } from 'react-router-dom';
import RiveResult from 'components/rive-result';

const { Panel } = Collapse;

const panelHeaderHTML = (stock) => {
  return (
    <div>
      <p hidden={!stock?.extras?.length}>
        {stock?.extras?.map((extra) =>
          extra?.group?.type === 'color' ? (
            <div
              key={extra?.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                columnGap: '5px',
              }}
            >
              {extra.group?.translation?.title}:{' '}
              {GetColorName(extra?.value?.value)} (
              <span
                style={{
                  display: 'block',
                  width: '15px',
                  height: '15px',
                  backgroundColor: `${extra?.value?.value}`,
                  borderRadius: '50%',
                  border: '1px solid #ccc',
                }}
              />
              )
            </div>
          ) : (
            <div key={extra?.id}>
              {extra.group?.translation?.title}: {extra.value?.value}
            </div>
          ),
        )}
      </p>
    </div>
  );
};

function Wholesale({ prev, next }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { uuid } = useParams();

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const hasAnyExtras = activeMenu?.data?.stocksData?.some(
    (stock) => !!stock?.extras?.length,
  );

  const stocks = activeMenu.data?.stocksData || [];
  const minQuantity = !!activeMenu.data?.min_qty ? activeMenu.data?.min_qty : 1;
  const maxQuantity = !!activeMenu.data?.max_qty ? activeMenu.data?.max_qty : 1;

  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const fetchProduct = () => {
    setLoading(true);
    productService
      .getById(uuid)
      .then((res) => {
        const extras = res?.data?.stocks?.map((item) => ({
          [item?.id]: item?.whole_sale_prices,
        }));

        form.setFieldsValue(Object.assign({}, ...extras));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const onFinish = (values) => {
    if (!hasAnyExtras) return next();

    setLoadingBtn(true);
    const extras = stocks?.map((stock) => {
      const whole_sales = values?.[stock?.id] || [];

      return {
        ids: stock?.extras?.map((extra) => extra?.extra_value_id),
        galleries: stock?.galleries,
        price: stock?.price,
        quantity: stock?.quantity,
        stock_id: stock?.id,
        whole_sales,
      };
    });

    productService
      .stocks(uuid, { extras })
      .then(() => next())
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Card loading={loading}>
      <Form form={form} layout='vertical' onFinish={onFinish}>
        {hasAnyExtras ? (
          <Collapse>
            {stocks.map((stock) => {
              const formListName = stock?.id;

              return (
                <Panel header={panelHeaderHTML(stock)} key={stock?.id}>
                  <Form.List name={formListName} key={stock?.id}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }, index) => {
                          const prevMaxQuantity = form.getFieldValue([
                            formListName,
                            fields[index - 1]?.name,
                            'max_quantity',
                          ]);

                          return (
                            <Row gutter={12} key={index}>
                              <Col span={7}>
                                <Form.Item
                                  {...restField}
                                  label={t('min.quantity')}
                                  name={[name, 'min_quantity']}
                                  rules={[
                                    { required: true, message: t('required') },
                                    {
                                      validator(_, value) {
                                        if (
                                          !!value &&
                                          (value <= prevMaxQuantity ||
                                            value > maxQuantity ||
                                            value <= 0)
                                        ) {
                                          return Promise.reject(
                                            new Error(
                                              `${t('must.be.between')} ${
                                                prevMaxQuantity || minQuantity
                                              } ${t('and')} ${maxQuantity}`,
                                            ),
                                          );
                                        }
                                        return Promise.resolve();
                                      },
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    className='w-100'
                                    step={activeMenu.data?.interval || 1}
                                    // min={minQuantity}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={7}>
                                <Form.Item
                                  {...restField}
                                  label={t('max.quantity')}
                                  name={[name, 'max_quantity']}
                                  rules={[
                                    { required: true, message: t('required') },
                                    {
                                      validator(_, value) {
                                        const minQuantityInput =
                                          form.getFieldValue([
                                            formListName,
                                            name,
                                            'min_quantity',
                                          ]);

                                        if (
                                          !!value &&
                                          (value <= minQuantityInput ||
                                            value > maxQuantity ||
                                            value <= 0)
                                        ) {
                                          return Promise.reject(
                                            new Error(
                                              `${t('must.be.between')} ${
                                                minQuantityInput || minQuantity
                                              } ${t('and')} ${maxQuantity}`,
                                            ),
                                          );
                                        }
                                        return Promise.resolve();
                                      },
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    className='w-100'
                                    step={activeMenu.data?.interval || 1}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  label={t('price')}
                                  name={[name, 'price']}
                                  rules={[
                                    {
                                      required: true,
                                      message: t('required'),
                                    },
                                    {
                                      type: 'number',
                                      min: 0,
                                      message: t('must.be.positive.number'),
                                    },
                                    {
                                      type: 'number',
                                      max: 999999999999999,
                                      message: t('max.15.digits'),
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    className='w-100'
                                    parser={(value) => parseInt(value, 10)}
                                  />
                                </Form.Item>
                              </Col>
                              <Col
                                span={2}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'end',
                                }}
                              >
                                <Button
                                  onClick={() => {
                                    remove(name);
                                  }}
                                  danger
                                  type='primary'
                                  icon={<DeleteOutlined />}
                                  disabled={fields?.length !== index + 1}
                                />
                              </Col>
                            </Row>
                          );
                        })}
                        <Form.Item>
                          <Button
                            onClick={() => {
                              add();
                            }}
                            type='dashed'
                            icon={<PlusOutlined />}
                            block
                          >
                            {t('add')}
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Panel>
              );
            })}
          </Collapse>
        ) : (
          <RiveResult />
        )}
        <Space className='mt-4'>
          <Button onClick={prev}>{t('prev')}</Button>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('next')}
          </Button>
        </Space>
      </Form>
    </Card>
  );
}

export default Wholesale;
