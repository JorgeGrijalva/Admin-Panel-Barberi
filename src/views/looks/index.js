import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Button, Space, Switch, Table, Image, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { IMG_URL } from 'configs/app-global';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import DeleteButton from 'components/delete-button';
import SearchInput from 'components/search-input';
import { Context } from 'context/context';
import { toast } from 'react-toastify';
import CustomModal from 'components/modal';
import { shallowEqual, useSelector, useDispatch, batch } from 'react-redux';
import useDidUpdate from 'helpers/useDidUpdate';
import { fetchLooks } from 'redux/slices/looks';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import looksService from 'services/banner';
import { useNavigate } from 'react-router-dom';

export default function Looks() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { looks, loading, params, meta } = useSelector(
    (state) => state.looks,
    shallowEqual,
  );

  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [active, setActive] = useState(false);

  const paramsData = {
    search: activeMenu?.data?.search ?? null,
    ...params,
  };

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      is_show: true,
      render: (_, record) => record?.translation?.title,
    },
    {
      title: t('image'),
      dataIndex: 'img',
      key: 'img',
      is_show: true,
      render: (_, record) => (
        <Image
          width={100}
          height={100}
          src={
            !!record?.img
              ? IMG_URL + record?.img
              : 'https://via.placeholder.com/150'
          }
          preview={!!record?.img}
          placeholder
          style={{ borderRadius: 4, objectFit: 'cover' }}
        />
      ),
    },
    {
      title: t('created.at'),
      dataIndex: 'created_at',
      key: 'created_at',
      is_show: true,
      render: (_, record) =>
        moment(record?.created_at).format('DD-MM-YYYY HH:mm'),
    },
    {
      title: t('active'),
      dataIndex: 'active',
      key: 'active',
      is_show: true,
      render: (_, record) => {
        return (
          <Switch
            onChange={() => {
              setId([record?.id]);
              setActive(true);
              setIsModalVisible(true);
            }}
            checked={record?.active}
          />
        );
      },
    },
    {
      title: t('options'),
      dataIndex: 'options',
      is_show: true,
      render: (_, record) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(record?.id)}
            />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setIsModalVisible(true);
                setId([record.id]);
                setActive(false);
              }}
            />
          </Space>
        );
      },
    },
  ];

  const handleActive = () => {
    setLoadingBtn(true);
    looksService
      .setActive(id)
      .then(() => {
        dispatch(fetchLooks({ paramsData }));
        toast.success(t('successfully.updated'));
        setIsModalVisible(false);
        setActive(false);
        setId(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  const handleDeleteLook = () => {
    setLoadingBtn(true);

    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };

    looksService
      .delete(params)
      .then(() => {
        dispatch(fetchLooks({ paramsData }));
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
        setActive(false);
        setId(null);
      })
      .finally(() => setLoadingBtn(false));
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

  const deleteSelected = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
    }
  };

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  const clearData = () => {
    dispatch(
      setMenuData({
        activeMenu,
        data: null,
      }),
    );
  };

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'look_add',
        url: 'catalog/looks/add',
        name: 'add.look',
      }),
    );
    clearData();
    navigate('add');
  };

  const goToEdit = (id) => {
    dispatch(
      addMenu({
        id: 'look_edit',
        url: `catalog/looks/${id}`,
        name: 'edit.look',
      }),
    );
    clearData();
    navigate(`${id}`);
  };

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;

    const params = {
      ...paramsData,
      perPage: pageSize,
      page: current,
    };

    dispatch(fetchLooks(params));
  };

  useDidUpdate(() => {
    dispatch(fetchLooks(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      batch(() => {
        dispatch(fetchLooks(paramsData));
        dispatch(disableRefetch(activeMenu));
      });
    }
  }, [activeMenu.refetch]);

  return (
    <Fragment>
      <Card className='p-0'>
        <Space wrap size={[14, 20]}>
          <SearchInput
            placeholder={t('search')}
            style={{ minWidth: 300 }}
            handleChange={(e) => handleFilter({ search: e })}
          />
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAdd}
          >
            {t('add.looks')}
          </Button>
          <DeleteButton icon={<DeleteOutlined />} onClick={deleteSelected}>
            {t('delete.selected')}
          </DeleteButton>
        </Space>
      </Card>
      <Card>
        <Table
          scroll={{ x: true }}
          rowKey={(record) => record.id}
          rowSelection={rowSelection}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={looks}
          loading={loading}
          pagination={{
            pageSize: meta.per_page,
            page: meta.current_page,
            total: meta.total,
          }}
          onChange={onChangePagination}
        />
      </Card>
      <CustomModal
        click={active ? handleActive : handleDeleteLook}
        text={
          active
            ? t('set.active')
            : t('are.you.sure.you.want.to.delete.the.selected.products')
        }
        loading={loadingBtn}
        setActive={setActive}
      />
    </Fragment>
  );
}
