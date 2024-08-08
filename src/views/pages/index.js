import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Image, Space, Table } from 'antd';
import { IMG_URL } from 'configs/app-global';
import { useNavigate } from 'react-router-dom';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import CustomModal from 'components/modal';
import { Context } from 'context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch } from 'redux/slices/menu';
import pagesService from 'services/pages';
import { fetchPages } from 'redux/slices/pages';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import DeleteButton from 'components/delete-button';
import FilterColumns from 'components/filter-column';
import RiveResult from 'components/rive-result';

const Page = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { pages, meta, loading } = useSelector(
    (state) => state.pages,
    shallowEqual
  );
  const [id, setId] = useState(null);

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
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
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      is_show: true,
      render: (type) => type.toUpperCase(),
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
              setId([row.type]);
            }}
          />
        </Space>
      ),
    },
  ]);

  const goToAddBanners = () => {
    dispatch(
      addMenu({
        id: 'page_add',
        url: 'page/add',
        name: t('add.page'),
      })
    );
    navigate('/page/add');
  };

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        id: 'page_edit',
        url: `page/${row.id}`,
        name: t('edit.page'),
      })
    );
    navigate(`/page/${row.id}`);
  };

  const pageDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    pagesService
      .delete(params)
      .then(() => {
        dispatch(fetchPages());
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchPages());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchPages({ perPage: pageSize, page: current }));
  };

  return (
    <Card
      title={t('pages')}
      navLInkTo={''}
      extra={
        <Space wrap>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={goToAddBanners}
          >
            {t('add.pages')}
          </Button>

          <FilterColumns setColumns={setColumns} columns={columns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={pages}
        loading={loading}
        pagination={{
          pageSize: meta.per_page,
          page: meta.current_page,
          total: meta.total,
        }}
        rowKey={(record) => record.id}
        locale={{
          emptyText: <RiveResult />,
        }}
        onChange={onChangePagination}
      />
      <CustomModal
        click={pageDelete}
        text={t('delete')}
        loading={loadingBtn}
        setText={setId}
      />
    </Card>
  );
};

export default Page;
