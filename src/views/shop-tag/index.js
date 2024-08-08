import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Image, Space, Table, Tag } from 'antd';
import { IMG_URL } from '../../configs/app-global';
import { useNavigate } from 'react-router-dom';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import CustomModal from '../../components/modal';
import { Context } from '../../context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from '../../redux/slices/menu';
import shopTagService from '../../services/shopTag';
import { fetchShopTag } from '../../redux/slices/shopTag';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import DeleteButton from '../../components/delete-button';
import FilterColumns from '../../components/filter-column';
import useDidUpdate from '../../helpers/useDidUpdate';
import moment from 'moment';
import formatSortType from '../../helpers/formatSortType';

const colors = ['blue', 'red', 'gold', 'volcano', 'cyan', 'lime'];

const ShopTag = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [role, setRole] = useState('published');
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { shopTag, meta, loading, params } = useSelector(
    (state) => state.shopTag,
    shallowEqual
  );
  const [id, setId] = useState(null);
  const data = activeMenu.data;
  const immutable = data?.role || role;
  const paramsData = {
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
    status: immutable,
  };
  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      is_show: true,
    },
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      is_show: true,
      render: (_, row) => row.translation?.title,
    },
    {
      title: t('translations'),
      dataIndex: 'locales',
      is_show: true,
      render: (_, row) => (
        <Space>
          {row.locales?.map((item, index) => (
            <Tag color={[colors[index]]} className='text-uppercase'>
              {item}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: t('image'),
      dataIndex: 'img',
      key: 'img',
      is_show: true,
      render: (img, row) => {
        return (
          <Image
            src={IMG_URL + img}
            alt='img_gallery'
            width={100}
            className='rounded'
            preview
            placeholder
          />
        );
      },
    },
    {
      title: t('created.at'),
      dataIndex: 'created_at',
      key: 'created_at',
      is_show: true,
      render: (created_at) => moment(created_at).format('YYYY-MM-DD'),
    },
    {
      title: t('options'),
      key: 'options',
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => (
        <Space>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => goToEdit(row)}
          />
          <Button icon={<CopyOutlined />} onClick={() => goToClone(row)} />
          <DeleteButton
            icon={<DeleteOutlined />}
            onClick={() => {
              setIsModalVisible(true);
              setId([row.id]);
            }}
          />
        </Space>
      ),
    },
  ]);

  const goToAddBanners = () => {
    dispatch(
      addMenu({
        id: 'shop-tag/add',
        url: 'shop-tag/add',
        name: t('add.shop.tag'),
      })
    );
    navigate('/shop-tag/add');
  };

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `shop-tag/${row.id}`,
        id: 'shop_tag_edit',
        name: t('edit.shop.tag'),
      })
    );
    navigate(`/shop-tag/${row.id}`);
  };

  const goToClone = (row) => {
    dispatch(
      addMenu({
        url: `shop-tag/clone/${row.id}`,
        id: 'shop_tag_clone',
        name: t('clone.shop.tag'),
      })
    );
    navigate(`/shop-tag/clone/${row.id}`);
  };

  const tagDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    shopTagService
      .delete(params)
      .then(() => {
        dispatch(fetchShopTag());
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  useDidUpdate(() => {
    dispatch(fetchShopTag(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchShopTag(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  function onChangePagination(pagination, filter, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, perPage, page, column, sort },
      })
    );
  }

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  const allDelete = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
    }
  };

  return (
    <Card
      title={t('shop.tags')}
      extra={
        <Space wrap>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={goToAddBanners}
          >
            {t('add.tag')}
          </Button>
          <DeleteButton size='' onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>
          <FilterColumns setColumns={setColumns} columns={columns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={shopTag}
        pagination={{
          pageSize: params.perPage,
          page: activeMenu.data?.page || 1,
          total: meta.total,
          defaultCurrent: activeMenu.data?.page,
          current: activeMenu.data?.page,
        }}
        rowKey={(record) => record.id}
        loading={loading}
        onChange={onChangePagination}
      />
      <CustomModal
        click={tagDelete}
        text={t('delete')}
        loading={loadingBtn}
        setText={setId}
      />
    </Card>
  );
};

export default ShopTag;
