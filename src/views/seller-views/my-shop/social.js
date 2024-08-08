import React, { Fragment, useEffect, useState } from 'react';
import { Form, Row, Col, Card, Select, Input, Button, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import sellerShopSocialService from 'services/seller/shop-social';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Loading from 'components/loading';
import { defaultSocialMediaOptions } from 'constants/social';
import { disableRefetch } from 'redux/slices/menu';

export default function ShopSocial({ prev, next }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { myShop } = useSelector((state) => state.myShop, shallowEqual);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const [socialList, setSocialList] = useState([
    { type: '', content: '', id: generateShortUUID() },
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  function generateShortUUID(length = 8) {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result;
  }

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
      shop_id: myShop.id,
    };

    sellerShopSocialService
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
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  useEffect(() => {
    if (myShop.id) {
      fetchShopSocial();
    }
  }, [myShop.id]);

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchShopSocial();
    }
  }, [activeMenu.refetch]);

  const onFinish = () => {
    setLoadingBtn(true);

    const body = {
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

    return sellerShopSocialService
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
                      options={defaultSocialMediaOptions}
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
            <Button onClick={prev}>{t('prev')}</Button>
            <Button type='primary' htmlType='submit' loading={!!loadingBtn}>
              {t('next')}
            </Button>
          </Space>
        </Form>
      ) : (
        <Loading />
      )}
    </Fragment>
  );
}
