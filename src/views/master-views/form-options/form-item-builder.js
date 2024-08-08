import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
} from 'antd';
import { useContext } from 'react';

import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { FormOptionContext } from './form-option-context';
import { ACTION_TYPES, ANSWER_TYPES } from './utils';

function FormItemBuilder({ data }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { formOptionsState, formOptionsDispatch } =
    useContext(FormOptionContext);

  const onFinish = (values) => {
    formOptionsDispatch({
      type: ACTION_TYPES.updateFormItem,
      payload: values,
    });
  };

  const handleCancel = () => {
    formOptionsDispatch({
      type: ACTION_TYPES.cancelFormItem,
    });
  };

  const handleDelete = () => {
    formOptionsDispatch({
      type: ACTION_TYPES.deleteActiveFormItem,
    });
  };

  const handleMoveUpQuestion = () => {
    formOptionsDispatch({
      type: ACTION_TYPES.moveUpQuestion,
    });
  };

  const handleMoveDownQuestion = () => {
    formOptionsDispatch({
      type: ACTION_TYPES.moveDownQuestion,
    });
  };

  const handleCopy = () => {
    const formItemToClone = Object.assign(
      {},
      formOptionsState.formItemsList[formOptionsState.activeItemIndex],
    );
    formItemToClone.question += ' copy';
    formOptionsDispatch({
      type: ACTION_TYPES.copyFormItem,
      payload: formItemToClone,
    });
  };

  const handleAnswerTypeChange = (value) => {
    if (
      (value === 'single_answer' ||
        value === 'multiple_choice' ||
        value === 'drop_down') &&
      !form.getFieldValue('answer')
    ) {
      form.setFieldsValue({ answer: ['Answer 1', 'Answer 2'] });
    }
  };

  const initialValues = {
    question: data.question,
    answer_type: data.answer_type,
    answer: data.answer,
    required: data.required,
  };

  return (
    <Card className='border' style={{ background: 'rgba(0,0,0, 0.1)' }}>
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={onFinish}
        layout='vertical'
      >
        <Row gutter={10}>
          <Col span={10}>
            <Form.Item
              name={'answer_type'}
              label={'answer.type'}
              rules={[{ required: true }]}
            >
              <Select onChange={handleAnswerTypeChange}>
                {ANSWER_TYPES.map((typeItem) => (
                  <Select.Option key={typeItem} value={typeItem}>
                    {t(typeItem)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item
              name={'question'}
              label={'question'}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.answer_type !== currentValues.answer_type
            }
          >
            {({ getFieldValue }) => (
              <AnswerListInputs answer_type={getFieldValue('answer_type')} />
            )}
          </Form.Item>
          <Divider className='mt-0' />
          <div className='flex justify-content-between items-center w-100'>
            <div>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.answer_type !== currentValues.answer_type
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue('answer_type') !== 'description_text' ? (
                    <Form.Item
                      name='required'
                      valuePropName='required'
                      label={t('required')}
                      className='mb-0'
                    >
                      <Switch defaultChecked={initialValues.required} />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </div>
            <Space>
              <Button
                onClick={handleMoveUpQuestion}
                htmlType='button'
                icon={<UpOutlined />}
                disabled={formOptionsState.activeItemIndex === 0}
              />
              <Button
                onClick={handleMoveDownQuestion}
                htmlType='button'
                icon={<DownOutlined />}
                disabled={
                  formOptionsState.activeItemIndex ===
                  formOptionsState.formItemsList.length - 1
                }
              />
              <div role='separator' />
              <Button
                onClick={handleCopy}
                htmlType='button'
                icon={<CopyOutlined />}
              />
              <Button
                onClick={handleDelete}
                htmlType='button'
                icon={<DeleteOutlined />}
                type='danger'
                disabled={formOptionsState.formItemsList.length === 1}
              />
              <div role='separator' />
              <Button
                onClick={handleCancel}
                htmlType='button'
                icon={<CloseOutlined />}
              />
              <Button
                htmlType='submit'
                icon={<CheckOutlined />}
                type='primary'
              ></Button>
            </Space>
          </div>
        </Row>
      </Form>
    </Card>
  );
}

function AnswerListInputs({ answer_type }) {
  const { t } = useTranslation();
  if (
    answer_type === 'single_answer' ||
    answer_type === 'multiple_choice' ||
    answer_type === 'drop_down'
  ) {
    return (
      <Form.List
        name='answer'
        label={'Answers'}
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 2) {
                return Promise.reject(new Error('add.at.least.2.option'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => {
          return (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  required={false}
                  key={field.key}
                  className='w-100'
                  validateStatus={errors.length && 'error'}
                  help={errors[index]}
                >
                  <div className='d-flex'>
                    <Form.Item
                      label={`${t('answer')} ${index + 1}`}
                      {...field}
                      rules={[
                        {
                          required: true,
                          message: t('required'),
                        },
                      ]}
                      noStyle
                    >
                      <Input className='w-100' />
                    </Form.Item>

                    <Button
                      icon={<MinusCircleOutlined />}
                      type='danger'
                      onClick={() => remove(field.name)}
                      className='ml-2'
                      disabled={fields.length <= 2}
                    />
                  </div>
                </Form.Item>
              ))}

              <Form.Item className='w-100'>
                <Button
                  type='link'
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  {t('add.field')}
                </Button>
              </Form.Item>
            </>
          );
        }}
      </Form.List>
    );
  }

  return null;
}

export default FormItemBuilder;
