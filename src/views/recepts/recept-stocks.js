import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, InputNumber, Row, Space } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import productService from '../../services/product';
import { InfiniteSelect } from 'components/infinite-select';

const ReceptStocks = ({ next, prev }) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const stocks = Form.useWatch('stocks', form);
  const shop = Form.useWatch('shop_id', form);
  const [links, setLinks] = useState(null);

  function fetchProductsStock({ search, page }) {
    const params = {
      search: search?.length === 0 ? undefined : search,
      shop_id: shop.value,
      page: page,
      status: 'published',
    };
    return productService.getStock(params).then((res) => {
      setLinks(res.links);
      return res.data
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
        }));
    });
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
                        <InfiniteSelect
                          fetchOptions={fetchProductsStock}
                          debounceTimeout={200}
                          hasMore={links?.next}
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
                        ]}
                      >
                        <InputNumber min={1} className='w-100' />
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
