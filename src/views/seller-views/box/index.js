import React, { useContext, useEffect, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Image, Space, Table } from 'antd';
import { toast } from 'react-toastify';
import { IMG_URL } from '../../../configs/app-global';
import CustomModal from '../../../components/modal';
import { Context } from '../../../context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import DeleteButton from '../../../components/delete-button';
import FilterColumns from '../../../components/filter-column';
import useDidUpdate from '../../../helpers/useDidUpdate';
import formatSortType from '../../../helpers/formatSortType';
import { fetchSellerBoxes } from '../../../redux/slices/box';
import numberToPrice from '../../../helpers/numberToPrice';
import sellerBoxService from '../../../services/seller/box';

const Boxes = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [text, setText] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [role, setRole] = useState('published');
  const immutable = activeMenu.data?.role || role;
  const data = activeMenu?.data;
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual
  );

  const paramsData = {
    sort: data?.sort,
    column: data?.column,
    search: data?.search ? data.search : undefined,
    perPage: data?.perPage,
    page: data?.page,
  };

  const { sellerBoxes, meta, loading } = useSelector(
    (state) => state.box,
    shallowEqual
  );

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `seller/box/edit/${row.id}`,
        id: 'box_edit',
        name: t('edit.box'),
      })
    );
    navigate(`/seller/box/edit/${row.id}`, { state: 'edit' });
  };

  const goToAddBox = () => {
    dispatch(
      addMenu({
        id: 'box_add',
        url: 'seller/box/add',
        name: t('add.box'),
      })
    );
    navigate('/seller/box/add');
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
      sorter: true,
    },
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      render: (_, row) => row.translation?.title,
      is_show: true,
    },
    {
      title: t('shop'),
      dataIndex: 'shop',
      key: 'shop',
      is_show: true,
      render: (img, row) => {
        return (
          <Space>
            <Image
              src={IMG_URL + row.shop.logo_img}
              alt='img_gallery'
              width={100}
              height='auto'
              className='rounded'
              preview
              placeholder
              key={img + row.id}
            />
            <span>{row.shop.translation?.title}</span>
          </Space>
        );
      },
    },
    {
      title: t('discount'),
      dataIndex: 'discount',
      key: 'discount',
      is_show: true,
      render: (_, row) =>
        row.discount_type === 'fix'
          ? numberToPrice(row.discount_price, defaultCurrency.symbol)
          : `${row.discount_price} %`,
    },
    {
      title: t('options'),
      key: 'options',
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row)}
            />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setId([row.id]);
                setIsModalVisible(true);
                setText(true);
              }}
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
        }))
      ),
    };
    sellerBoxService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchSellerBoxes(paramsData));
        setIsModalVisible(false);
        setText(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  function onChangePagination(pagination, filter, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, perPage, page, column, sort },
      })
    );
  }

  useDidUpdate(() => {
    dispatch(fetchSellerBoxes(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchSellerBoxes(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

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
      setText(false);
    }
  };

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      })
    );
  };

  return (
    <>
      <Card className='p-0'>
        <Space wrap className='justify-content-end w-100'>
          <DeleteButton size='' onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={goToAddBox}
          >
            {t('add.box')}
          </Button>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      </Card>

      <Card title={t('boxes')}>
        <Table
          scroll={{ x: true }}
          rowSelection={rowSelection}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={sellerBoxes}
          pagination={{
            pageSize: meta.per_page,
            page: meta.current_page,
            total: meta.total,
          }}
          rowKey={(record) => record.id}
          onChange={onChangePagination}
          loading={loading}
        />
      </Card>
      <CustomModal
        click={brandDelete}
        text={text ? t('delete') : t('all.delete')}
        setText={setId}
        loading={loadingBtn}
      />
    </>
  );
};

export default Boxes;
