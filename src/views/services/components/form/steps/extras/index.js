import { Button, Card, Col, Form, Input, InputNumber, Row, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useState } from 'react';
import useDidUpdate from 'helpers/useDidUpdate';
import servicesService from 'services/services';
import getLanguageFields from 'helpers/getLanguageFields';
import { disableRefetch } from 'redux/slices/menu';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import MediaUpload from 'components/upload';
import createImage from 'helpers/createImage';
import { DeleteOutlined } from '@ant-design/icons';
import { DebounceSelect } from 'components/search';
import serviceExtraService from 'services/service-extra';
import ServiceFormAddFieldModal from './components/add-field';
import getTranslationFields from 'helpers/getTranslationFields';
import { toast } from 'react-toastify';

const ServiceExtras = ({ prev, next }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [images, setImages] = useState([]);
  const [serviceExtras, setServiceExtras] = useState([]);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);

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
          const body = data?.service_extras?.map((item) => ({
            extra: {
              label: item?.translation?.title,
              value: item?.id,
              key: item?.id,
            },
            ...getLanguageFields(languages, item, ['title']),
            price: item?.price || 0,
            active: !!item?.active,
          }));

          setImages(
            data?.service_extras?.map((item, index) => ({
              img: item?.img?.length ? [createImage(item?.img)] : [],
              fieldIndex: index,
            })),
          );
          form.setFieldsValue({ extras: body });
        })
        .finally(() => setLoading(false));
    },
    [id],
  );

  const fetch = () => {
    fetchService(id);
    dispatch(disableRefetch(activeMenu));
  };

  const fetchServiceExtras = (search = '') => {
    const params = {
      search: !!search?.length ? search : undefined,
      page: 1,
      perPage: 20,
    };
    return serviceExtraService.getAll(params).then((res) => {
      setServiceExtras(res?.data);
      return res?.data?.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      }));
    });
  };

  const handleAddField = (selectedExtra) => {
    setIsAddFieldModalOpen(false);
    const selectedExtraObject = serviceExtras.find(
      (item) => item?.id === selectedExtra?.value,
    );
    setImages([
      ...images,
      {
        img: !!selectedExtraObject?.img?.length
          ? [createImage(selectedExtraObject?.img)]
          : [],
        fields: images?.length,
      },
    ]);
    form.setFieldsValue({
      extras: [
        ...form.getFieldValue('extras'),
        {
          extra: selectedExtra,
          ...getLanguageFields(languages, selectedExtraObject, ['title']),
          price: selectedExtraObject?.price || 0,
          active: !!selectedExtraObject?.active,
        },
      ],
    });
  };

  const handleRemoveField = (index, remove) => {
    setImages(images.filter((item, i) => i !== index));
    remove();
  };

  const onFinish = (values) => {
    const body = values?.extras?.map((value, index) => ({
      active: value?.active,
      price: value?.price,
      title: getTranslationFields(languages, value),
      img: images?.[index]?.img?.[0]?.url,
    }));
    setLoadingBtn(true);
    servicesService
      .createExtras(id, { extras: body })
      .then(() => {
        toast.success(t('successfully.updated'));
        next();
      })
      .finally(() => setLoadingBtn(false));
  };

  const renderImageField = (index) => {
    const currentFieldImage = images?.[index]?.img;
    const setCurrentFieldImage = (value) => {
      setImages(
        images?.map((image, i) => {
          if (i === index) {
            return { ...image, img: value };
          }
          return image;
        }),
      );
    };
    return (
      <Col>
        <Form.Item
          label={t('image')}
          name={[index, 'image']}
          rules={[
            {
              required: !currentFieldImage?.length,
              message: t('required'),
            },
          ]}
        >
          <MediaUpload
            type='service_extras'
            imageList={currentFieldImage}
            setImageList={setCurrentFieldImage}
            form={form}
            multiple={false}
          />
        </Form.Item>
      </Col>
    );
  };

  return (
    <Form form={form} layout='vertical' onFinish={onFinish}>
      <Card loading={loading}>
        <Form.List name='extras'>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...resField }, index) => (
                <Row gutter={12} className='mb-3' key={name}>
                  <Col span={6}>
                    <Form.Item
                      label={t('extra')}
                      name={[index, 'extra']}
                      rules={[{ required: true, message: t('required') }]}
                    >
                      <DebounceSelect disabled />
                    </Form.Item>
                  </Col>
                  {renderImageField(index)}
                  <Col span={6}>
                    {languages.map((item) => (
                      <Form.Item
                        label={t('title')}
                        name={[index, `title[${item?.locale || 'en'}]`]}
                        key={[index, item?.locale]}
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
                  <Col span={6}>
                    <Form.Item
                      label={t('price')}
                      name={[index, 'price']}
                      rules={[{ required: true, message: t('required') }]}
                    >
                      <InputNumber
                        className='w-100'
                        addonBefore={
                          defaultCurrency?.position === 'before' &&
                          defaultCurrency?.symbol
                        }
                        addonAfter={
                          defaultCurrency?.position === 'after' &&
                          defaultCurrency?.symbol
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      label={t('active')}
                      name={[index, 'active']}
                      valuePropName='checked'
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col className='ml-5'>
                    <Form.Item label=' '>
                      <Button
                        type='danger'
                        onClick={() =>
                          handleRemoveField(index, () => remove(name))
                        }
                        icon={<DeleteOutlined />}
                        disabled={fields?.length === 1}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ))}
              <Button
                type='dashed'
                onClick={() => {
                  setIsAddFieldModalOpen(true);
                  // add();
                }}
                className='w-100 mt-3'
              >
                {t('add.field')}
              </Button>
            </>
          )}
        </Form.List>
      </Card>
      <Card>
        <div className='formFooterButtonsContainer'>
          <Button onClick={prev}>{t('prev')}</Button>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('next')}
          </Button>
        </div>
      </Card>
      {isAddFieldModalOpen && (
        <ServiceFormAddFieldModal
          handleAddField={handleAddField}
          handleClose={() => setIsAddFieldModalOpen(false)}
          isOpen={isAddFieldModalOpen}
          fetchOptions={fetchServiceExtras}
        />
      )}
    </Form>
  );
};

export default ServiceExtras;
