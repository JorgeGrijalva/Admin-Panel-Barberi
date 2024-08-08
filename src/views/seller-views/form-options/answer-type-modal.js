import { Card, Col, Modal, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ANSWER_TYPES, getAnswerTypeIcon } from './utils';
import { EditOutlined } from '@ant-design/icons';

function AnswerTypeModal({ visible, onCancel, onOk }) {
  const { t } = useTranslation();
  const [answerType, setAnswerType] = useState(ANSWER_TYPES[0]);

  return (
    <Modal
      title={t('select.answer.type')}
      visible={visible}
      onCancel={onCancel}
      onOk={() => {
        onCancel();
        onOk(answerType);
      }}
    >
      <Row gutter={[16]}>
        {ANSWER_TYPES.map((item) => (
          <Col key={item} span={8} onClick={() => setAnswerType(item)}>
            <Card
              className={`border text-center bg-primary ${
                answerType === item ? 'border-white' : ''
              }`}
            >
              <div className='flex flex-column cursor-pointer'>
                {getAnswerTypeIcon(item)}
                <span>{item}</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Modal>
  );
}

export default AnswerTypeModal;
