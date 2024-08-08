import { useTranslation } from 'react-i18next';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { removeFromMenu } from '../../../redux/slices/menu';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Space,
  Spin,
  Switch,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { PlusCircleOutlined } from '@ant-design/icons';
import formOptionsRestService from '../../../services/rest/form-options';
import { DebounceSelect } from '../../../components/search';
import { FormOptionContext } from './form-option-context';
import { ACTION_TYPES, createFormItemData } from './utils';
import getTranslationFields from '../../../helpers/getTranslationFields';
import { fetchMasterFormOptions } from '../../../redux/slices/form-options';
import FormOptionItem from './form-option-item';
import AnswerTypeModal from './answer-type-modal';
import masterFormOptionsService from '../../../services/master/form-options';
import FormPreview from './form-preview';
import serviceMasterService from '../../../services/master/serviceMaster';

function FormOptionsForm({ onSubmit, form, isCreating }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const { formOptionsState, formOptionsDispatch } =
    useContext(FormOptionContext);
  const [answerTypeModalVisible, setAnswerTypeModalVisible] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const addFormOptionItem = (answerType) => {
    const newFormItem = createFormItemData(answerType);
    formOptionsDispatch({
      type: ACTION_TYPES.addNewFormItem,
      payload: newFormItem,
    });
  };

  const fetchServiceMasters = (search = '') => {
    const paramsData = {
      page: 1,
      perPage: 10,
      search: search.trim(),
    };

    return serviceMasterService.get(paramsData).then((res) =>
      res.data.map((item) => ({
        label: item?.service?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const onFinish = (values) => {
    setLoadingBtn(true);
    const body = {
      title: getTranslationFields(languages, values, 'title'),
      description: getTranslationFields(languages, values, 'description'),
      required: values.required ? 1 : 0,
      active: values.active ? 1 : 0,
      data: formOptionsState.formItemsList.map((item) => ({
        ...item,
        required: item.required ? 1 : 0,
      })),
      service_master_id: values.service?.value,
    };
    onSubmit(body)
      .then(() => {
        const nextUrl = 'master/form-options';
        toast.success(t('successfully.added'));
        batch(() => {
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          dispatch(fetchMasterFormOptions({}));
        });
        navigate(`/${nextUrl}`);
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className='border rounded'>
          <Card className='mb-0'>
            <Form
              form={form}
              layout='vertical'
              onFinish={onFinish}
              initialValues={{ required: true, active: true }}
            >
              {languages.map((item) => (
                <>
                  <Form.Item
                    key={'title' + item.id}
                    label={t('title')}
                    name={`title[${item.locale}]`}
                    hidden={item.locale !== defaultLang}
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
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    key={'description' + item.locale}
                    label={t('section.description')}
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
                    <TextArea />
                  </Form.Item>
                </>
              ))}

              <Row gutter={20} className='mb-0' size='middle'>
                <Col>
                  <Form.Item
                    name={'service'}
                    label={t('service')}
                    rules={[{ required: true, message: t('required') }]}
                  >
                    <DebounceSelect
                      allowClear
                      fetchOptions={fetchServiceMasters}
                      style={{ width: '12rem' }}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    name='required'
                    label={t('required')}
                    className='mb-0'
                    valuePropName='checked'
                  >
                    <Switch
                      defaultChecked={
                        isCreating ? true : form.getFieldValue('required')
                      }
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    name='active'
                    label={t('active')}
                    className='mb-0'
                    valuePropName='checked'
                  >
                    <Switch
                      defaultChecked={
                        isCreating ? true : form.getFieldValue('active')
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <div className='border-top'>
            <Card className='mb-0'>
              {formOptionsState.formItemsList.map((item, index) => (
                <FormOptionItem
                  active={index === formOptionsState.activeItemIndex}
                  data={item}
                  index={index}
                />
              ))}
            </Card>
          </div>

          <div className='border-top'>
            <Card className='mb-0'>
              <Button
                icon={<PlusCircleOutlined />}
                type='link'
                onClick={() => setAnswerTypeModalVisible(true)}
              >
                {t('add.form.item')}
              </Button>
            </Card>
          </div>
        </div>

        <Button
          loading={loadingBtn}
          className='mt-3 w-100'
          type='primary'
          onClick={form.submit}
        >
          {t('submit')}
        </Button>
      </div>
      {answerTypeModalVisible && (
        <AnswerTypeModal
          visible={answerTypeModalVisible}
          onCancel={() => setAnswerTypeModalVisible(false)}
          onOk={addFormOptionItem}
        />
      )}
    </>
  );
}

function FormWithPreview(props) {
  const { t } = useTranslation();
  const [visibleComponent, setVisibleComponent] = useState('form');
  const [loading, setLoading] = useState(false);
  const { formOptionsDispatch } = useContext(FormOptionContext);
  const { shop_id } = useSelector(
    (state) => state.auth?.user?.invite,
    shallowEqual,
  );

  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );

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

  const fetchTemplateFormOptions = (search = '') => {
    const paramsData = {
      page: 1,
      perPage: 10,
      master_form_options: 1,
      search: search.trim(),
      shop_id,
    };

    return masterFormOptionsService.getAll(paramsData).then((res) =>
      res.data.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const cloneFormOptions = (formOptionId) => {
    setLoading(true);
    formOptionsRestService
      .getById(formOptionId)
      .then((res) => {
        setVisibleComponent('form');

        props.form.setFieldsValue({
          ...getLanguageFields(res.data),
          required: !!res.data?.required,
          active: !!res.data?.active,
        });

        formOptionsDispatch({
          type: ACTION_TYPES.setFormItemsState,
          payload: res.data.data,
        });
      })
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    setVisibleComponent(e.target.value);
  };

  return (
    <>
      <div className='flex justify-content-center mb-5'>
        <Space>
          <DebounceSelect
            allowClear
            fetchOptions={fetchTemplateFormOptions}
            onSelect={(item) => cloneFormOptions(item.value)}
            placeholder={t('select.a.template')}
            style={{ width: '12rem' }}
          />
          <Radio.Group value={visibleComponent} onChange={handleChange}>
            <Radio.Button value='form'>Builder</Radio.Button>
            <Radio.Button value='preview'>Preview</Radio.Button>
          </Radio.Group>
        </Space>
      </div>

      {loading ? (
        <div className='flex justify-content-center'>
          <Spin />
        </div>
      ) : visibleComponent === 'form' ? (
        <FormOptionsForm {...props} />
      ) : (
        <FormPreview form={props.form} />
      )}
    </>
  );
}

export default FormWithPreview;
