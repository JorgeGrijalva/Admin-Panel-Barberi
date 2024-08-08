import { useState } from 'react';
import { Modal, Spin, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import storyService from '../../../../services/seller/storyUpload';
import { toast } from 'react-toastify';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

const ImageGallery = ({ fileList, setFileList, form }) => {
  const { t } = useTranslation();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };

  const createImage = (file) => {
    return {
      uid: file[0],
      name: file[0],
      status: 'done', // done, uploading, error
      url: file[0],
      created: true,
    };
  };

  const uploadButton = loading ? (
    <div>
      <Spin />
    </div>
  ) : (
    <div>
      <PlusOutlined className='upload_plus' />
      <div
        style={{
          marginTop: 8,
        }}
      >
        <span className='upload_text'>{t('upload')}</span>
      </div>
    </div>
  );

  const handleUpload = ({ file, onSuccess }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('files[0]', file);
    storyService
      .upload(formData)
      .then(({ data }) => {
        setFileList((prev) => [...prev, createImage(data)]);
        form.setFieldsValue({
          images: [...fileList, createImage(data)],
        });
        onSuccess('ok');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRemove = (file) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
  };

  return (
    <div className='story_img'>
      <Upload
        listType='picture-card'
        fileList={fileList}
        onPreview={handlePreview}
        customRequest={handleUpload}
        onRemove={handleRemove}
        accept='.png, .jpg, .jpeg, .webp'
        beforeUpload={(file) => {
          const isItAtLeast2MB = file.size / 1024 / 1024 < 2;
          if (!isItAtLeast2MB) {
            toast.error(t('max.2.mb'));
            return false;
          }
          return true;
        }}
      >
        {fileList.length >= 24 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt='example'
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
};

export default ImageGallery;
