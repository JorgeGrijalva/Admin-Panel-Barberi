import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';
import category from 'services/seller/category';
import { genders, statuses } from '../../../../statuses';
import { toast } from 'react-toastify';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { AsyncTreeSelect } from 'components/async-tree-select-category';
import { serviceTypes } from '../../../../serviceTypes';
import { disableRefetch } from 'redux/slices/menu';
import servicesService from 'services/seller/services';
import getLanguageFields from 'helpers/getLanguageFields';
import { SERVICES_GENDERS } from 'constants/services';
import useDidUpdate from 'helpers/useDidUpdate';
import getTranslationFields from 'helpers/getTranslationFields';

const ServiceFormDetails = ({ handleSubmit }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const [selectedStatus, setSelectedStatus] = useState();
  // const [images, setImages] = useState(
  //   !!data ? data?.image : state?.selectedService?.image || [],
  // );
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchServiceCategoryList(search) {
    const params = { perPage: 100, type: 'service', search };
    return category?.selectPaginate(params).then((res) =>
      res.data.map((item) => ({
        label: item?.translation?.title || '',
        value: item?.id,
        key: item.id,
        type: 'service',
        disabled: item.children?.length,
        children: item.children?.map((el) => ({
          label: el.translation?.title,
          value: el.id,
          key: el.id,
          type: 'sub_service',
          disabled: el.children?.length,
        })),
      })),
    );
  }

  const onFinish = (values) => {
    setLoadingBtn(true);

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

    if (values?.status !== statuses[2]) delete body?.status_note;
    handleSubmit(body)
      .then(() => {
        toast.success(t('successfully.created'));
        form.resetFields();
      })
      .finally(() => setLoadingBtn(false));
  };

  const serviceGenders = SERVICES_GENDERS.map((item) => ({
    ...item,
    label: t(item.label),
  }));

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

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, []);

  useDidUpdate(() => {
    if (activeMenu.refetch) {
      fetch();
    }
  }, [activeMenu.refetch]);

  const fetch = () => {
    if (!!id) {
      fetchService(id);
      dispatch(disableRefetch(activeMenu));
    }
  };

  const initialValues = activeMenu.data;

  return (
    <Form
      form={form}
      layout={'vertical'}
      onFinish={onFinish}
      initialValues={{ ...initialValues }}
    >
      <Card loading={loading}>
        <Row gutter={12}>
          <Col span={12}>
            {languages.map((item, idx) => (
              <Form.Item
                key={'title' + idx}
                label={t('title')}
                name={`title[${item.locale}]`}
                rules={[
                  {
                    required: item.locale === defaultLang,
                    message: t('required'),
                  },
                ]}
                hidden={item.locale !== defaultLang}
              >
                <Input />
              </Form.Item>
            ))}
          </Col>
          <Col span={12}>
            {languages.map((item) => (
              <Form.Item
                key={'description' + item.id}
                label={t('description')}
                name={`description[${item.locale}]`}
                hidden={item.locale !== defaultLang}
                rules={[
                  {
                    required: item.locale === defaultLang,
                    message: t('required'),
                  },
                ]}
              >
                <TextArea rows={3} />
              </Form.Item>
            ))}
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('category')}
              name='category'
              rules={[{ required: true, message: 'required' }]}
            >
              <AsyncTreeSelect
                refetch
                fetchOptions={fetchServiceCategoryList}
                allowClear
              />
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
                addonAfter={defaultCurrency?.symbol}
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
              <InputNumber className='w-100' />
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
              <InputNumber className='w-100' />
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
              <InputNumber disabled className='w-100' addonAfter='%' />
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
              <Select onChange={(e) => setSelectedStatus(e)}>
                {statuses.map((item, idx) => (
                  <Select.Option value={item} key={item + idx}>
                    {item}
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
                {serviceTypes.map((item, idx) => (
                  <Select.Option value={item} key={item + idx}>
                    {item}
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
                  message: 'required',
                },
              ]}
            >
              <Select labelInValue={true}>
                {genders.map((item, idx) => (
                  <Select.Option value={item.value} key={item + idx}>
                    {t(item.label)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {selectedStatus === statuses[2] && (
            <Col span={12}>
              <Form.Item
                label={t('status.note')}
                name='status_note'
                rules={[
                  {
                    required: selectedStatus === statuses[2],
                    message: t('required'),
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          )}
          {/*<Col span={4}>*/}
          {/*  <Form.Item*/}
          {/*    label={t('image')}*/}
          {/*    name='image'*/}
          {/*    rules={[*/}
          {/*      {*/}
          {/*        required: !images?.length,*/}
          {/*        message: t('required'),*/}
          {/*      },*/}
          {/*    ]}*/}
          {/*  >*/}
          {/*    <MediaUpload*/}
          {/*      type='services'*/}
          {/*      imageList={images}*/}
          {/*      setImageList={setImages}*/}
          {/*      form={form}*/}
          {/*      multiple={false}*/}
          {/*      name='image'*/}
          {/*    />*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
        </Row>
        <Space>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('submit')}
          </Button>
        </Space>
      </Card>
    </Form>
  );
};

export default ServiceFormDetails;
