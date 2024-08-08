import React, { useState, useEffect } from 'react';
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
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LanguageList from 'components/language-list';
import TextArea from 'antd/es/input/TextArea';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, removeFromMenu, setMenuData } from 'redux/slices/menu';
import categoryService from 'services/category';
import { IMG_URL } from 'configs/app-global';
import { useTranslation } from 'react-i18next';
import MediaUpload from 'components/upload';
import { fetchCategories } from 'redux/slices/category';
import { AsyncTreeSelect } from 'components/async-tree-select';

const CategoryEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [type, setType] = useState('main');
  const [hasChildren, setHasChildren] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { state } = useLocation();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(
    activeMenu.data?.image ? [activeMenu.data?.image] : [],
  );
  const [form] = Form.useForm();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [error, setError] = useState(null);
  const { uuid } = useParams();
  const { params } = useSelector((state) => state.category, shallowEqual);
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
      dispatch(
        fetchCategories({
          ...params,
          type,
          parent_id: state?.parentId,
        }),
      );
    };
  }, []);

  const createImage = (name) => {
    return {
      name,
      url: IMG_URL + name,
    };
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

  const getCategory = (alias) => {
    setLoading(true);
    categoryService
      .getById(alias)
      .then((res) => {
        let category = res.data;
        const body = {
          ...category,
          ...getLanguageFields(category),
          input: category?.input || 0,
          image: [createImage(category.img)],
          keywords: category?.keywords?.split(','),
          parent_id: {
            label: category.parent?.translation?.title,
            value: category.parent_id,
            key: category.parent_id,
          },
        };
        setType(category?.type);
        form.setFieldsValue(body);
        setImage([createImage(category.img)]);
        if (category?.children?.length > 0 && category?.type === 'main')
          setHasChildren(true);
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
      type: values.parent_id?.value ? type : 'main',
      active: values.active ? 1 : 0,
      keywords: values.keywords.join(','),
      parent_id: values.parent_id?.value,
      'images[0]': image[0]?.name,
    };
    const nextUrl = 'catalog/categories';

    categoryService
      .update(uuid, body)
      .then(() => {
        toast.success(t('successfully.updated'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    getCategory(uuid);
  }, [activeMenu.refetch, uuid, state?.parentId]);

  async function fetchUserCategoryList() {
    const { id } = form.getFieldValue();
    const params = { perPage: 100, type: 'main' };
    return categoryService.getAll(params).then((res) =>
      res.data
        .filter((item) => item.id !== id)
        .map((item) => ({
          label: item.translation?.title,
          value: item.id,
          key: item.id,
          type: 'main',
          children: item.children?.map((el) => ({
            label: el.translation?.title,
            value: el.id,
            key: el.id,
            type: 'sub_main',
            disabled: el.id === id,
            children: el.children?.map((three) => ({
              label: three.translation?.title,
              value: three.id,
              key: three.id,
              disabled: true,
              type: 'child',
            })),
          })),
        })),
    );
  }
  const handleCatrgory = (value, node) => {
    const { type } = node || {};
    const nextType =
      type === 'main' ? 'sub_main' : type === 'sub_main' ? 'child' : 'main';
    setType(nextType);
  };

  return (
    <>
      <Card
        title={state?.parentId ? t('edit.sub.category') : t('edit.category')}
        extra={<LanguageList />}
      >
        {!loading ? (
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
                        validator(_, value) {
                          if (!value && item?.locale === defaultLang) {
                            return Promise.reject(new Error(t('required')));
                          } else if (value && value?.trim() === '') {
                            return Promise.reject(
                              new Error(t('no.empty.space')),
                            );
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
                    <Input />
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
                        validator(_, value) {
                          if (!value && item?.locale === defaultLang) {
                            return Promise.reject(new Error(t('required')));
                          } else if (value && value?.trim() === '') {
                            return Promise.reject(
                              new Error(t('no.empty.space')),
                            );
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
                  rules={[{ required: true, message: t('required') }]}
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
                    fetchOptions={fetchUserCategoryList}
                    onSelect={handleCatrgory}
                    allowClear
                    disabled={hasChildren}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='input'
                  label={t('input')}
                  rules={[
                    {
                      required: true,
                      message: t('required'),
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    parser={(value) => parseInt(value, 10)}
                    max={9999999}
                    className='w-100'
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
        ) : (
          <div className='d-flex justify-content-center align-items-center py-5'>
            <Spin size='large' className='mt-5 pt-5' />
          </div>
        )}
      </Card>
    </>
  );
};
export default CategoryEdit;
