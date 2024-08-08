import React, { useEffect, useState, useContext } from 'react';
import { Button, Table, Card, Space, Switch } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import advertService from 'services/advert';
import { fetchAdverts } from 'redux/slices/advert';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SearchInput from 'components/search-input';
import DeleteButton from '../../components/delete-button';
import { useNavigate } from 'react-router-dom';
import CustomModal from 'components/modal';
import { Context } from '../../context/context';
import { toast } from 'react-toastify';
import FilterColumns from 'components/filter-column';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import useDidUpdate from 'helpers/useDidUpdate';

export default function Advert() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const {
    advertList,
    loading: listLoading,
    meta,
  } = useSelector((state) => state.advert, shallowEqual);

  const [id, setId] = useState(null);
  const [text, setText] = useState(null);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(null);
  const { setIsModalVisible } = useContext(Context);
  const [loading, setLoading] = useState(false);

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      is_show: true,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t('title'),
      dataIndex: 'title',
      is_show: true,
      render: (_, row) => {
        return <span>{row?.translation?.title}</span>;
      },
    },
    {
      title: t('price'),
      dataIndex: 'price',
      is_show: true,
    },

    {
      title: t('time'),
      dataIndex: 'time',
      is_show: true,
    },
    {
      title: t('time.type'),
      dataIndex: 'time_type',
      is_show: true,
    },
    {
      title: t('type'),
      dataIndex: 'type',
      is_show: true,
    },
    {
      title: t('active'),
      dataIndex: 'active',
      is_show: true,
      render: (active, row) => {
        return (
          <Switch
            onChange={() => {
              setIsModalVisible(true);
              setId(row.id);
              setActive(true);
            }}
            checked={active}
          />
        );
      },
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
              icon={<DeleteOutlined />}
              onClick={() => {
                setIsModalVisible(true);
                setId([row.id]);
                setText(true);
                setActive(false);
              }}
            />
          </Space>
        );
      },
    },
  ]);

  const paramsData = {
    perPage: 10,
    page: 1,
  };

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `advert/${row.id}`,
        id: 'ad_edit',
        name: t('edit.ad'),
      }),
    );
    navigate(`/advert/${row.id}`);
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchAdverts(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    const data = activeMenu.data;
    const paramsData = {
      search,
    };
    dispatch(fetchAdverts(paramsData));
  }, [activeMenu.data, search]);

  const clearData = () => {
    dispatch(
      setMenuData({
        activeMenu,
        data: null,
      }),
    );
  };

  const advertDelete = () => {
    setLoading(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };

    advertService
      .delete(params)
      .then(() => {
        setIsModalVisible(false);
        toast.success(t('successfully.deleted'));
        dispatch(fetchAdverts(paramsData));
        setText(null);
        setActive(false);
      })
      .finally(() => {
        setLoading(false);
        setId(null);
      });
  };

  const goToAddAdvert = () => {
    dispatch(
      addMenu({
        id: 'advert-add',
        url: 'advert/add',
        name: t('add.advert'),
      }),
    );
    clearData();
    navigate('/advert/add');
  };

  const handleActive = () => {
    setLoading(true);
    advertService
      .setActive(id)
      .then(() => {
        setIsModalVisible(false);
        dispatch(fetchAdverts(paramsData));
        toast.success(t('successfully.updated'));
        setActive(false);
      })
      .finally(() => setLoading(false));
  };

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchAdverts({ perPage: pageSize, page: current }));
  };

  return (
    <>
      <Card className='p-o'>
        <div className='flex justify-content-between'>
          <SearchInput
            style={{ maxWidth: '200px' }}
            handleChange={(value) => setSearch(value)}
            placeholder={t('search')}
          />
          <div className='flex gap-3'>
            <FilterColumns columns={columns} setColumns={setColumns} />
            <Button
              icon={<PlusCircleOutlined />}
              type='primary'
              className='ml-3'
              onClick={goToAddAdvert}
            >
              {t('add.advert')}
            </Button>
          </div>
        </div>
      </Card>
      <Card>
        <Table
          scroll={{ x: true }}
          dataSource={advertList}
          columns={columns?.filter((item) => item.is_show)}
          rowKey={(record) => record.id}
          loading={loading || listLoading}
          pagination={{
            pageSize: meta.per_page,
            page: meta.current_page,
            total: meta.total,
          }}
          onChange={onChangePagination}
        />
      </Card>
      <CustomModal
        click={active ? handleActive : advertDelete}
        text={
          active ? t('set.active.advert') : text ? t('delete') : t('all.delete')
        }
        setText={setId}
        setActive={setActive}
      />
    </>
  );
}
