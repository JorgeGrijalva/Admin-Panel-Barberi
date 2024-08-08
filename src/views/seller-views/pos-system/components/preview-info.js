import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Space, Spin, Table, Tag } from 'antd';
import Column from 'antd/lib/table/Column';
import { PrinterOutlined } from '@ant-design/icons';
import moment from 'moment';
import numberToPrice from 'helpers/numberToPrice';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import { GetColorName } from 'hex-color-to-color-name';
import hideNumber from 'components/hideNumber';
import hideEmail from 'components/hideEmail';
import useDemo from 'helpers/useDemo';
import { BsFillGiftFill } from 'react-icons/bs';

const ReactAppIsDemo = process.env.REACT_APP_IS_DEMO;

const PreviewInfo = ({ handleClose }) => {
  const { t } = useTranslation();
  const { cartOrder } = useSelector((state) => state.cart, shallowEqual);
  const { defaultLang } = useSelector((state) => state.formLang, shallowEqual);
  const { isDemo } = useDemo();

  const [data, setData] = useState();
  const [list, setList] = useState();

  function calculateProductsPrice() {
    return data?.details.reduce(
      (total, item) => (total += item?.total_price || 0),
      0,
    );
  }

  useEffect(() => {
    if (cartOrder) {
      const data = cartOrder?.filter((item) => !item?.parent_id)?.[0];

      setList(cartOrder?.map((item) => item?.details).flat());
      setData(data);
    }
  }, [cartOrder]);

  return (
    <Modal
      visible={!!cartOrder}
      title={t('order.created.successfully')}
      onOk={handleClose}
      onCancel={handleClose}
      footer={[
        <Button onClick={handleClose}>{t('back')}</Button>,
        <Button type='primary' onClick={() => window.print()}>
          <PrinterOutlined type='printer' />
          <span className='ml-1'>{t('print')}</span>
        </Button>,
      ]}
      width={1000}
    >
      <div className='py-4 order-preview'>
        <Card>
          <div className='d-flex justify-content-between mt-3'>
            <div>
              <h2 className='mb-1 font-weight-semibold'>
                {t('invoice')} #{data?.id}
              </h2>
              <p>{moment(data?.created_at).format('YYYY-MM-DD HH:mm')}</p>
              <address>
                <p>
                  <span>
                    {t('delivery.type')}: {data?.delivery_type}
                  </span>
                  <br />
                  {data?.delivery_type === 'point' &&
                    data?.delivery_point?.address && (
                      <>
                        <span>
                          {t('point')}:{' '}
                          {data?.delivery_point?.address?.[defaultLang]}
                        </span>
                        <br />
                      </>
                    )}{' '}
                  {data?.delivery_type === 'delivery' && (
                    <>
                      <span>
                        {t('delivery.address')}: {data?.address?.address}
                      </span>
                      <br />
                    </>
                  )}
                  <span>
                    {t('delivery.date')}: {data?.delivery_date}{' '}
                    {data?.details[0]?.delivery_time}
                  </span>
                  <br />
                  <span>
                    {t('note')}: {data?.note ?? '--'}
                  </span>
                </p>
              </address>
            </div>
            <address>
              <p>
                <span className='font-weight-semibold text-dark font-size-md'>
                  {data?.user?.firstname} {data?.user?.lastname || ''}
                </span>
                <br />
                <span>
                  {t('phone')}:{' '}
                  {data?.user?.phone
                    ? ReactAppIsDemo === 'true' || isDemo
                      ? hideNumber(data?.user?.phone)
                      : data?.user?.phone
                    : t('no.phone')}
                </span>
                <br />
                <span>
                  {t('email')}:{' '}
                  {data?.user?.email
                    ? ReactAppIsDemo === 'true' || isDemo
                      ? hideEmail(data?.user?.email)
                      : data?.user?.email
                    : t('no.email')}
                </span>
              </p>
            </address>
          </div>

          <div className='mt-4'>
            <Table
              scroll={{ x: true }}
              dataSource={list}
              pagination={false}
              className='mb-5'
            >
              <Column title='No.' dataIndex='id' key='id' />
              <Column
                title={t('product')}
                dataIndex='stock'
                key='product'
                render={(stock, row) => (
                  <Space wrap>
                    {row?.bonus && (
                      <span>
                        <BsFillGiftFill />
                      </span>
                    )}
                    <span>{stock?.product?.translation?.title}</span>
                    {stock?.extras?.map((extra) =>
                      extra.group?.type === 'color' ? (
                        <Tag key={extra?.id}>
                          {extra.group?.translation?.title}:{' '}
                          {GetColorName(extra.value?.value)}
                        </Tag>
                      ) : (
                        <Tag key={extra?.id}>
                          {extra.group?.translation?.title}:{' '}
                          {extra.value?.value}
                        </Tag>
                      ),
                    )}
                  </Space>
                )}
              />
              <Column
                title={t('quantity')}
                dataIndex='numberQuantity'
                key='numberQuantity'
                render={(_, row) => (
                  <span>
                    {row.quantity * (row.stock?.product?.interval || 1)}
                    {row?.stock?.product?.unit?.translation?.title}
                  </span>
                )}
              />

              <Column
                title={t('discount')}
                dataIndex='discount'
                key='discount'
                render={(_, row) =>
                  numberToPrice(
                    row?.stock?.discount || 0,
                    data?.currency?.symbol,
                    data?.currency?.position,
                  )
                }
              />

              <Column
                title={t('price')}
                dataIndex='total_price'
                key='total_price'
                render={(total_price) =>
                  numberToPrice(
                    total_price,
                    data?.currency?.symbol,
                    data?.currency?.position,
                  )
                }
              />
            </Table>
            <div className='d-flex justify-content-end'>
              <div className='text-right '>
                <div className='border-bottom'>
                  <p className='mb-2'>
                    <span>{t('products')}: </span>
                    {numberToPrice(
                      calculateProductsPrice(),
                      data?.currency?.symbol,
                      data?.currency?.position,
                    )}
                  </p>
                  <p>
                    {t('delivery.fee')} :{' '}
                    {numberToPrice(
                      data?.delivery_fee,
                      data?.currency?.symbol,
                      data?.currency?.position,
                    )}
                  </p>
                  <p>
                    {t('service.fee')} :{' '}
                    {numberToPrice(
                      data?.service_fee,
                      data?.currency?.symbol,
                      data?.currency?.position,
                    )}
                  </p>
                  <p>
                    {t('tax')} :{' '}
                    {numberToPrice(
                      data?.total_tax || 0,
                      data?.currency?.symbol,
                      data?.currency?.position,
                    )}
                  </p>
                  <p>
                    {t('discount')} : -
                    {numberToPrice(
                      data?.total_discount,
                      data?.currency?.symbol,
                      data?.currency?.position,
                    )}
                  </p>
                  <p>
                    {t('coupon')} : -
                    {numberToPrice(
                      data?.coupon?.price,
                      data?.currency?.symbol,
                      data?.currency?.position,
                    )}
                  </p>
                </div>
                <h2 className='font-weight-semibold mt-3'>
                  <span className='mr-1'>{t('grand.total')}: </span>
                  {numberToPrice(
                    data?.total_price,
                    data?.currency?.symbol,
                    data?.currency?.position,
                  )}
                </h2>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Modal>
  );
};

export default PreviewInfo;
