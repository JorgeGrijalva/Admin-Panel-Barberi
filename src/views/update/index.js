import React, { useState } from 'react';
import { Card, Button } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Dragger from 'antd/lib/upload/Dragger';
import { CloudUploadOutlined, InboxOutlined } from '@ant-design/icons';
import updateService from '../../services/update';
import { setMenuData } from '../../redux/slices/menu';
import { toast } from 'react-toastify';

export default function Update() {
  const [loadingBtn, setLoadingBtn] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const updateBackend = () => {
    setLoadingBtn(true);
    updateService
      .update()
      .then(() => toast.success(t('successfully.updated')))
      .finally(() => setLoadingBtn(false));
  };

  const createFile = (file) => {
    return {
      uid: file.title,
      name: file.title,
      status: 'done',
      url: file.title,
      created: true,
    };
  };

  const handleUpload = ({ file, onSuccess }) => {
    const formData = new FormData();
    formData.append('file', file);
    updateService.upload(formData).then(({ data }) => {
      dispatch(setMenuData({ activeMenu, data: createFile(data) }));
      onSuccess('ok');
    });
  };

  const beforeUpload = (file) => {
    const isPNG = file.type === 'image/png';
    const isJPG = file.type === 'image/jpg';
    const isJPEG = file.type === 'image/jpeg';
    if (isPNG || isJPEG || isJPG) {
      toast.error(`${file.name} is not valid file`);
      return false;
    }
  };

  return (
    <Card
      title={t('update')}
      extra={
        <Button
          type='primary'
          icon={<CloudUploadOutlined />}
          loading={loadingBtn}
          onClick={updateBackend}
        >
          {t('update.database')}
        </Button>
      }
    >
      <Dragger
        name='file'
        multiple={false}
        maxCount={1}
        customRequest={handleUpload}
        defaultFileList={activeMenu?.data ? [activeMenu?.data] : null}
        beforeUpload={beforeUpload}
      >
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>
          Click or drag file to this area to upload
        </p>
        <p className='ant-upload-hint'>
          In order to update database using this file you need to click button
          above
        </p>
      </Dragger>
    </Card>
  );
}
