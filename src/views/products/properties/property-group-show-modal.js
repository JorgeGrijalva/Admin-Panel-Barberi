import { Descriptions, Modal, Image, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from 'components/loading';
import { IMG_URL } from 'configs/app-global';
import propertyService from 'services/property';

export default function PropertyGroupShowModal({ open, handleClose }) {
  const { t } = useTranslation();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchPropertyValue = () => {
    setLoading(true);
    propertyService
      .getGroupById(open)
      .then((res) => {
        setData(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPropertyValue();
  }, []);
  return (
    <Modal
      closable={false}
      visible={open}
      footer={null}
      centered
      onCancel={handleClose}
    >
      {!loading ? (
        <Descriptions title={`${t('property.group.value')}`} bordered>
          {data?.values?.map((item, index) => (
            <Descriptions.Item
              key={index}
              label={data.translation.title}
              span={3}
            >
              {data.type === 'text' ? (
                item.value
              ) : data.type === 'image' ? (
                <Image
                  src={IMG_URL + item.value}
                  alt='images'
                  width={100}
                  height={80}
                />
              ) : (
                <Space>
                  <div
                    className='extra-color-wrapper-contain'
                    style={{ backgroundColor: item.value }}
                  />
                  {item.value}
                </Space>
              )}
            </Descriptions.Item>
          ))}
        </Descriptions>
      ) : (
        <Loading />
      )}
    </Modal>
  );
}
