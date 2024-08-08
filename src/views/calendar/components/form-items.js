import React, { useContext } from 'react';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Radio,
  Select,
  Switch,
  Typography,
} from 'antd';
import { t } from 'i18next';
import bookingService from 'services/booking';
import { BookingContext } from '../provider';
const { Title } = Typography;

const FormItems = ({ item }) => {
  const [form] = Form.useForm();

  const { service_id, setIsAddForm, calculatedData, setCalculatedData } =
    useContext(BookingContext);

  const renderFormItem = (data) => {
    switch (data.answer_type) {
      case 'single_answer':
        return (
          <Radio.Group>
            {data.answer?.map((item) => (
              <Radio value={item}>{item}</Radio>
            ))}
          </Radio.Group>
        );
      case 'short_answer':
        return <Input />;
      case 'long_answer':
        return <Input.TextArea />;
      case 'multiple_choice':
        return (
          <Checkbox.Group>
            {data.answer?.map((item) => (
              <Checkbox value={item}>{item}</Checkbox>
            ))}
          </Checkbox.Group>
        );
      case 'drop_down':
        return (
          <Select>
            {data.answer?.map((item) => (
              <Select.Option value={item}>{item}</Select.Option>
            ))}
          </Select>
        );
      case 'yes_or_no':
        return <Switch />;
      default:
        return '';
    }
  };

  const perevFormItems = calculatedData?.items?.flatMap(
    (item) => item.data.form || []
  );

  const onFinish = (values) => {
    bookingService
      .update(service_id, {
        data: {
          ...calculatedData?.items[0]?.data,
          form: [
            ...perevFormItems,
            {
              ...item,
              data: item.data?.map((item) => {
                const userAnswer = values[item.answer_type];
                return {
                  ...item,
                  user_answer: userAnswer
                    ? typeof userAnswer === 'object'
                      ? userAnswer
                      : [userAnswer]
                    : undefined,
                };
              }),
            },
          ],
        },
      })
      .then((res) => {
        form.resetFields();
        setIsAddForm(false);
        setCalculatedData((prev) => ({
          ...prev,
          items: prev.items.map((item) => ({ ...item, data: res.data.data })),
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Card className='w-100'>
      <Title>{item?.translation?.title}</Title>
      <Form layout='vertical' form={form} onFinish={onFinish}>
        {item.data?.map((item) => {
          return (
            <>
              {item.answer_type === 'description_text' ? (
                <Alert message={item.question} type='info' />
              ) : (
                <Form.Item
                  label={item.question}
                  name={item.answer_type}
                  rules={[{ required: Boolean(item.required) }]}
                >
                  {renderFormItem(item)}
                </Form.Item>
              )}
            </>
          );
        })}
        <Button className='mt-4' type='primary' htmlType='submit'>
          {t('complate')}
        </Button>
      </Form>
    </Card>
  );
};

export default FormItems;
