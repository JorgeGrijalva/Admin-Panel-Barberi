import React from 'react';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function Description({ form, lang, languages }) {
  const { t } = useTranslation();

  return (
    <div className='product-description'>
      {languages.map((item) => (
        <Form.Item
          key={'desc' + item.locale}
          label={t('description')}
          name={`description[${item.locale}]`}
          valuePropName='data'
          getValueFromEvent={(event, editor) => {
            const data = editor.getData();
            return data;
          }}
          rules={[
            {
              required: item.locale === lang,
              message: t('required'),
            },
          ]}
          className='description-editor'
          hidden={item.locale !== lang}
        >
          <CKEditor
            editor={ClassicEditor}
            config={{
              toolbar: ['bold', 'italic', 'undo', 'redo'],
            }}
            onBlur={(event, editor) => {
              const data = editor.getData();
              form.setFieldsValue({
                [`description[${item.value}]`]: data,
              });
            }}
          />
        </Form.Item>
      ))}
    </div>
  );
}
