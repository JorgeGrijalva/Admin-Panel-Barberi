import React, { useEffect, useState } from 'react';
import { Input, Form, Row, Col, Button, Card, InputNumber, Switch } from 'antd';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import parcelTypeService from 'services/parcelType';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, removeFromMenu, setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import createImage from 'helpers/createImage';
import Loading from 'components/loading';
import MediaUpload from 'components/upload';
import { fetchParcelTypes } from 'redux/slices/parcelTypes';
import parcelOptionService from 'services/parcel-option';
import { RefetchSearch } from 'components/refetch-search';

export default function ParcelType() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [image, setImage] = useState(activeMenu?.data?.image || []);
  const [special, setSpecial] = useState(activeMenu?.data?.special);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(
        setMenuData({ activeMenu, data: { ...activeMenu.data, ...data } })
      );
    };
  }, []);

  const fetchParcel = (id) => {
    setLoading(true);
    parcelTypeService
      .getById(id)
      .then((res) => {
        let data = res.data;
        setImage([createImage(data.img)]);
        setSpecial(data.special);
        form.setFieldsValue({
          ...data,
          options: data?.options.map((option) => ({
            label: option.translation?.title,
            value: option.id,
          })),
        });
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      ...values,
      special: Boolean(values.special),
      special_price: values.special_price || 0,
      special_price_per_km: values.special_price_per_km || 0,
      images: undefined,
      image: undefined,
      options: values.options?.map((option) => option.value),
      ...Object.assign(
        {},
        ...image.map((item, index) => ({
          [`images[${index}]`]: item.name,
        }))
      ),
    };

    const nextUrl = 'parcel-types';
    if (!id) {
      parcelTypeService
        .create(body)
        .then(() => {
          dispatch(fetchParcelTypes());
          toast.success(t('successfully.created'));
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          navigate(`/${nextUrl}`);
        })
        .finally(() => setLoadingBtn(false));
    } else {
      parcelTypeService
        .update(id, body)
        .then(() => {
          dispatch(fetchParcelTypes());
          toast.success(t('successfully.updated'));
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          navigate(`/${nextUrl}`);
        })
        .finally(() => setLoadingBtn(false));
    }
  };

  const getOptions = async (search) => {
    return parcelOptionService
      .getAll({ search })
      .then(({ data }) =>
        data.map((item) => ({ label: item.translation?.title, value: item.id }))
      );
  };

  useEffect(() => {
    if (activeMenu.refetch && id) {
      fetchParcel(id);
    }
  }, [activeMenu.refetch]);

  return (
    <Card title={id ? t('edit.parcel.type') : t('add.parcel.type')}>
      {!loading ? (
        <Form
          form={form}
          name='parcel-type'
          layout='vertical'
          initialValues={{ ...activeMenu.data }}
          onFinish={onFinish}
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={t('title')}
                name='type'
                rules={[
                  {
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject(new Error(t('required')));
                      } else if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value && value?.trim().length < 2) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.2'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('image')}
                name='images'
                rules={[
                  {
                    validator() {
                      if (image?.length === 0) {
                        return Promise.reject(new Error(t('required')));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <MediaUpload
                  type='languages'
                  imageList={image}
                  setImageList={setImage}
                  form={form}
                  multiple={false}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('start.price')}
                name='price'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber min={0} className='w-100' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('price.per.km')}
                name='price_per_km'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber min={0} className='w-100' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('min_width')}
                name='min_width'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber
                  min={0}
                  max={32678}
                  className='w-100'
                  addonAfter='sm'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('max_width')}
                name='max_width'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber
                  min={0}
                  max={32678}
                  className='w-100'
                  addonAfter='sm'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('min_height')}
                name='min_height'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber
                  min={0}
                  max={32678}
                  className='w-100'
                  addonAfter='sm'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('max_height')}
                name='max_height'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber
                  min={0}
                  max={32678}
                  className='w-100'
                  addonAfter='sm'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('min_length')}
                name='min_length'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber
                  min={0}
                  max={32678}
                  className='w-100'
                  addonAfter='sm'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('max_length')}
                name='max_length'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber
                  min={0}
                  max={32678}
                  className='w-100'
                  addonAfter='sm'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('min_weight')}
                name='min_g'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber
                  min={0}
                  max={32678}
                  className='w-100'
                  addonAfter='gramm'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('max_weight')}
                name='max_g'
                rules={[{ required: true, message: t('required') }]}
              >
                <InputNumber
                  min={0}
                  max={2147000000}
                  className='w-100'
                  addonAfter='gramm'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t('options')} name='options'>
                <RefetchSearch fetchOptions={getOptions} mode='multiple' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t('max.range')} name='max_range'>
                <InputNumber min={0} className='w-100' addonAfter='km' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('special')}
                name='special'
                valuePropName='checked'
              >
                <Switch onChange={(value) => setSpecial(value)} />
              </Form.Item>
            </Col>
            {!!special && (
              <>
                <Col span={12}>
                  <Form.Item
                    label={t('start.price')}
                    name='special_price'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <InputNumber min={0} className='w-100' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t('price.per.km')}
                    name='special_price_per_km'
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <InputNumber min={0} className='w-100' />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('save')}
          </Button>
        </Form>
      ) : (
        <Loading />
      )}
    </Card>
  );
}
