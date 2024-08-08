import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Col, Form, Input, InputNumber, Modal, Row } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getCartData } from '../../../../redux/selectors/cartSelector';
import countryService from '../../../../services/deliveryzone/country';
import cityService from '../../../../services/deliveryzone/city';
import { toast } from 'react-toastify';
import addressService from '../../../../services/seller/address';
import { DebounceSelect } from '../../../../components/search';
import { setCartData } from '../../../../redux/slices/cart';
import PosUserAddress from './pos-user-address';

export default function DeliveryUserModal({ visible, handleCancel }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [error, setError] = useState(null);
  const [addressModal, setAddressModal] = useState(null);
  const dispatch = useDispatch();

  const cartData = useSelector((state) => getCartData(state.cart));
  const { currentBag } = useSelector((state) => state.cart, shallowEqual);

  const countryOptions = useRef([]);

  const fetchCountries = (search) => {
    const params = {
      search,
      perPage: 10,
      page: 1,
      has_price: 1,
      region_id: cartData?.region?.value,
    };

    return countryService.get(params).then(({ data }) => {
      const options = data?.flatMap((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
        region_id: item?.region_id,
      }));
      countryOptions.current = options;
      return options;
    });
  };

  const fetchCities = (search) => {
    const params = {
      search,
      perPage: 10,
      page: 1,
      country_id: cartData?.country?.value,
      has_price: 1,
    };

    return cityService.get(params).then(({ data }) =>
      data?.flatMap((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const goToAddClientAddress = () => {
    if (!cartData.userUuid) {
      toast.warning(t('please.select.client'));
      return;
    }
    setAddressModal(cartData.userUuid);
  };

  const onFinish = (values) => {
    const payload = {
      ...values,
      user_id: cartData.user?.value,
      country_id: values.country?.value,
      city_id: values.city?.value,
      active: 1,
      phone: values.phone?.toString(),
      street_house_number: values.street_house_number?.toString(),
      city: undefined,
      country: undefined,
    };
    setLoadingBtn(true);
    addressService
      .create(payload)
      .then(() => {
        toast.success(t('successfully.added'));
        handleCancel();
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Modal
      title={t('add.delivery.address')}
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button
          key='ok-button'
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
        >
          {t('save')}
        </Button>,
        <Button key='cancel-button' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form layout='vertical' form={form} onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name='firstname'
              label={t('firstname')}
              rules={[{ required: true, message: t('required') }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='lastname'
              label={t('lastname')}
              rules={[{ required: true, message: t('required') }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='title'
              label={t('title')}
              rules={[{ required: true, message: t('required') }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='country'
              label={t('country')}
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <DebounceSelect
                fetchOptions={fetchCountries}
                placeholder={t('select.country')}
                onChange={(country) => {
                  const selectedCountry = countryOptions.current.find(
                    (item) => item.value === country.value,
                  );
                  form.setFieldsValue({
                    region_id: selectedCountry?.region_id,
                  });
                  dispatch(
                    setCartData({
                      country,
                      region_id: selectedCountry?.region_id,
                      bag_id: currentBag,
                    }),
                  );
                }}
                refetchOptions={true}
                onClear={() => {
                  form.setFieldsValue({ city: [] });
                  dispatch(
                    setCartData({
                      country: null,
                      city: null,
                      bag_id: currentBag,
                    }),
                  );
                }}
                autoComplete='none'
              />
            </Form.Item>
            <Form.Item name='region_id' hidden />
          </Col>
          <Col span={12}>
            <Form.Item
              name='city'
              label={t('city')}
              rules={[{ required: true, message: t('required') }]}
            >
              <DebounceSelect
                fetchOptions={fetchCities}
                placeholder={t('select.city')}
                refetchOptions={true}
                disabled={!cartData?.country}
                onChange={(city) =>
                  dispatch(
                    setCartData({
                      city,
                      bag_id: currentBag,
                    }),
                  )
                }
                autoComplete='none'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('phone.number')}
              name='phone'
              rules={[
                {
                  validator(_, value) {
                    if (value < 0) {
                      return Promise.reject(new Error(t('must.be.positive')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                className='w-100'
                addonBefore={'+'}
                parser={(value) => parseInt(value, 10)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='street_house_number'
              label={t('home.number')}
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
                {
                  type: 'number',
                  max: 99999999,
                  message: t('max.length.8'),
                },
              ]}
            >
              <InputNumber
                placeholder={t('home.number')}
                className='w-100'
                min={0}
                onChange={(value) =>
                  dispatch(
                    setCartData({
                      street_house_number: value,
                      bag_id: currentBag,
                    }),
                  )
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='zipcode'
              label={t('zip.code')}
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <Input
                placeholder={t('zip.code')}
                className='w-100'
                onChange={(value) =>
                  dispatch(
                    setCartData({
                      zip_code: value.target.value,
                      bag_id: currentBag,
                    }),
                  )
                }
                maxLength={15}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={['address', 'address']}
              label={t('address')}
              rules={[{ required: true, message: '' }]}
              onClick={goToAddClientAddress}
            >
              <Input autoComplete='off' placeholder={t('address')} />
            </Form.Item>
            <Form.Item name={['location', 'latitude']} hidden />
            <Form.Item name={['location', 'longitude']} hidden />
          </Col>
          <Col span={24}>
            <Form.Item name='additional_details' label={t('details')}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {addressModal && (
        <PosUserAddress
          uuid={addressModal}
          handleCancel={() => setAddressModal(null)}
          parentForm={form}
        />
      )}
    </Modal>
  );
}
