import { useState } from 'react';
import { Modal, Spin, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import galleryService from 'services/gallery';
import { useTranslation } from 'react-i18next';
import video_placeholder from 'assets/images/video-placeholder.png';
import { toast } from 'react-toastify';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

const ImageUploadSingle = ({ image, setImage, type, form, name = 'image', isVideo }) => {
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

  const handleChange = ({ fileList: newFileList }) => {
    // setFileList(newFileList)
  };

  const createImage = (file) => {
    return {
      uid: file.title,
      name: file.title,
      status: 'done', // done, uploading, error
      url: file.title,
      created: true,
    };
  };

  const uploadButton = loading ? (
    <div>
      <Spin />
    </div>
  ) : (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        {t('upload')}
      </div>
    </div>
  );

  const handleUpload = ({ file, onSuccess }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    galleryService
      .upload(formData)
      .then(({ data }) => {
        setImage(createImage(data));
        form.setFieldsValue({
          [name]: createImage(data),
        });
        onSuccess('ok');
      })
      .finally(() => setLoading(false));
  };

  const getMediaSource = (filename) => {
    const re = /(?:\.([^.]+))?$/;
    const exec = re.exec(filename);
    switch (exec[1]) {
      case 'mp4':
        return 'video';
      case 'webm':
        return 'video';
      case 'ogg':
        return 'video';
      case 'ogv':
        return 'video';

      default:
        return 'image';
    }
  };

  return (
    <>
      <Upload
        listType='picture-card'
        showUploadList={false}
        onPreview={handlePreview}
        onChange={handleChange}
        customRequest={handleUpload}
        className='picture-card'
        accept={isVideo ? "*" : '.png, .jpg, .jpeg, .webp, .svg, .jfif'} 
        beforeUpload={(file) => {
          const isItAtLeast2MB = file.size / 1024 / 1024 < 2;
          if (!isItAtLeast2MB && !isVideo) {
            toast.error(t('max.2.mb'));
            return false;
          }
          return true;
        }}
      >
        {image?.url && !loading ? (
          getMediaSource(image.url) === 'image' ? (
            <img
              src={image.url}
              alt='avatar'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <img
                src={video_placeholder}
                alt={image.name}
                width={32}
                style={{ objectFit: 'contain' }}
              />
              <p>{t('video.file')}</p>
            </div>
          )
        ) : (
          uploadButton
        )}
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
    </>
  );
};

export default ImageUploadSingle;
