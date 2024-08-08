import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import TextArea from 'antd/es/input/TextArea';
import { DebounceSelect } from 'components/search';
import { useCallback, useEffect, useState } from 'react';
import category from 'services/category';
import shopService from 'services/shop';
import {
  SERVICE_STATUSES,
  SERVICES_TYPES,
  SERVICES_GENDERS,
} from 'constants/services';
import { useParams } from 'react-router-dom';
import servicesService from 'services/services';
import getLanguageFields from 'helpers/getLanguageFields';
import useDidUpdate from 'helpers/useDidUpdate';
import { disableRefetch } from 'redux/slices/menu';
import getTranslationFields from 'helpers/getTranslationFields';

const ServicesFormDetails = ({ handleSubmit }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { id } = useParams();

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  const serviceGenders = SERVICES_GENDERS.map((item) => ({
    ...item,
    label: t(item.label),
  }));

  const [selectedStatus, setSelectedStatus] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, []);

  useDidUpdate(() => {
    if (activeMenu.refetch) {
      fetch();
    }
  }, [activeMenu.refetch]);

  const fetchService = useCallback(
    (id) => {
      setLoading(true);
      servicesService
        .getById(id)
        .then(({ data }) => {
          const body = {
            ...getLanguageFields(languages, data, ['title', 'description']),
            category: {
              label: data?.category?.translation?.title || t('N/A'),
              value: data?.category?.id,
              key: data?.category?.id,
            },
            shop: {
              label: data?.shop?.translation?.title || t('N/A'),
              value: data?.shop?.id,
              key: data?.shop?.id,
            },
            price: data?.price || 0,
            interval: data?.interval || 0,
            pause: data?.pause || 0,
            commission_fee: data?.commission_fee || 0,
            status: {
              label: t(data?.status),
              value: data?.status,
              key: data?.status,
            },
            type: { label: t(data?.type), value: data?.type, key: data?.type },
            gender: data?.gender
              ? serviceGenders.find((item) => item.value === data?.gender)
              : serviceGenders[0],
            status_note: data?.status_note,
          };
          setSelectedStatus(body?.status);
          form.setFieldsValue(body);
        })
        .finally(() => setLoading(false));
    },
    [id],
  );

  const fetch = () => {
    if (!!id) {
      fetchService(id);
      dispatch(disableRefetch(activeMenu));
    }
  };

  const fetchCategory = (search = '') => {
    const params = {
      search: !!search?.length ? search : undefined,
      perPage: 20,
      page: 1,
      type: 'service',
    };

    return category?.getAll(params).then((res) =>
      res?.data?.map((item) => ({
        label: item?.translation?.title || t('N/A'),
        value: item?.id,
        key: item?.id,
      })),
    );
  };
  const fetchShops = (search = '') => {
    const params = {
      search: !!search?.length ? search : undefined,
      perPage: 20,
      page: 1,
    };

    return shopService.getAll(params).then((res) =>
      res?.data?.map((item) => ({
        label: item?.translation?.title || t('N/A'),
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const onFinish = (values) => {
    const body = {
      title: getTranslationFields(languages, values),
      description: getTranslationFields(languages, values, 'description'),
      category_id: values?.category?.value,
      shop_id: values?.shop?.value,
      price: values?.price,
      interval: values?.interval,
      pause: values?.pause,
      commission_fee: values?.commission_fee,
      status: values?.status?.value,
      type: values?.type?.value,
      gender: values?.gender?.value,
      status_note: values?.status_note,
    };
    setLoadingBtn(true);
    handleSubmit(body).finally(() => setLoadingBtn(false));
  };

  return (
    <Form form={form} layout='vertical' onFinish={onFinish}>
      <Card loading={loading}>
        <Row gutter={12}>
          <Col span={12}>
            {languages.map((item) => (
              <Form.Item
                label={t('title')}
                name={`title[${item?.locale || 'en'}]`}
                key={item?.locale}
                hidden={item?.locale !== defaultLang}
                rules={[
                  {
                    required: item?.locale === defaultLang,
                    message: t('required'),
                  },
                  {
                    type: 'string',
                    min: 2,
                    max: 200,
                    message: t('min.2.max.200.chars'),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            ))}
          </Col>
          <Col span={12}>
            {languages.map((item) => (
              <Form.Item
                label={t('description')}
                name={`description[${item?.locale || 'en'}]`}
                key={item?.locale}
                hidden={item?.locale !== defaultLang}
                rules={[
                  {
                    required: item?.locale === defaultLang,
                    message: t('required'),
                  },
                  {
                    type: 'string',
                    min: 2,
                    max: 200,
                    message: t('min.2.max.200.chars'),
                  },
                ]}
              >
                <TextArea rows={2} />
              </Form.Item>
            ))}
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('category')}
              name='category'
              rules={[{ required: true, message: t('required') }]}
            >
              <DebounceSelect fetchOptions={fetchCategory} allowClear={false} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('shop')}
              name='shop'
              rules={[{ required: true, message: 'required' }]}
            >
              <DebounceSelect fetchOptions={fetchShops} refetchOptions={true} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('price')}
              name='price'
              rules={[
                { required: true, message: 'required' },
                { type: 'number', min: 0, message: t('min.0') },
              ]}
            >
              <InputNumber
                className='w-100'
                addonAfter={
                  defaultCurrency?.position === 'after' &&
                  defaultCurrency?.symbol
                }
                addonBefore={
                  defaultCurrency?.position === 'before' &&
                  defaultCurrency?.symbol
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('duration')}
              name='interval'
              rules={[
                { required: true, message: 'required' },
                { type: 'number', min: 0, message: t('min.0') },
              ]}
            >
              <InputNumber className='w-100' addonAfter={t('minutes')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('pause')}
              name='pause'
              rules={[
                {
                  required: true,
                  message: 'required',
                },
                { type: 'number', min: 0, message: t('min.0') },
              ]}
            >
              <InputNumber className='w-100' addonAfter={t('minutes')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('commission.fee')}
              name='commission_fee'
              rules={[
                {
                  required: true,
                  message: 'required',
                },
                { type: 'number', min: 0, message: t('min.0') },
              ]}
            >
              <InputNumber className='w-100' addonAfter='%' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('status')}
              name='status'
              rules={[
                {
                  required: true,
                  message: 'required',
                },
              ]}
            >
              <Select
                labelInValue={true}
                onChange={(e) => setSelectedStatus(e)}
              >
                {SERVICE_STATUSES.map((item, idx) => (
                  <Select.Option value={item} key={item + idx}>
                    {t(item)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('type')}
              name='type'
              rules={[
                {
                  required: true,
                  message: 'required',
                },
              ]}
            >
              <Select labelInValue={true}>
                {SERVICES_TYPES.map((item, idx) => (
                  <Select.Option value={item} key={item + idx}>
                    {t(item)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('gender')}
              name='gender'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <Select labelInValue={true}>
                {serviceGenders.map((item, idx) => (
                  <Select.Option value={item.value} key={item.value + idx}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {selectedStatus?.value === SERVICE_STATUSES[2] && (
            <Col span={12}>
              <Form.Item
                label={t('status.note')}
                name='status_note'
                rules={[
                  {
                    required: selectedStatus?.value === SERVICE_STATUSES[2],
                    message: t('required'),
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Card>
      <Card className='formFooterButtonsContainer'>
        <Button
          type='primary'
          htmlType='submit'
          loading={loadingBtn}
          disabled={loading}
        >
          {t('next')}
        </Button>
      </Card>
    </Form>
  );
};

export default ServicesFormDetails;
