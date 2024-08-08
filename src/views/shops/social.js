import React, { Fragment, useEffect, useState } from 'react';
import { Form, Row, Col, Card, Select, Input, Button, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import shopSocialService from 'services/shop-social';
import Loading from 'components/loading';
import { useParams } from 'react-router-dom';
import shopService from 'services/shop';
import { defaultSocialMediaOptions } from 'constants/social';

const generateShortUUID = (length = 8) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
};

export default function ShopSocial({ prev, next }) {
  const { t } = useTranslation();
  const { uuid } = useParams();

  const [shop, setShop] = useState(null);
  const [socialMediaOptions, setSocialMediaOptions] = useState(
    defaultSocialMediaOptions,
  );
  const [socialList, setSocialList] = useState([
    { type: '', content: '', id: generateShortUUID() },
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const addSocialMedia = () => {
    setSocialList([
      ...socialList,
      { type: '', content: '', id: generateShortUUID() },
    ]);
  };

  const removeSocialMedia = (remove) => {
    setSocialList(socialList.filter((item) => item.id !== remove.id));
  };

  const handleChange = (type, changeId, value) => {
    setSocialList(
      socialList.flatMap((item) =>
        item.id === changeId ? { ...item, [type]: value } : item,
      ),
    );
  };

  const fetchShopSocial = () => {
    setLoading(true);

    const paramsData = {
      shop_id: shop?.id,
    };

    shopSocialService
      .getAll(paramsData)
      .then((res) => {
        if (res.data?.length) {
          setSocialList(
            res.data.map((item) => ({
              type: item.type,
              content: item.content,
              id: generateShortUUID(),
            })),
          );
        }
      })
      .finally(() => setLoading(false));
  };

  const fetchShop = () => {
    setLoading(true);
    shopService.getById(uuid).then((res) => setShop(res.data));
  };

  useEffect(() => {
    if (!shop) {
      fetchShop();
      return;
    }
    fetchShopSocial();
  }, [shop?.id]);

  const onFinish = () => {
    setLoadingBtn(true);

    const body = {
      shop_id: shop?.id,
      data: socialList
        .map((item) => {
          if (!item.type || !item.content) return null;
          return {
            type: item.type,
            content: item.content,
          };
        })
        .filter((item) => !!item),
    };

    return shopSocialService
      .create(body)
      .then(() => next())
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Fragment>
      {!loading ? (
        <Form onFinish={onFinish} layout='vertical'>
          <Card>
            {socialList.map((socialItem, index) => (
              <Row gutter={12} key={index}>
                <Col span={9}>
                  <Form.Item label={t('type')}>
                    <Select
                      showSearch={true}
                      options={socialMediaOptions}
                      value={socialItem.type}
                      onChange={(value) =>
                        handleChange('type', socialItem.id, value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t('url')}>
                    <Input
                      value={socialItem.content}
                      onChange={(value) =>
                        handleChange(
                          'content',
                          socialItem.id,
                          value.target.value,
                        )
                      }
                    />
                  </Form.Item>
                </Col>
                {socialList.length > 1 && (
                  <Col
                    span={3}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Button
                      type='primary'
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeSocialMedia(socialItem)}
                    />
                  </Col>
                )}
              </Row>
            ))}
            <Button
              className='w-100 my-3'
              type='dashed'
              onClick={addSocialMedia}
            >
              {t('add.social')}
            </Button>
          </Card>

          <Space className='mt-4'>
            <Button type='primary' htmlType='submit' loading={!!loadingBtn}>
              {t('next')}
            </Button>
            <Button onClick={prev}>{t('prev')}</Button>
          </Space>
        </Form>
      ) : (
        <Loading />
      )}
    </Fragment>
  );
}
