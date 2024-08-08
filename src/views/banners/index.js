import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Image, Space, Switch, Table } from 'antd';
import { IMG_URL } from 'configs/app-global';
import { useNavigate } from 'react-router-dom';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import CustomModal from 'components/modal';
import { Context } from 'context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch } from 'redux/slices/menu';
import bannerService from 'services/banner';
import { fetchBanners } from 'redux/slices/banner';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import DeleteButton from 'components/delete-button';
import FilterColumns from 'components/filter-column';
import useDidUpdate from 'helpers/useDidUpdate';
import moment from 'moment';

const Banners = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [activeId, setActiveId] = useState(null);
  const [type, setType] = useState(null);
  const { banners, meta, loading } = useSelector(
    (state) => state.banner,
    shallowEqual,
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
      title: t('active'),
      dataIndex: 'active',
      key: 'active',
      is_show: true,
      render: (active, row) => {
        return (
          <Switch
            key={row.id + active}
            onChange={() => {
              setIsModalVisible(true);
              setActiveId(row.id);
              setType(true);
            }}
            checked={active}
          />
        );
      },
    },
    {
      title: t('created.at'),
      dataIndex: 'created_at',
      key: 'created_at',
      is_show: true,
      render: (created_at) => moment(created_at).format('DD.MM.YYYY HH:mm'),
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
              setType(false);
            }}
          />
        </Space>
      ),
    },
  ]);

  const goToAddBanners = () => {
    dispatch(
      addMenu({
        id: 'banner/add',
        url: 'banner/add',
        name: t('add.banner'),
      }),
    );
    navigate('/banner/add');
  };

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `banner/${row.id}`,
        id: 'banner_edit',
        name: t('edit.banner'),
      }),
    );
    navigate(`/banner/${row.id}`);
  };

  const goToClone = (row) => {
    dispatch(
      addMenu({
        url: `banner/clone/${row.id}`,
        id: 'banner_clone',
        name: t('clone.banner'),
      }),
    );
    navigate(`/banner/clone/${row.id}`);
  };

  const bannerDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };
    bannerService
      .delete(params)
      .then(() => {
        dispatch(fetchBanners());
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  useDidUpdate(() => {
    const data = activeMenu.data;
    const paramsData = {
      status: data?.role || 'published',
    };
    dispatch(fetchBanners(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    const data = activeMenu.data;
    const paramsData = {
      status: data?.role || 'published',
    };
    if (activeMenu.refetch) {
      dispatch(fetchBanners(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchBanners({ perPage: pageSize, page: current }));
  };

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

  const handleActive = () => {
    setLoadingBtn(true);
    bannerService
      .setActive(activeId)
      .then(() => {
        setIsModalVisible(false);
        dispatch(fetchBanners());
        toast.success(t('successfully.updated'));
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Card
      title={t('banners')}
      navLInkTo={''}
      extra={
        <Space wrap>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={goToAddBanners}
          >
            {t('add.banner')}
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
        dataSource={banners}
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
        click={type ? handleActive : bannerDelete}
        text={type ? t('set.active.banner') : t('delete.banner')}
        loading={loadingBtn}
        setText={setId}
      />
    </Card>
  );
};

export default Banners;
