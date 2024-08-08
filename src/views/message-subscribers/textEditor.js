import React from 'react';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { IMG_URL } from '../../configs/app-global';
import galleryService from '../../services/gallery';

export default function TextEditor({ form, lang, languages }) {
  const { t } = useTranslation();

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          loader.file.then((file) => {
            formData.append('image', file);
            formData.append('type', 'blogs');
            galleryService
              .upload(formData)
              .then(({ data }) => {
                resolve({
                  default: `${IMG_URL + data.title}`,
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      },
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  const handleChange = (e, editor) => {
    const data = editor.getData();
  };

  return (
    <div className='textEditor'>
      <Form.Item
        label={t('newsletter.content')}
        name={'body'}
        valuePropName='data'
        getValueFromEvent={(event, editor) => {
          const data = editor.getData();
          return data;
        }}
        rules={[
          {
            required: true,
            message: t('required'),
          },
        ]}
        className='description-editor'
      >
        <CKEditor
          editor={ClassicEditor}
          config={{
            extraPlugins: [uploadPlugin],
          }}
          onChange={handleChange}
          onBlur={(event, editor) => {
            const data = editor.getData();
            form.setFieldsValue({
              body: data,
            });
          }}
        />
      </Form.Item>
    </div>
  );
}
