import { Button, Col, Form, Row, Space } from 'antd';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useTranslation } from 'react-i18next';

const ReceptInstructions = ({ next, prev }) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );
  return (
    <>
      <Row gutter={12}>
        <Col span={24}>
          {languages.map((item) => (
            <Form.Item
              label={t('instructions')}
              name={['instruction', item.locale]}
              valuePropName='data'
              getValueFromEvent={(event, editor) => {
                const data = editor.getData();
                return data;
              }}
              rules={[
                {
                  validator(_, value) {
                    if (!value && item?.locale === defaultLang) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim().length < 12) {
                      return Promise.reject(new Error(t('must.be.at.least.5')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              hidden={item.locale !== defaultLang}
            >
              <CKEditor editor={ClassicEditor} />
            </Form.Item>
          ))}
        </Col>
      </Row>
      <Space>
        <Button type='primary' htmlType='button' onClick={() => prev()}>
          {t('prev')}
        </Button>
        <Button
          type='primary'
          htmlType='button'
          onClick={() => {
            form.validateFields([['instruction', defaultLang]]).then(() => {
              next();
            });
          }}
        >
          {t('next')}
        </Button>
      </Space>
    </>
  );
};

export default ReceptInstructions;
