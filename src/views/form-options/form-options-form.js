import { useTranslation } from 'react-i18next';
import React, { useContext, useState } from 'react';
import { ACTION_TYPES, createFormItemData } from './utils';
import { Button, Card, Col, Form, Input, Radio, Row, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import FormOptionItem from './form-option-item';
import { PlusCircleOutlined } from '@ant-design/icons';
import AnswerTypeModal from './answer-type-modal';
import { FormOptionContext } from './form-option-context';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import getTranslationFields from '../../helpers/getTranslationFields';
import { DebounceSelect } from '../../components/search';
import shopService from '../../services/shop';
import { toast } from 'react-toastify';
import { removeFromMenu } from '../../redux/slices/menu';
import { useNavigate } from 'react-router-dom';
import { fetchFormOptions } from '../../redux/slices/form-options';
import FormPreview from './form-preview';

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

  const fetchShops = (search = '') => {
    const params = {
      search,
      perPage: 10,
      page: 1,
    };

    if (!search?.trim()) delete params?.search;

    return shopService.getAll(params).then((res) =>
      res?.data?.map((item) => ({
        label: item?.translation?.title,
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
      shop_id: values.shop.value,
      data: formOptionsState.formItemsList.map((item) => ({
        ...item,
        required: item.required ? 1 : 0,
      })),
    };
    onSubmit(body)
      .then(() => {
        const nextUrl = 'form-options';
        toast.success(t('successfully.added'));
        batch(() => {
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          dispatch(fetchFormOptions({}));
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
            <Form form={form} layout='vertical' onFinish={onFinish}>
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
                <Col span={10}>
                  <Form.Item
                    label={t('shop')}
                    name='shop'
                    rules={[{ required: true, message: 'required' }]}
                  >
                    <DebounceSelect
                      fetchOptions={fetchShops}
                      refetchOptions={true}
                    />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    name='required'
                    label={t('required')}
                    className='mb-0'
                    valuePropName='required'
                  >
                    <Switch
                      defaultChecked={
                        isCreating ? true : form.getFieldValue('required')
                      }
                    />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item name='active' label={t('active')} className='mb-0'>
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
  const [visibleComponent, setVisibleComponent] = useState('form');
  const handleChange = (e) => {
    setVisibleComponent(e.target.value);
  };
  return (
    <>
      <div className='flex justify-content-center mb-5'>
        <Radio.Group defaultValue='form' onChange={handleChange}>
          <Radio.Button value='form'>Builder</Radio.Button>
          <Radio.Button value='preview'>Preview</Radio.Button>
        </Radio.Group>
      </div>

      {visibleComponent === 'form' ? (
        <FormOptionsForm {...props} />
      ) : (
        <FormPreview form={props.form} />
      )}
    </>
  );
}

export default FormWithPreview;
