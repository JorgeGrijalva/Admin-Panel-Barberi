import { Alert, Checkbox, Form, Input, Radio, Select, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';

function FormItemPreview({ data, disabled, onClick }) {
  return (
    <Form layout='vertical' onClick={onClick}>
      {data.answer_type === 'description_text' ? (
        <CurrentTypeofInput data={data} />
      ) : (
        <Form.Item
          label={data.question}
          required={!!data?.required}
          style={{ pointerEvents: disabled ? 'none' : 'auto' }}
        >
          <CurrentTypeofInput data={data} />
        </Form.Item>
      )}
    </Form>
  );
}

function CurrentTypeofInput({ data }) {
  switch (data.answer_type) {
    case 'short_answer':
      return <Input />;
    case 'long_answer':
      return <TextArea rows={2} />;
    case 'single_answer':
      return (
        <Radio.Group>
          <Space direction='vertical'>
            {data.answer.map((answer) => (
              <Radio value={answer}>{answer}</Radio>
            ))}
          </Space>
        </Radio.Group>
      );
    case 'multiple_choice':
      return (
        <Space direction='vertical'>
          {data.answer.map((answer) => (
            <Checkbox>{answer}</Checkbox>
          ))}
        </Space>
      );
    case 'drop_down':
      return (
        <Select placeholder='Please select'>
          {data.answer.map((answer, idx) => (
            <Select.Option value={answer + idx}>{answer}</Select.Option>
          ))}
        </Select>
      );
    case 'yes_or_no':
      return (
        <Radio.Group>
          <Radio.Button value='yes'>Yes</Radio.Button>
          <Radio.Button value='no'>No</Radio.Button>
        </Radio.Group>
      );
    case 'description_text':
      return (
        <div className='mb-4'>
          <Alert message={data.question} type='info' className='mt-3' />
        </div>
      );
    default:
      return <p>Unknown type</p>;
  }
}

export default FormItemPreview;
