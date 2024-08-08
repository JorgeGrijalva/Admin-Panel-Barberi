import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Input, Row, Spin, Switch } from 'antd';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import LanguageList from '../../components/language-list';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  disableRefetch,
  removeFromMenu,
  setMenuData,
} from '../../redux/slices/menu';
import careerService from '../../services/career';
import { useTranslation } from 'react-i18next';
import { fetchCareer } from '../../redux/slices/career';
import { DebounceSelect } from 'components/search';
import categoryService from 'services/category';
import CkeEditor from 'components/ckeEditor';
import getTranslationFields from 'helpers/getTranslationFields';

const CareerEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { id } = useParams();
  const { params } = useSelector((state) => state.career, shallowEqual);
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  function getLanguageFields(data) {
    if (!data) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.title,
      [`description[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.description,
      [`address[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.address,
    }));
    return Object.assign({}, ...result);
  }

  const getCategory = (alias) => {
    setLoading(true);
    careerService
      .getById(alias)
      .then((res) => {
        let career = res.data;
        const body = {
          ...career,
          ...getLanguageFields(career),
          category_id: {
            label: career.category.translation.title,
            value: career.category.id,
          },
          active: res?.data?.active ? res?.data?.active : false,
        };
        form.setFieldsValue(body);
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
      active: Number(values.active),
      category_id: values.category_id.value,
      type: values.type,
      title: getTranslationFields(languages, values, 'title'),
      description: getTranslationFields(languages, values, 'description'),
      address: getTranslationFields(languages, values, 'address'),
    };
    const nextUrl = 'catalog/career';
    careerService
      .update(id, body)
      .then(() => {
        toast.success(t('successfully.updated'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        dispatch(fetchCareer(params));
        navigate(`/${nextUrl}`);
      })
      .catch((err) => console.error(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  };

  async function fetchCareerList(search) {
    const params = {
      search: search.lenght > 0 ? search : undefined,
      type: 'career',
      active: 1,
    };

    return categoryService.getAll(params).then((res) =>
      res.data.map((item) => ({
        label: item.translation ? item.translation.title : 'no name',
        value: item.id,
      }))
    );
  }

  useEffect(() => {
    if (activeMenu.refetch) getCategory(id);
  }, [activeMenu.refetch]);

  return (
    <Card title={t('edit.career')} extra={<LanguageList />}>
      {!loading ? (
        <Form
          name='basic'
          layout='vertical'
          onFinish={onFinish}
          initialValues={{
            parent_id: { title: '---', value: 0, key: 0 },
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
                  rules={[
                    {
                      validator(_, value) {
                        if (!value && item?.locale === defaultLang) {
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
                  hidden={item.locale !== defaultLang}
                >
                  <Input placeholder={t('name')} />
                </Form.Item>
              ))}
            </Col>

            <Col span={12} />
            <Col span={24}>
              <CkeEditor form={form} lang={defaultLang} languages={languages} />
            </Col>

            <Col span={12}>
              <Form.Item
                label={t('category')}
                name='category_id'
                rules={[{ required: true, message: t('required') }]}
              >
                <DebounceSelect fetchOptions={fetchCareerList} />
              </Form.Item>
            </Col>

            <Col span={12}>
              {languages.map((item, index) => (
                <Form.Item
                  key={item.locale + index}
                  label={t('location')}
                  name={`address[${item.locale}]`}
                  rules={[
                    {
                      validator(_, value) {
                        if (!value && item?.locale === defaultLang) {
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
                  hidden={item.locale !== defaultLang}
                >
                  <Input />
                </Form.Item>
              ))}
            </Col>

            <Col span={12}>
              <Form.Item
                label={t('active')}
                name='active'
                valuePropName='checked'
              >
                <Switch />
              </Form.Item>
            </Col>

            <Col span={12} />

            <Col span={24} className='mb-5' />
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
  );
};
export default CareerEdit;
