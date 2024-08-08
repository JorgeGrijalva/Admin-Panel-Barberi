import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, InputNumber, Row, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AsyncSelect } from '../../../components/async-select';
import productService from '../../../services/seller/product';

const ReceptStocks = ({ next, prev }) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const stocks = Form.useWatch('stocks', form);
  function fetchProductsStock(search) {
    const params = {
      perPage: 10,
      page: 1,
      search,
      active: 1,
    };
    return productService.getStock(params).then((res) =>
      res.data
        .filter(
          (stock) =>
            !stocks.map((item) => item?.stock_id?.value).includes(stock.id)
        )
        .map((stock) => ({
          label:
            stock.product.translation.title +
            ' ' +
            stock.extras.map((ext) => ext.value).join(', '),
          value: stock.id,
        }))
    );
  }
  return (
    <>
      <Row gutter={12}>
        <Col span={24}>
          <Form.List
            name='stocks'
            initialValue={[{ stock_id: undefined, min_quantity: undefined }]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, i) => (
                  <Row gutter={12} align='middle'>
                    <Col span={11}>
                      <Form.Item
                        {...restField}
                        label={t('stock')}
                        name={[name, 'stock_id']}
                        rules={[
                          {
                            required: true,
                            message: t('required'),
                          },
                        ]}
                      >
                        <AsyncSelect
                          fetchOptions={fetchProductsStock}
                          debounceTimeout={200}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item
                        {...restField}
                        label={t('min.quantity')}
                        name={[name, 'min_quantity']}
                        rules={[
                          {
                            required: true,
                            message: t('required'),
                          },
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
                    {i !== 0 && (
                      <Col span={2} className='d-flex justify-content-end'>
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
                    {t('add.stock')}
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
        <Button
          type='primary'
          htmlType='button'
          onClick={() => {
            form
              .validateFields(
                stocks.flatMap((stock, i) => [
                  ['stocks', i, 'stock_id'],
                  ['stocks', i, 'min_quantity'],
                ])
              )
              .then(() => {
                next();
              });
          }}
        >
          {t('next')}
        </Button>
      </Space>
    </>
  );
};

export default ReceptStocks;
