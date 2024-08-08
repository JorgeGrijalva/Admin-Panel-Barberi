import React, { useEffect, useState, useContext } from 'react';
import { Button, Card, Image, Space, Table } from 'antd';
import brandService from 'services/seller/brands';
import { useTranslation } from 'react-i18next';
import getImage from 'helpers/getImage';
import DeleteButton from 'components/delete-button';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import FilterColumns from 'components/filter-column';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomModal from 'components/modal';
import { Context } from 'context/context';
import CreateBrand from './createBrand';
import moment from 'moment';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import { sellerfetchBrands } from 'redux/slices/brand';
import formatSortType from 'helpers/formatSortType';
import useDidUpdate from 'helpers/useDidUpdate';
import SearchInput from 'components/search-input';

export default function Brands() {
  const { t } = useTranslation();
  const [text, setText] = useState(null);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { brands, meta, loading, params } = useSelector(
    (state) => state.brand,
    shallowEqual,
  );
  const data = activeMenu.data;

  const paramsData = {
    search: data?.search,
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
  };

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `seller/brand/${row.id}`,
        id: 'brand_edit',
        name: t('brands'),
      }),
    );
    navigate(`/seller/brand/${row.id}`);
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
    },
    {
      title: t('image'),
      dataIndex: 'img',
      key: 'img',
      is_show: true,
      render: (img, row) => {
        return (
          <Image
            src={getImage(img)}
            alt='img_gallery'
            width={100}
            height='auto'
            className='rounded'
            preview
            placeholder
            key={img + row.id}
          />
        );
      },
    },
    {
      title: 'created_at',
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
      render: (data, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row)}
              disabled={!row.shop_id}
            />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setId([row.id]);
                setIsModalVisible(true);
                setText(true);
              }}
              disabled={!row.shop_id}
            />
          </Space>
        );
      },
    },
  ]);

  const brandDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };
    brandService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(sellerfetchBrands({}));
        setIsModalVisible(false);
        setId(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(sellerfetchBrands({}));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    dispatch(sellerfetchBrands(paramsData));
  }, [activeMenu.data]);

  function onChangePagination(pagination, filter, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, perPage, page, column, sort },
      }),
    );
  }

  const handleCancel = () => setIsModalOpen(false);

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  // const allDelete = () => {
  //   if (id === null || id.length === 0) {
  //     toast.warning(t('select.the.product'));
  //   } else {
  //     setIsModalVisible(true);
  //     setText(false);
  //   }
  // };
  const goToAdd = () => {
    dispatch(
      addMenu({
        url: `seller/brand/add`,
        id: 'seller/brand/add',
        name: t('add.brand'),
      }),
    );
    navigate(`/seller/brand/add`);
  };

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      }),
    );
  };
  console.log('brands', brands);
  return (
    <Card
      title={t('brands')}
      extra={
        <Space wrap>
          <SearchInput
            placeholder={t('search')}
            handleChange={(e) => handleFilter({ search: e })}
            defaultValue={activeMenu.data?.search}
            resetSearch={!activeMenu.data?.search}
          />
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={goToAdd}
          >
            {t('add.brands')}
          </Button>
          {/* <DeleteButton size='' onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton> */}
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={brands}
        pagination={{
          pageSize: params.perPage,
          page: activeMenu.data?.page || 1,
          total: meta.total,
          defaultCurrent: activeMenu.data?.page,
          current: activeMenu.data?.page,
        }}
        rowKey={(record) => record.id}
        onChange={onChangePagination}
        loading={loading}
      />
      {isModalOpen && (
        <CreateBrand handleCancel={handleCancel} isModalOpen={isModalOpen} />
      )}
      <CustomModal
        click={brandDelete}
        text={text ? t('delete') : t('all.delete')}
        setText={setId}
        loading={loadingBtn}
      />
    </Card>
  );
}
