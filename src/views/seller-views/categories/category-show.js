import React, { useState, useEffect } from 'react';
import { Card, Col, Image, Modal, Row, Space, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch } from 'redux/slices/menu';
import categoryService from 'services/seller/category';
import { IMG_URL } from 'configs/app-global';
import { useTranslation } from 'react-i18next';
import CategoryList from './category-list';
import SubcategoryAdd from './subcategory-add';

const CategoryShow = () => {
  const { t } = useTranslation();
  const { uuid } = useParams();
  const dispatch = useDispatch();
  const [categoryId, setCategoryId] = useState(null);
  const [data, setData] = useState({});
  const [id, setId] = useState(null);
  const [isRefetch, setIsRefetch] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [loading, setLoading] = useState(false);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  const createImage = (name) => {
    return {
      name,
      url: IMG_URL + name,
    };
  };

  function getLanguageFields(data) {
    if (!data) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.title,
      [`description[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.description,
    }));
    return Object.assign({}, ...result);
  }

  const getCategory = (alias) => {
    setLoading(true);
    categoryService
      .getById(alias)
      .then((res) => {
        let category = res.data;
        const body = {
          ...category,
          ...getLanguageFields(category),
          image: [createImage(category.img)],
          keywords: category?.keywords?.split(','),
          parent_id: {
            label: category.parent?.translation?.title,
            value: category.parent_id,
            key: category.parent_id,
          },
        };
        setData(body);
        setCategoryId(category.id);
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  const handleAddAction = (id) => {
    setId(id);
  };

  const handleCancel = () => {
    setId(null);
  };

  useEffect(() => {
    if (uuid) getCategory(uuid);
  }, [activeMenu.refetch, uuid]);

  return (
    <>
      <Row gutter={24} className='mb-4'>
        <Col span={8}>
          <Card
            title={t('basic.info')}
            style={{ height: '100%' }}
            loading={loading}
          >
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Space>
                  <strong>{t('category.name')}:</strong>
                  <span>{data?.translation?.title}</span>
                </Space>
              </Col>
              <Col span={24}>
                <Space>
                  <strong>{t('category.description')}:</strong>
                  <span>{data[`description[${defaultLang || 'en'}]`]}</span>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={t('organization')}
            style={{ height: '100%' }}
            loading={loading}
          >
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Space>
                  <strong>{t('keyword')}:</strong>
                  {data?.keywords?.map((item, key) => (
                    <Tag key={key}>{item}</Tag>
                  ))}
                </Space>
              </Col>
              <Col span={24}>
                <Space>
                  <strong>{t('parent.category')}:</strong>
                  <span>{data?.parent?.translation?.title}</span>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={t('media')} style={{ height: '100%' }} loading={loading}>
            <Space wrap>
              {data?.image?.map((item) => (
                <Image src={item.url} width={100} height={100} />
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
      {!!categoryId && (
        <CategoryList
          type={data?.type === 'main' ? 'sub_main' : 'child'}
          parent_type={data?.type}
          parentId={categoryId}
          handleAddAction={handleAddAction}
          isRefetch={isRefetch}
        />
      )}
      <Modal
        title={t('add.subcategory')}
        visible={id}
        onCancel={handleCancel}
        centered
        footer={null}
        destroyOnClose
      >
        <SubcategoryAdd
          setId={setId}
          id={id}
          setIsRefetch={setIsRefetch}
          parent={{
            parent_id: {
              label: data[`title[${defaultLang}]`],
              value: data?.id,
            },
            id: data?.id,
            type: data?.type,
          }}
        />
      </Modal>
    </>
  );
};
export default CategoryShow;
