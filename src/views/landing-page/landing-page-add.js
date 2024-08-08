import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu, setMenuData } from 'redux/slices/menu';
import { fetchLandingPages } from 'redux/slices/landing-page';
import { useTranslation } from 'react-i18next';
import LanguageList from 'components/language-list';
import getTranslationFields from 'helpers/getTranslationFields';
import landingPageService from 'services/landingPage';
import ImageUploadSingle from 'components/image-upload-single';
const TextArea = Input.TextArea;

const LandingPageAdd = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );
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
      .create({ data: body, type: 'welcome' })
      .then(() => {
        const nextUrl = 'settings/landing-page';
        toast.success(t('successfully.created'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(fetchLandingPages());
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Card
      title={t('add.landing.page')}
      className='h-100'
      extra={<LanguageList />}
    >
      <Form
        name='landing-page-add'
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
                            image={media[index]}
                            isVideo
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
    </Card>
  );
};

export default LandingPageAdd;
