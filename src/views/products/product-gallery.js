import React, { useEffect, useMemo, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { t } from 'i18next';
import { Badge, Button, Card, Col, Divider, Row, Space, Tooltip } from 'antd';
import { GetColorName } from 'hex-color-to-color-name';
import { shallowEqual, useSelector } from 'react-redux';
import MediaUploadExtrasImage from 'components/upload/upload-extras-image';
import productService from 'services/product';
const text = 'In the process of internal desktop applications development';

const ProductGallery = ({ prev, next }) => {
  const [fileList, setFileList] = useState([]);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { newExtras } = activeMenu?.data || {};
  const filteredExtras = useMemo(
    () => newExtras?.find((item) => item?.group?.type === 'color'),
    [newExtras]
  );
  const uniqueData = Array.from(
    new Set(filteredExtras?.values?.map((item) => item.value))
  ).map((value) => {
    return filteredExtras?.values?.find((item) => item.value === value);
  });
  const colorItems = uniqueData.filter((item) => item.group_type === 'color');

  const createImage = (file) => {
    return {
      uid: file.path,
      name: file.path,
      status: 'done', // done, uploading, error
      url: file.path,
      created: true,
    };
  };
  const setInitialState = () => {
    const newArray = activeMenu.data.stocks.map(({ id, galleries }) => ({
      id,
      images: galleries?.map(createImage) || [],
    }));
    setFileList(newArray);
  };

  const updateStocks = () => {
    if (!fileList.length) {
      next();
      return;
    }
    const array = fileList.map((item) => {
      return {
        ...item,
        images: item.images.map((img) => img.name),
      };
    });
    productService
      .updateStocks({ data: array })
      .then(() => {
        next();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setInitialState();
  }, [activeMenu.data]);

  return (
    <Card
      title={
        <Tooltip placement='topLeft' title={text}>
          <Space>
            {t('add.media.file')}
            <QuestionCircleOutlined
              style={{ fontSize: 16, cursor: 'pointer' }}
            />
          </Space>
        </Tooltip>
      }
    >
      <Row gutter={[24, 24]}>
        {colorItems?.map(({ label, stock_id, value }) => (
          <>
            <Col span={24}>
              <Space className='mb-4'>
                <Badge
                  color={label || value}
                  className='extras-color-badge'
                  text={`${label || value} - ${GetColorName(label || value)}`}
                />
              </Space>
              <MediaUploadExtrasImage
                id={stock_id}
                fileList={fileList}
                setFileList={setFileList}
                type='stocks'
              />
            </Col>
            <Divider />
          </>
        ))}
      </Row>
      <Space className='mt-4'>
        <Button onClick={prev}>{t('prev')}</Button>
        <Button type='primary' htmlType='submit' onClick={updateStocks}>
          {t('next')}
        </Button>
      </Space>
    </Card>
  );
};

export default ProductGallery;
