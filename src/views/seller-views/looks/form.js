import React, { Fragment, useState } from 'react';
import { Form, Card, Row, Col, Input, Button, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import LanguageList from 'components/language-list';
import { shallowEqual, useSelector, useDispatch, batch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TextArea from 'antd/es/input/TextArea';
import { DebounceSelect } from 'components/search';
import productService from 'services/product';
import MediaUpload from 'components/upload';
import { removeFromMenu } from 'redux/slices/menu';
import { toast } from 'react-toastify';
import { sellerFetchLooks } from 'redux/slices/looks';

export default function LooksForm({ form, handleSubmit }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);

  const [loadingBtn, setLoadingBtn] = useState(false);
  const [image, setImage] = useState(activeMenu?.data?.image ?? []);

  function handleValidation(value, item = null, length = 2) {
    const condition = !!item ? !value && item?.locale === defaultLang : !value;

    if (condition) {
      return Promise.reject(new Error(t('required')));
    } else if (value && value?.trim() === '') {
      return Promise.reject(new Error(t('no.empty.space')));
    } else if (value && value?.trim().length < length) {
      return Promise.reject(new Error(t(`must.be.at.least.${length}`)));
    }
    return Promise.resolve();
  }

  const fetchProducts = (search) => {
    const paramsData = {
      page: 1,
      perPage: 10,
      active: 1,
      status: 'published',
      shop_id: myShop?.id,
      search: !!search ? search : null,
    };

    return productService.getAll(paramsData).then((res) =>
      res.data.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const onFinish = (values) => {
    setLoadingBtn(true);

    const nextUrl = 'seller/looks';

    handleSubmit(values, image)
      .then(() => {
        toast.success(t('successfully.added'));
        batch(() => {
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          dispatch(sellerFetchLooks({}));
        });
        navigate(`/${nextUrl}`);
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Fragment>
      <Card title={t('add.look')} extra={<LanguageList />}>
        <Form
          form={form}
          onFinish={onFinish}
          layout='vertical'
          initialValues={{ active: true, ...activeMenu?.data }}
        >
          <Row gutter={12}>
            <Col span={12}>
              {languages.map((item) => (
                <Form.Item
                  key={'title' + item.id}
                  label={t('title')}
                  name={`title[${item.locale}]`}
                  hidden={item.locale !== defaultLang}
                  rules={[
                    { validator: (_, value) => handleValidation(value, item) },
                  ]}
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
                      validator: (_, value) => handleValidation(value, item, 5),
                    },
                  ]}
                >
                  <TextArea rows={3} />
                </Form.Item>
              ))}
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('products')}
                name={'products'}
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                ]}
              >
                <DebounceSelect mode='multiple' fetchOptions={fetchProducts} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name='images'
                label={t('image')}
                rules={[
                  {
                    validator() {
                      if (image.length === 0) {
                        return Promise.reject(new Error(t('required')));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <MediaUpload
                  type='products'
                  imageList={image}
                  setImageList={setImage}
                  form={form}
                  multiple={false}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label={t('active')}
                name='active'
                valuePropName='checked'
              >
                <Switch defaultChecked />
              </Form.Item>
            </Col>
          </Row>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('submit')}
          </Button>
        </Form>
      </Card>
    </Fragment>
  );
}
