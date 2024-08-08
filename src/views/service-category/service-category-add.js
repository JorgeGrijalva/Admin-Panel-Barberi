import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Input, Row, Select, Switch } from 'antd';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import LanguageList from 'components/language-list';
import TextArea from 'antd/es/input/TextArea';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu, setMenuData } from 'redux/slices/menu';
import categoryService from 'services/category';
import { useTranslation } from 'react-i18next';
import MediaUpload from 'components/upload';
import { AsyncTreeSelect } from '../../components/async-tree-select';

const ServiceCategoryAdd = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [type, setType] = useState('service');

  const [image, setImage] = useState(
    activeMenu.data?.image ? [activeMenu.data?.image] : [],
  );
  const [form] = Form.useForm();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [error, setError] = useState(null);

  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const onFinish = (values) => {
    setLoadingBtn(true);

    const body = {
      ...values,
      active: values.active ? 1 : 0,
      keywords: values.keywords.join(','),
      parent_id: values.parent_id?.value,
      'images[0]': image[0]?.name,
      type: values.parent_id?.value ? 'sub_service' : 'service',
    };

    const nextUrl = 'catalog/service-categories';
    categoryService
      .create(body)
      .then(() => {
        toast.success(t('successfully.created'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  };
  async function fetchUserServiceCategoryList() {
    const params = { perPage: 100, type: 'service' };
    return categoryService.getAll(params).then((res) =>
      res.data.map((item) => ({
        label: item.translation?.title,
        value: item.id,
        key: item.id,
        type: 'service',
        children: item.children?.map((el) => ({
          label: el.translation?.title,
          value: el.id,
          key: el.id,
          type: 'sub_service',
          disabled: el.type === 'child_service',
          children: el.children?.map((three) => ({
            label: three.translation?.title,
            value: three.id,
            key: three.id,
            disabled: true,
            type: 'child_service',
          })),
        })),
      })),
    );
  }

  const handleCategory = (value, node, extra) => {
    const { type } = node || {};
    const nextType =
      type === 'service'
        ? 'sub_service'
        : type === 'sub_service'
          ? 'child_service'
          : 'service';
    setType(nextType);
  };
  return (
    <Card title={t('add.service.category')} extra={<LanguageList />}>
      <Form
        name='basic'
        layout='vertical'
        onFinish={onFinish}
        initialValues={{
          active: true,
          ...activeMenu.data,
        }}
        form={form}
      >
        <Row gutter={12}>
          <Col span={12}>
            {languages.map((item, index) => (
              <Form.Item
                key={item.title + index}
                label={t('name')}
                name={`title[${item.locale}]`}
                help={
                  error
                    ? error[`title.${defaultLang}`]
                      ? error[`title.${defaultLang}`][0]
                      : null
                    : null
                }
                validateStatus={error ? 'error' : 'success'}
                rules={[
                  {
                    required: true,
                    validator(_, value) {
                      if (!value && item?.locale === defaultLang) {
                        return Promise.reject(new Error(t('required')));
                      } else if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value && value?.trim().length < 2) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.2')),
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                hidden={item.locale !== defaultLang}
              >
                <Input placeholder={t('name')} />
              </Form.Item>
            ))}
          </Col>

          <Col span={12}>
            {languages.map((item, index) => (
              <Form.Item
                key={item.locale + index}
                label={t('description')}
                name={`description[${item.locale}]`}
                rules={[
                  {
                    required: true,
                    validator(_, value) {
                      if (!value && item?.locale === defaultLang) {
                        return Promise.reject(new Error(t('required')));
                      } else if (value && value?.trim() === '') {
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
                <TextArea rows={4} />
              </Form.Item>
            ))}
          </Col>

          <Col span={12}>
            <Form.Item
              label={t('keywords')}
              name='keywords'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <Select mode='tags' style={{ width: '100%' }}></Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('parent.category')}
              name='parent_id'
              rules={[{ required: false, message: t('required') }]}
            >
              <AsyncTreeSelect
                refetch
                fetchOptions={fetchUserServiceCategoryList}
                onSelect={handleCategory}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={4}>
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
                type='categories'
                imageList={image}
                setImageList={setImage}
                form={form}
                multiple={false}
              />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item
              label={t('active')}
              name='active'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        <Button type='primary' htmlType='submit' loading={loadingBtn}>
          {t('submit')}
        </Button>
      </Form>
    </Card>
  );
};
export default ServiceCategoryAdd;
