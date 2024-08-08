import { useState } from 'react';
import { Spin, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import galleryService from 'services/gallery';
import { useTranslation } from 'react-i18next';

const ImageGallery = ({ fileList = [], setFileList, type, id }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const createImage = (file) => {
    return {
      uid: file.title,
      name: file.title,
      status: 'done', // done, uploading, error
      url: file.title,
      created: true,
    };
  };

  const createUploadData = (id, img) => {
    const stockIndex = fileList.findIndex((item) => item.id === id);

    if (stockIndex >= 0) {
      const newArray = fileList.map((item) => {
        if (item.id === id) {
          return {
            id,
            images: [...item.images, img],
          };
        } else {
          return item;
        }
      });
      setFileList(newArray);
    } else setFileList((prev) => [...prev, { id, images: [img] }]);
  };
  const handleUpload = ({ file, onSuccess }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    galleryService
      .upload(formData)
      .then(({ data }) => {
        createUploadData(id, createImage(data));
        onSuccess('ok');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRemove = (file) => {
    const updatedData = fileList
      .map((item) => {
        if (item.id === id) {
          const updatedImages = item.images.filter(
            (image) => image.uid !== file.uid
          );
          if (updatedImages.length === 0) {
            // If images array is empty, remove the object
            return null;
          }
          return { ...item, images: updatedImages };
        }
        return item;
      })
      .filter((item) => item !== null);

    setFileList(updatedData);
  };

  const uploadButton = loading ? <Spin /> : <PlusOutlined />;
  const currentFileList = fileList.find((item) => item.id === id) || [];

  return (
    <>
      <Upload
        listType='picture-card'
        fileList={currentFileList?.galleries || currentFileList?.images}
        customRequest={handleUpload}
        onRemove={handleRemove}
        showUploadList={true}
        accept='.png,.jpg,.jpeg,.webp'
        beforeUpload={(file) => {
          const isItAtLeast2MB = file.size / 1024 / 1024 < 2;
          if (!isItAtLeast2MB) {
            message.error(t('max.2.mb'));
            return false;
          }
          return true;
        }}
      >
        {uploadButton}
      </Upload>
    </>
  );
};

export default ImageGallery;
