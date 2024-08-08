import React, { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Spin,
  Switch,
} from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import advertService from 'services/advert';
import { toast } from 'react-toastify';
import getTranslationFields from 'helpers/getTranslationFields';
import LanguageList from 'components/language-list';
import { disableRefetch, setMenuData, removeFromMenu } from 'redux/slices/menu';
import { t } from 'i18next';
import MediaUpload from 'components/upload';
import VideoUploaderWithModal from 'components/video-uploader';
const type = [
  {
    value: 'main',
    label: t('main'),
  },
  { value: 'standard', label: t('standard') },
  { value: 'main_top_banner', label: t('main_top_banner') },
  { value: 'main_banner', label: t('main_banner') },
  { value: 'main_left_banner', label: t('main_left_banner') },
  { value: 'standard_top_banner', label: t('standard_top_banner') },
];
const AdvertForm = ({ id }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );

  const [image, setImage] = useState(
    activeMenu.data?.img?.filter((item) => !item?.isVideo) || [],
  );
  const [mediaList, setMediaList] = useState(
    activeMenu?.data?.initialMediaFile || { images: [], previews: [] },
  );

  const timeOptions = useMemo(
    () => [
      { value: 'minute', label: t('minute') },
      {
        value: 'hour',
        label: t('hour'),
      },
      {
        value: 'day',
        label: t('day'),
      },
      {
        value: 'month',
        label: t('month'),
      },
      {
        value: 'year',
        label: t('year'),
      },
    ],
    [],
  );
  const [loading, setLoading] = useState(false);
  const [isFetching, setFetching] = useState(false);

  const onFinish = (values) => {
    const videos = mediaList.images.map((item) => item.name);
    const previews = mediaList.previews.map((item) => item.name);

    const params = {
      ...values,
      images: [...videos, ...image.map((image) => image?.name)],
      previews,
      title: getTranslationFields(languages, values, 'title'),
      description: getTranslationFields(languages, values, 'description'),
      active: Number(values.active),
      time_type: values.time_type.value,
      type: values.type?.value || values.type,
    };
    if (!id) {
      advertCreate(params);
    } else {
      advertUpdate(params);
    }
  };

  const advertCreate = (params) => {
    setLoading(true);
    const nextUrl = 'catalog/advert';
    advertService
      .create(params)
      .then((res) => {
        navigate(`/${nextUrl}`);
        toast.success(t('successfully.created'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
      })
      .finally(() => setLoading(false));
  };

  const advertUpdate = (params) => {
    setLoading(true);
    const nextUrl = 'catalog/advert';
    advertService
      .update(id, params)
      .then((res) => {
        navigate('/catalog/advert');
        toast.success(t('successfully.updated'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
      })
      .finally(() => setLoading(false));
  };

  function getLanguageFields(data) {
    if (!data) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.title,
      [`description[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale,
      )?.description,
    }));
    return Object.assign({}, ...result);
  }

  const createImages = (items) =>
    items.map((item) => ({
      uid: item.id,
      name: item.path,
      url: item.path,
      isVideo: Boolean(item.preview),
    }));

  const createMediaFile = (items) => {
    const mediaObject = { images: [], previews: [] };
    const previews = items
      .filter((item) => item.preview)
      .map((item) => ({
        uid: item.id,
        name: item.preview,
        url: item.preview,
      }));
    const videos = items
      .filter((item) => item.preview)
      .map((item) => ({
        uid: item.id,
        name: item.path,
        url: item.path,
        isVideo: true,
      }));
    mediaObject.previews = previews;
    mediaObject.images = videos;

    return mediaObject;
  };

  const getAd = (alias) => {
    setFetching(true);
    advertService
      .getById(alias)
      .then((res) => {
        let ad = res.data;
        const data = {
          ...ad,
          time_type: { value: ad.time_type, label: t(ad.time_type) },
          img: createImages(ad.galleries),
          initialMediaFile: createMediaFile(res.data.galleries),
          ...getLanguageFields(ad),
        };
        setImage(createImages(ad.galleries).filter((item) => !item.isVideo));
        setMediaList(createMediaFile(res.data.galleries));
        form.setFieldsValue(data);
        dispatch(setMenuData({ activeMenu, data }));
      })
      .finally(() => {
        dispatch(disableRefetch(activeMenu));
        setFetching(false);
      });
  };

  useEffect(() => {
    if (!!id) {
      getAd(id);
    }
  }, [id]);

  if (isFetching) {
    return (
      <Card title={t('edit.ad')}>
        <div className='d-flex justify-content-center align-items-center'>
          <Spin size='large' className='py-5' />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card
        title={!!id ? t('edit.ad') : t('add.ad')}
        extra={<LanguageList />}
      />
      <Form
        layout='vertical'
        form={form}
        initialValues={{ active: true }}
        onFinish={onFinish}
      >
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Card title={t('basic.info')} className='h-100'>
              {languages.map((item) => (
                <Form.Item
                  key={'title' + item.id}
                  label={t('name')}
                  name={`title[${item.locale}]`}
                  rules={[
                    {
                      required: item.locale === defaultLang,
                      message: t('required'),
                    },
                    {
                      validator(_, value) {
                        if (value && value?.trim() === '') {
                          return Promise.reject(new Error(t('no.empty.space')));
                        } else if (value && value?.length < 2) {
                          return Promise.reject(new Error(t('min.2.letters')));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  hidden={item.locale !== defaultLang}
                >
                  <Input maxLength={50} />
                </Form.Item>
              ))}
              {languages.map((item) => (
                <Form.Item
                  key={'description' + item.locale}
                  label={t('description')}
                  name={`description[${item.locale}]`}
                  rules={[
                    {
                      required: item.locale === defaultLang,
                      message: t('required'),
                    },
                    {
                      validator(_, value) {
                        if (value && value?.trim() === '') {
                          return Promise.reject(new Error(t('no.empty.space')));
                        } else if (value && value?.trim().length < 5) {
                          return Promise.reject(
                            new Error(t('must.be.at.least.5')),
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  hidden={item.locale !== defaultLang}
                >
                  <Input maxLength={150} />
                </Form.Item>
              ))}
              <Form.Item
                label={t('type')}
                name='type'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                ]}
              >
                <Select
                  labelInValue={true}
                  filterOption={false}
                  options={type}
                />
              </Form.Item>
            </Card>
          </Col>
          <Col span={12}>
            <Card title={t('time.and.price')} className='h-100'>
              <Form.Item
                label={t('time.type')}
                name='time_type'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                ]}
              >
                <Select
                  labelInValue={true}
                  filterOption={false}
                  options={timeOptions}
                />
              </Form.Item>
              <Form.Item
                label={t('time')}
                name='time'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                  {
                    type: 'number',
                    min: 0,
                    message: t('must.be.positive'),
                  },
                  {
                    type: 'number',
                    max: 32000,
                    message: t('must.be.less.than.32000'),
                  },
                ]}
              >
                <InputNumber className='w-100' />
              </Form.Item>
              <Form.Item
                label={t('price')}
                name='price'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                  {
                    type: 'number',
                    max: 99999999999999999999,
                    message: t('max.length.20'),
                  },
                ]}
              >
                <InputNumber className='w-100' min={0} />
              </Form.Item>
              <Form.Item
                label={t('active')}
                name='active'
                valuePropName='checked'
              >
                <Switch />
              </Form.Item>
            </Card>
          </Col>
          <Col span={16}>
            <Card title={t('video')} className='h-100'>
              <VideoUploaderWithModal
                form={form}
                name='other'
                mediaList={mediaList}
                setMediaList={setMediaList}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title={t('media')} className='h-100'>
              <Form.Item
                rules={[
                  {
                    required: !image?.length,
                    message: t('required'),
                  },
                ]}
                name='images'
              >
                <MediaUpload
                  type='other'
                  imageList={image}
                  setImageList={setImage}
                  form={form}
                  multiple={false}
                />
              </Form.Item>
            </Card>
          </Col>
          <Col span={24} className='d-flex justify-content-end'>
            <Button type='primary' htmlType='submit' loading={loading}>
              {t('submit')}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AdvertForm;
