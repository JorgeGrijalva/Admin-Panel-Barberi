import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Select,
  Space,
  Spin,
  InputNumber,
} from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CloseOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import userService from 'services/user';
import { isArray } from 'lodash';
import {
  addBag,
  removeBag,
  setCartData,
  setCurrency,
  setCurrentBag,
} from 'redux/slices/cart';
import { getCartData } from 'redux/selectors/cartSelector';
import PosUserModal from './pos-user-modal';
import DeliveryInfo from './delivery-info';
import { InfiniteSelect } from 'components/infinite-select';
import moment from 'moment';
import { AsyncSelect } from 'components/async-select';
import restPaymentService from 'services/rest/payment';

export default function OrderTabs() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { currencies, loading } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const { currentBag, bags, currency } = useSelector(
    (state) => state.cart,
    shallowEqual,
  );
  const data = useSelector((state) => getCartData(state.cart));
  const { payments } = useSelector((state) => state.payment, shallowEqual);
  const { before_order_phone_required } = useSelector(
    (state) => state.globalSettings.settings,
    shallowEqual,
  );

  const [users, setUsers] = useState([]);
  const [userModal, setUserModal] = useState(null);
  const [links, setLinks] = useState(null);

  async function getUsers({ search }) {
    const params = {
      search,
      perPage: 10,
    };
    return userService.getAll(params).then((res) => {
      setLinks(res.links);
      setUsers(res.data);
      return formatUser(res.data);
    });
  }

  function formatUser(data) {
    if (!data) return;
    if (isArray(data)) {
      return data.map((item) => ({
        label: `${item?.firstname ?? ''} ${item?.lastname ?? ''}`,
        value: item?.id,
        key: item?.id,
      }));
    } else {
      return {
        label: `${data?.firstname ?? ''} ${data?.lastname ?? ''}`,
        value: data?.id,
        key: data?.id,
      };
    }
  }

  function selectUser(userObj) {
    const user = users.find((item) => item.id === userObj.value);
    dispatch(
      setCartData({
        user: userObj,
        userUuid: user?.uuid,
        bag_id: currentBag,
        userOBJ: user,
        phone: user?.phone,
      }),
    );
    form.setFieldsValue({ address: null, phone: user?.phone });
  }

  const goToAddClient = () => setUserModal(true);

  const closeTab = (event, item) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(removeBag(item));
  };

  function selectCurrency(item) {
    const currentCurrency = currencies.find((el) => el.id === item.value);
    dispatch(setCurrency(currentCurrency));
  }

  useEffect(() => {
    if (!currency) {
      const currentCurrency = currencies.find((item) => item.default);
      const formCurrency = {
        label: `${currentCurrency?.title} (${currentCurrency?.symbol})`,
        value: currentCurrency?.id,
        key: currentCurrency?.id,
      };
      dispatch(
        setCartData({
          currentCurrency,
          bag_id: currentBag,
        }),
      );
      dispatch(setCurrency(currentCurrency));
      form.setFieldsValue({
        currency: formCurrency,
      });
    } else {
      const formCurrency = {
        label: `${currency?.title} (${currency?.symbol})`,
        value: currency?.id,
        key: currency?.id,
      };
      dispatch(
        setCartData({
          formCurrency,
          bag_id: currentBag,
        }),
      );
      form.setFieldsValue({
        currency: formCurrency,
      });
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      user: data?.user || null,
      payment_type: data?.paymentType || null,
      address: data.address
        ? {
            value: data.address.value,
            label: data.address.label,
          }
        : null,
      delivery: data?.deliveries || null,
      delivery_time: data?.delivery_time
        ? moment(`${data?.delivery_date} ${data?.delivery_time}`)
        : null,
      delivery_date: data?.delivery_date ? moment(data?.delivery_date) : null,
      delivery_point: data?.delivery_point || null,
      country: data?.country || null,
      city: data?.city || null,
      phone: data?.phone || null,
      home_number: data?.street_house_number || null,
      zip_code: data?.zip_code || null,
    });
  }, [currentBag, data]);

  const handleAddBag = () => {
    dispatch(addBag({ shop: data?.shop }));
  };

  async function fetchPaymentList() {
    return restPaymentService.getAll().then(({ data }) =>
      data
        .filter((el) => el.tag === 'cash' || el.tag === 'wallet')
        .map((item) => ({
          label: t(item.tag) || t('no.name'),
          value: item?.tag,
          key: item?.id,
        })),
    );
  }

  return (
    <div className='order-tabs'>
      <div className='tabs-container'>
        <div className='tabs'>
          {bags.map((item) => (
            <div
              key={'tab' + item}
              className={item === currentBag ? 'tab active' : 'tab'}
              onClick={() => dispatch(setCurrentBag(item))}
            >
              <Space>
                <ShoppingCartOutlined />
                <span>
                  {t('bag')} - {item + 1}
                </span>
                {item && item === currentBag ? (
                  <CloseOutlined
                    onClick={(event) => closeTab(event, item)}
                    className='close-button'
                    size={12}
                  />
                ) : (
                  ''
                )}
              </Space>
            </div>
          ))}
        </div>
        <Button
          size='small'
          type='primary'
          shape='circle'
          icon={<PlusOutlined />}
          className='tab-add-button'
          onClick={() => handleAddBag()}
        />
      </div>
      <Form layout='vertical' name='pos-form' form={form}>
        <Card className={!!currentBag ? '' : t('tab-card')}>
          {loading && (
            <div className='loader'>
              <Spin />
            </div>
          )}

          <Row gutter={6} style={{ marginBottom: 15 }}>
            <Col span={21}>
              <Form.Item
                name='user'
                rules={[{ required: true, message: '' }]}
                className='w-100'
              >
                <InfiniteSelect
                  hasMore={links?.next}
                  placeholder={t('select.client')}
                  fetchOptions={getUsers}
                  onSelect={selectUser}
                  onClear={() => {
                    form.setFieldsValue({ phone: null, user: null });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item>
                <Button icon={<UserAddOutlined />} onClick={goToAddClient} />
              </Form.Item>
            </Col>
            {before_order_phone_required === '1' && (
              <Col span={12}>
                <Form.Item
                  name='phone'
                  rules={[
                    { required: true, message: t('required') },
                    {
                      validator(_, value) {
                        if (value < 0) {
                          return Promise.reject(
                            new Error(t('must.be.positive')),
                          );
                        }
                      },
                    },
                  ]}
                >
                  <InputNumber
                    className='w-100'
                    placeholder={t('phone.number')}
                    disabled={data?.userOBJ?.phone}
                    onChange={(phone) =>
                      dispatch(
                        setCartData({ phone: phone, bag_id: currentBag }),
                      )
                    }
                  />
                </Form.Item>
              </Col>
            )}

            <Col span={12}>
              <Form.Item
                name='currency'
                rules={[{ required: true, message: 'missing_currency' }]}
              >
                <Select
                  placeholder={t('select.currency')}
                  onSelect={selectCurrency}
                  labelInValue
                  disabled
                  onChange={(e) => {
                    const currency = e;
                    dispatch(
                      setCartData({
                        currency,
                        bag_id: currentBag,
                      }),
                    );
                  }}
                >
                  {currencies.map((item, index) => (
                    <Select.Option key={index} value={item?.id}>
                      {`${item?.title} (${item?.symbol})`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='payment_type'
                rules={[{ required: true, message: t('missing.payment.type') }]}
              >
                <AsyncSelect
                  fetchOptions={fetchPaymentList}
                  className='w-100'
                  placeholder={t('select.payment.type')}
                  onSelect={(paymentType) => {
                    dispatch(setCartData({ paymentType, bag_id: currentBag }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <DeliveryInfo form={form} />
      </Form>
      {userModal && (
        <PosUserModal
          visible={userModal}
          handleCancel={() => setUserModal(false)}
        />
      )}
    </div>
  );
}
