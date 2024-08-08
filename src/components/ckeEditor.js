import React from 'react';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { IMG_URL } from '../configs/app-global';
import galleryService from '../services/gallery';
import { toast } from 'react-toastify';

export default function CkeEditor({ form, lang, languages }) {
  const { t } = useTranslation();

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          loader.file.then((file) => {
            const isItAtLeast2MB = file.size / 1024 / 1024 < 2;
            if (!isItAtLeast2MB) {
              toast.error(t('min.2.mb'));
              reject();
            }
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

  return (
    <React.Fragment>
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
            {
              validator(_, value) {
                if (value && value?.trim() === '') {
                  return Promise.reject(new Error(t('no.empty.space')));
                } else if (value && value?.trim().length < 5) {
                  return Promise.reject(new Error(t('must.be.at.least.5')));
                } else if (value && value?.trim().length > 200) {
                  return Promise.reject(new Error(t('must.be.less.200')));
                }
                return Promise.resolve();
              },
            },
          ]}
          hidden={item.locale !== lang}
        >
          <CKEditor
            editor={ClassicEditor}
            config={{
              extraPlugins: [uploadPlugin],
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
    </React.Fragment>
  );
}
