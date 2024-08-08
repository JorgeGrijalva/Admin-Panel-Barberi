import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Image, Space, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import CustomModal from '../../../components/modal';
import { Context } from '../../../context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch } from '../../../redux/slices/menu';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import DeleteButton from '../../../components/delete-button';
import storeisService from '../../../services/seller/storeis';
import { fetchStoreis } from '../../../redux/slices/storeis';
import FilterColumns from '../../../components/filter-column';
import useDemo from '../../../helpers/useDemo';

const Storeis = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [text, setText] = useState(null);
  const { isDemo } = useDemo();

  const goToEdit = (row) => {
    if (isDemo) {
      toast.warning(t('cannot.work.demo'));
      return;
    }
    dispatch(
      addMenu({
        url: `seller/story/${row.id}`,
        id: 'story_edit',
        name: t('edit.story'),
      })
    );
    navigate(`/seller/story/${row.id}`);
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('image'),
      dataIndex: 'file_urls',
      key: 'file_urls',
      is_show: true,
      render: (file_urls) => {
        return (
          <Image
            src={file_urls ? file_urls[0] : 'https://via.placeholder.com/150'}
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
      title: t('product'),
      dataIndex: 'stock',
      key: 'stock',
      is_show: true,
      render: (_, row) => row?.product?.translation?.title,
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
          <DeleteButton
            icon={<DeleteOutlined />}
            onClick={() => {
              setIsModalVisible(true);
              setId([row.id]);
              setText(true);
            }}
          />
        </Space>
      ),
    },
  ]);

  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { myShop: shop } = useSelector((state) => state.myShop, shallowEqual);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { storeis, meta, loading } = useSelector(
    (state) => state.storeis,
    shallowEqual
  );

  const bannerDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    storeisService
      .delete(params)
      .then(() => {
        dispatch(fetchStoreis());
        toast.success(t('successfully.deleted'));
      })
      .finally(() => {
        setIsModalVisible(false);
        setLoadingBtn(false);
      });
  };

  useEffect(() => {
    const data = {
      shop_id: shop.id,
    };
    if (activeMenu.refetch) {
      dispatch(fetchStoreis(data));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(
      fetchStoreis({ perPage: pageSize, page: current, shop_id: shop.id })
    );
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setId(newSelectedRowKeys);
  };

  const rowSelection = {
    id,
    onChange: onSelectChange,
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
    if (isDemo) {
      toast.warning(t('cannot.work.demo'));
      return;
    }
    dispatch(
      addMenu({
        id: 'add.story',
        url: `seller/story/add`,
        name: t('add.story'),
      })
    );
    navigate(`/seller/story/add`);
  };

  return (
    <Card
      title={t('stories')}
      extra={
        <Space>
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAdd}
          >
            {t('add.story')}
          </Button>
          <DeleteButton className='' type='danger' onClick={allDelete}>
            {t('delete.all')}
          </DeleteButton>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={storeis}
        pagination={{
          pageSize: meta.per_page,
          page: meta.current_page,
          total: meta.total,
        }}
        rowKey={(record) => record.id}
        loading={loading}
        onChange={onChangePagination}
      />
      <CustomModal
        click={bannerDelete}
        text={text ? t('delete') : t('all.delete')}
        setText={setId}
        loading={loadingBtn}
      />
    </Card>
  );
};

export default Storeis;
