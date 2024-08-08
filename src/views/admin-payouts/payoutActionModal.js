import React, { useState } from 'react';
import { Button, Col, Form, Input, InputNumber, Modal, Row } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setRefetch } from '../../redux/slices/menu';
import { AsyncSelect } from '../../components/async-select';
import userService from '../../services/user';
import currencyService from '../../services/currency';
import paymentService from '../../services/payment';
import { payoutService } from '../../services/payout';
import { RefetchSearch } from 'components/refetch-search';

export default function PayoutRequestModal({ data, handleCancel }) {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleFinish = (values) => {
    const payload = {
      cause: values.cause,
      price: values.price,
      created_by: values?.created_by?.value,
      payment_id: values?.payment_id?.value,
      currency_id: values?.currency_id?.value,
      answer: values.answer,
    };
    setLoading(true);
    if (data?.id) {
      payoutService
        .update(data.id, payload)
        .then(() => {
          handleCancel();
          dispatch(setRefetch(activeMenu));
        })
        .finally(() => setLoading(false));
    } else {
      payoutService
        .create(payload)
        .then(() => {
          handleCancel();
          dispatch(setRefetch(activeMenu));
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Modal
      visible={!!data}
      title={t('pay.to.seller')}
      onCancel={handleCancel}
      footer={[
        <Button key='calcel-btn' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
        <Button
          key='pay-btn'
          type='primary'
          form='form'
          htmlType='submit'
          // onClick={acceptRequest}
          loading={loading}
        >
          {data?.id ? t('edit') : t('create')}
        </Button>,
      ]}
    >
      <Form
        initialValues={{
          cause: data?.cause,
          price: data?.price,
          answer: data?.answer,
          currency_id: data?.currency && {
            value: data?.currency?.id,
            label: `${data?.currency?.title} (${data?.currency?.symbol})`,
          },
          payment_id: data?.payment && {
            value: data?.payment?.id,
            label: data?.payment?.tag,
          },
          created_by: data?.createdBy && {
            value: data?.createdBy?.id,
            label: `${data?.createdBy?.firstname} ${
              data?.createdBy?.lastname || ''
            }`,
          },
        }}
        onFinish={handleFinish}
        id='form'
        layout='vertical'
      >
        <Row gutter={24}>
          {
            <Col span={12}>
              <Form.Item
                name='created_by'
                rules={[{ required: true, message: t('required') }]}
                label={t('seller')}
              >
                <RefetchSearch
                  className='w-100'
                  placeholder={t('select.seller')}
                  fetchOptions={(search) =>
                    userService.getAll({ role: 'seller', search }).then(({ data }) => {
                      return data.map((item) => ({
                        value: item.id,
                        label: `${item.firstname} ${item.lastname || ''}`,
                        key: item.id,
                      }));
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                name='payment_id'
                rules={[{ required: true, message: t('required') }]}
                label={t('payment')}
              >
                <AsyncSelect
                  className='w-100'
                  placeholder={t('select.payment.type')}
                  fetchOptions={() =>
                    paymentService.getAll().then(({ data }) => {
                      return data
                        .filter((item) => item.active && item.tag === 'wallet')
                        .map((item) => ({
                          value: item.id,
                          label: item.tag,
                          key: item.id,
                        }));
                    })
                  }
                />
              </Form.Item>
            </Col>
          }
          <Col span={12}>
            {
              <Form.Item
                name='currency_id'
                rules={[{ required: true, message: t('required') }]}
                label={t('currency')}
              >
                <AsyncSelect
                  className='w-100'
                  placeholder={t('select.currency')}
                  fetchOptions={() =>
                    currencyService.getAll().then(({ data }) => {
                      return data
                        .filter((item) => item.active)
                        .map((item) => ({
                          value: item.id,
                          label: `${item.title} (${item.symbol || ''})`,
                          key: item.id,
                        }));
                    })
                  }
                />
              </Form.Item>
            }
            <Form.Item
              name='price'
              rules={[{ required: true, message: t('required') }]}
              label={t('price')}
            >
              <InputNumber
                className='w-100'
                placeholder={t('amount')}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='cause'
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value && value?.trim().length < 2) {
                      return Promise.reject(new Error(t('must.be.at.least.2')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              label={t('cause')}
            >
              <Input.TextArea
                showCount
                maxLength={100}
                placeholder={t('cause')}
              />
            </Form.Item>
            <Form.Item
              name='answer'
              label={t('answer')}
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value && value?.trim().length < 2) {
                      return Promise.reject(new Error(t('must.be.at.least.2')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.TextArea
                showCount
                maxLength={100}
                placeholder={t('answer')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
