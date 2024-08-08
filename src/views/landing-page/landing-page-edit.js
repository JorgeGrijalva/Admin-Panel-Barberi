import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, Input, Row, Spin } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, removeFromMenu, setMenuData } from 'redux/slices/menu';
import { fetchLandingPages } from 'redux/slices/landing-page';
import { useTranslation } from 'react-i18next';
import LanguageList from 'components/language-list';
import getTranslationFields from 'helpers/getTranslationFields';
import landingPageService from 'services/landingPage';
import ImageUploadSingle from 'components/image-upload-single';
import createImage from 'helpers/createImage';
const TextArea = Input.TextArea;

const LandingPageEdit = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );
  const { id } = useParams();
  const [image, setImage] = useState(activeMenu?.data?.img);
  const [media, setMedia] = useState(
    activeMenu?.data
      ? [
          activeMenu?.data['features[0].img'],
          activeMenu?.data['features[1].img'],
          activeMenu?.data['features[2].img'],
        ]
      : ['', '', '']
  );

  const updateMedia = (obj, idx) => {
    const list = [...media];
    list[idx] = obj;
    setMedia(list);
  };

  function getLanguageFields(data) {
    if (!data) {
      return {};
    }
    const title = {};
    const description = {};
    languages.forEach((element) => {
      title[`title[${element.locale}]`] = data.title.hasOwnProperty(
        element.locale
      )
        ? data.title[element.locale]
        : undefined;
      description[`description[${element.locale}]`] =
        data.description.hasOwnProperty(element.locale)
          ? data.description[element.locale]
          : undefined;
    });
    return { ...title, ...description };
  }

  const getLandingPage = (alias) => {
    setLoading(true);
    landingPageService
      .getById(alias)
      .then(({ data }) => {
        const payload = {
          ...getLanguageFields(data?.data),
          features: data?.data?.features?.map((item) => ({
            ...getLanguageFields(item),
          })),
        };
        form.setFieldsValue(payload);
        setImage(createImage(data?.data?.img));
        setMedia(data?.data?.features?.map((item) => createImage(item.img)));
      })
      .finally(() => {
        dispatch(disableRefetch(activeMenu));
        setLoading(false);
      });
  };

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      title: getTranslationFields(languages, values, 'title'),
      description: getTranslationFields(languages, values, 'description'),
      img: image?.name,
      features: values.features.map((item, idx) => ({
        img: media[idx]?.name,
        title: getTranslationFields(languages, item, 'title'),
        description: getTranslationFields(languages, item, 'description'),
      })),
    };
    landingPageService
      .update(id, { data: body, type: 'welcome' })
      .then(() => {
        const nextUrl = 'settings/landing-page';
        toast.success(t('successfully.created'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(fetchLandingPages());
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      getLandingPage(id);
    }
  }, [activeMenu.refetch]);

  return (
    <Card
      title={t('edit.landing.page')}
      className='h-100'
      extra={<LanguageList />}
    >
      {!loading ? (
        <Form
          name='landing-page-edit'
          layout='vertical'
          onFinish={onFinish}
          form={form}
          initialValues={{ features: ['', '', ''], ...activeMenu.data }}
          className='d-flex flex-column h-100'
        >
          <Row gutter={12}>
            <Col span={12}>
              {languages.map((item) => (
                <Form.Item
                  key={'title' + item.locale}
                  label={`${t('title')} (${item.locale})`}
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
              {languages.map((item) => (
                <Form.Item
                  key={'description' + item.locale}
                  label={`${t('description')} (${item.locale})`}
                  name={`description[${item.locale}]`}
                  rules={[
                    {
                      required: item.locale === defaultLang,
                      message: t('required'),
                    },
                  ]}
                  hidden={item.locale !== defaultLang}
                >
                  <TextArea rows={3} />
                </Form.Item>
              ))}
            </Col>
            <Col span={12}>
              <Form.Item label={t('background.image')}>
                <ImageUploadSingle
                  type='languages'
                  image={image}
                  setImage={setImage}
                  form={form}
                  name='img'
                />
              </Form.Item>
            </Col>
          </Row>
          <Card title={t('features')}>
            <Form.List name='features'>
              {(fields) => {
                return (
                  <div>
                    {fields.map((field, index) => (
                      <Row
                        key={field.key}
                        gutter={12}
                        align='middle'
                        style={{
                          borderBottom: '1px solid var(--grey)',
                          marginBottom: 24,
                          borderWidth: index === 2 ? 0 : 1,
                        }}
                      >
                        <Col span={20}>
                          {languages.map((item) => (
                            <Form.Item
                              key={'title' + item.locale}
                              label={`${t('title')} (${item.locale})`}
                              name={[index, `title[${item.locale}]`]}
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
                          {languages.map((item) => (
                            <Form.Item
                              key={'description' + item.locale}
                              label={`${t('description')} (${item.locale})`}
                              name={[index, `description[${item.locale}]`]}
                              rules={[
                                {
                                  required: item.locale === defaultLang,
                                  message: t('required'),
                                },
                              ]}
                              hidden={item.locale !== defaultLang}
                            >
                              <TextArea rows={3} />
                            </Form.Item>
                          ))}
                        </Col>
                        <Col span={4}>
                          <Form.Item label={t('media')}>
                            <ImageUploadSingle
                              type='languages'
                              isVideo
                              image={media[index]}
                              setImage={(obj) => updateMedia(obj, index)}
                              form={form}
                              name={`features[${index}].img`}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    ))}
                  </div>
                );
              }}
            </Form.List>
          </Card>
          <div className='flex-grow-1 d-flex flex-column justify-content-end'>
            <div className='pb-5'>
              <Button type='primary' htmlType='submit' loading={loadingBtn}>
                {t('submit')}
              </Button>
            </div>
          </div>
        </Form>
      ) : (
        <div className='d-flex justify-content-center align-items-center'>
          <Spin size='large' className='py-5' />
        </div>
      )}
    </Card>
  );
};

export default LandingPageEdit;
