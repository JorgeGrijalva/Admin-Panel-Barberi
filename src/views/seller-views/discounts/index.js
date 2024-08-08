import React, { useContext, useEffect, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Image, Space, Switch, Table } from 'antd';
import { toast } from 'react-toastify';
import CustomModal from 'components/modal';
import { Context } from 'context/context';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import discountService from 'services/seller/discount';
import { fetchDiscounts } from 'redux/slices/discount';
import useDidUpdate from 'helpers/useDidUpdate';
import formatSortType from 'helpers/formatSortType';
import { useTranslation } from 'react-i18next';
import getImage from 'helpers/getImage';
import DeleteButton from 'components/delete-button';
import FilterColumns from 'components/filter-column';

export default function SellerDiscounts() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [active, setActive] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [text, setText] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { discounts, meta, loading, params } = useSelector(
    (state) => state.discount,
    shallowEqual,
  );

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `discount/${row.id}`,
        id: 'discount_edit',
        name: t('edit.discount'),
      }),
    );
    navigate(`/discount/${row.id}`);
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
      title: t('image'),
      dataIndex: 'img',
      key: 'img',
      is_show: true,
      render: (img, row) => (
        <Image
          src={getImage(img)}
          alt={row.type}
          width={100}
          className='rounded'
          preview
          placeholder
        />
      ),
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      is_show: true,
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      is_show: true,
    },
    {
      title: t('start.date'),
      dataIndex: 'start',
      key: 'start',
      is_show: true,
    },
    {
      title: t('end.date'),
      dataIndex: 'end',
      key: 'end',
      is_show: true,
    },
    {
      title: t('active'),
      dataIndex: 'active',
      key: 'active',
      is_show: true,
      render: (_, row) => (
        <Switch
          onChange={() => {
            setIsModalVisible(true);
            setId([row.id]);
            setActive(true);
          }}
          checked={row.active}
        />
      ),
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
                setActive(false);
                setIsModalVisible(true);
                setText(true);
              }}
            />
          </Space>
        );
      },
    },
  ]);

  const discountDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };
    discountService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchDiscounts({}));
        setIsModalVisible(false);
      })
      .finally(() => {
        setId(null);
        setLoadingBtn(false);
      });
  };

  const discountSetActive = () => {
    setLoadingBtn(true);
    discountService
      .setActive(id[0])
      .then(() => {
        toast.success(t('successfully.updated'));
        dispatch(fetchDiscounts({}));
        setIsModalVisible(false);
        setActive(true);
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      batch(() => {
        dispatch(fetchDiscounts({}));
        dispatch(disableRefetch(activeMenu));
      });
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    const data = activeMenu.data;
    const paramsData = {
      sort: data?.sort,
      column: data?.column,
      perPage: data?.perPage,
      page: data?.page,
    };
    dispatch(fetchDiscounts(paramsData));
  }, [activeMenu.data]);

  function onChangePagination(pagination, filters, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({ activeMenu, data: { perPage, page, column, sort } }),
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
      setText(false);
    }
  };

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'add-restaurant',
        url: `discount/add`,
        name: t('add.discount'),
      }),
    );
    navigate(`/discount/add`);
  };

  return (
    <Card
      title={t('discounts')}
      extra={
        <Space wrap>
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAdd}
          >
            {t('add.discount')}
          </Button>
          <DeleteButton onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={discounts}
        pagination={{
          pageSize: params.perPage,
          page: params.page,
          total: meta.total,
          defaultCurrent: params.page,
        }}
        rowKey={(record) => record.id}
        onChange={onChangePagination}
        loading={loading}
      />
      <CustomModal
        click={active ? discountSetActive : discountDelete}
        text={
          active
            ? t('set.active.discount')
            : text
            ? t('delete')
            : t('all.delete')
        }
        setText={setId}
        loading={loadingBtn}
        setActive={setActive}
      />
    </Card>
  );
}
