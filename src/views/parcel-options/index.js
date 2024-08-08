import React, { useContext, useEffect, useState } from 'react';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Table, Space, Card, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Context } from '../../context/context';
import CustomModal from '../../components/modal';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from '../../redux/slices/menu';
import parcelOptionService from '../../services/parcel-option';
import { fetchParcelOptions } from '../../redux/slices/parcel-option';
import { useTranslation } from 'react-i18next';
import FilterColumns from '../../components/filter-column';
import DeleteButton from '../../components/delete-button';
import SearchInput from '../../components/search-input';
import useDidUpdate from '../../helpers/useDidUpdate';
import moment from 'moment';

export default function Units() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [uuid, setUUID] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { setIsModalVisible } = useContext(Context);
  const [text, setText] = useState(null);
  const [active, setActive] = useState(null);

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        id: 'option.edit',
        url: `options/${row.id}`,
        name: t('edit.option'),
      })
    );
    navigate(`/options/${row.id}`);
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
      title: t('name'),
      dataIndex: 'translation',
      is_show: true,
      render: (translation) => translation?.title,
    },
    {
      title: t('created_at'),
      dataIndex: 'created_at',
      is_show: true,
      render: (created_at) => moment(created_at).format("YYYY-MM-DD hh:mm")
    },
    {
      title: t('options'),
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
              onClick={() => {
                setUUID([row.id]);
                setIsModalVisible(true);
                setText(true);
                setActive(false);
              }}
            />
          </Space>
        );
      },
    },
  ]);

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { options, meta, loading, params } = useSelector(
    (state) => state.parcelOptions,
    shallowEqual
  );

  const unitDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...uuid.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    parcelOptionService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
        setText(null);
        setActive(false);
        dispatch(fetchParcelOptions());
      })
      .finally(() => setLoadingBtn(false));
  };

  function formatSortType(type) {
    switch (type) {
      case 'ascend':
        return 'asc';

      case 'descend':
        return 'desc';

      default:
        break;
    }
  }

  function onChange(pagination, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(fetchParcelOptions({ ...params, perPage, page, column, sort }));
  }

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchParcelOptions());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const goToAddUnit = () => {
    dispatch(
      addMenu({
        id: 'options_ad',
        url: 'options/add',
        name: t('add.option'),
      })
    );
    navigate('/options/add');
  };

  const rowSelection = {
    selectedRowKeys: uuid,
    onChange: (key) => {
      setUUID(key);
    },
  };

  const allDelete = () => {
    if (uuid === null || uuid.length === 0) {
      toast.warning(t('select.the.option'));
    } else {
      setIsModalVisible(true);
      setText(false);
    }
  };

  const handleFilter = (item, name) => {
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, [name]: item },
      })
    );
  };

  useDidUpdate(() => {
    const data = activeMenu.data;
    const paramsData = {
      search: data?.search,
    };
    dispatch(fetchParcelOptions(paramsData));
  }, [activeMenu.data]);

  return (
    <Card
      title={t('options')}
      extra={
        <Space wrap>
          <Button
            type='primary'
            onClick={goToAddUnit}
            icon={<PlusCircleOutlined />}
          >
            {t('add.option')}
          </Button>
          <DeleteButton size='' onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>

          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <div className='d-flex justify-content-between'>
        <SearchInput
          placeholder={t('search')}
          className='w-25'
          handleChange={(search) => handleFilter(search, 'search')}
          defaultValue={activeMenu.data?.search}
          resetSearch={!activeMenu.data?.search}
        />
      </div>

      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        loading={loading}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={options}
        pagination={{
          pageSize: params.perPage,
          page: params.page,
          total: meta?.total,
          defaultCurrent: params.page,
        }}
        onChange={onChange}
        rowKey={(record) => record.id}
      />
      <CustomModal
        click={unitDelete}
        text={
          text ? t('delete') : t('all.delete')
        }
        loading={loadingBtn}
        setText={setUUID}
        setActive={setActive}
      />
    </Card>
  );
}