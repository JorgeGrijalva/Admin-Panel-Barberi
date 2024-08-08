import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Space, Switch, Table } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Context } from 'context/context';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { fetchCountry } from 'redux/slices/deliveryzone/country';
import SearchInput from 'components/search-input';
import useDidUpdate from 'helpers/useDidUpdate';
import countryService from 'services/deliveryzone/country';
import CountryForm from './country-form';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const Country = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsModalVisible } = useContext(Context);
  let [searchParams, setSearchParams] = useSearchParams();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const data = activeMenu?.data;
  const region_id = searchParams.get('region_id');

  const { list, meta, loading } = useSelector(
    (state) => state.deliveryCountries,
    shallowEqual
  );
  const [selectedId, setSeletedId] = useState(false);
  const [visible, setVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [id, setId] = useState(null);

  const showCountry = (row) => {
    dispatch(
      addMenu({
        url: `deliveryzone/city?country_id=${row.id}`,
        id: 'city',
        name: t('city'),
      })
    );
    navigate(`/deliveryzone/city?country_id=${row.id}`);
  };

  const handleActive = (id) => {
    setSeletedId(id);
    countryService
      .status(id)
      .then(() => {
        setIsModalVisible(false);
        dispatch(fetchCountry({ region_id }));
        toast.success(t('successfully.updated'));
      })
      .finally(() => {
        setSeletedId(null);
      });
  };

  const handleDelete = (id) => {
    setDeleting(id);
    countryService
      .delete(id)
      .then(() => {
        dispatch(fetchCountry());
        toast.success(t('successfully.deleted'));
      })
      .finally(() => {
        setDeleting(false);
      });
  };
  const handleEdit = (id) => {
    setVisible(true);
    setId(id);
  };

  const columns = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('name'),
      dataIndex: 'translation',
      key: 'translation',
      render: (translation, row) => (
        <div
          style={{
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
          onClick={() => showCountry(row)}
        >
          {translation?.title || '-'}
        </div>
      ),
    },
    {
      title: t('active'),
      dataIndex: 'active',
      key: 'active',
      render: (active, row) => {
        return (
          <Switch
            key={row.id}
            onChange={() => handleActive(row.id)}
            checked={active}
            loading={Boolean(selectedId === row.id)}
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
              onClick={() => handleEdit(row.id)}
            />
            <Button
              loading={Boolean(deleting === row.id)}
              icon={<DeleteOutlined onClick={() => handleDelete(row.id)} />}
            />
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchCountry({ region_id }));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    const paramsData = {
      search: data?.search,
      region_id,
    };
    dispatch(fetchCountry(paramsData));
  }, [activeMenu?.data]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;
    dispatch(fetchCountry({ perPage: pageSize, page: current, region_id }));
  };
  const handleFilter = (item, name) => {
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, [name]: item },
      })
    );
  };

  return (
    <Card
      title={t('countries')}
      extra={
        <Space>
          <SearchInput
            placeholder={t('search')}
            handleChange={(search) => handleFilter(search, 'search')}
            defaultValue={data?.search}
            resetSearch={!data?.search}
          />
          <Button type='primary' onClick={() => setVisible(true)}>
            {t('add.country')}
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={list}
        pagination={{
          pageSize: meta.per_page,
          page: meta.current_page,
          total: meta.total,
        }}
        rowKey={(record) => record.id}
        loading={loading}
        onChange={onChangePagination}
      />

      <CountryForm
        visible={visible}
        setVisible={setVisible}
        id={id}
        setId={setId}
      />
    </Card>
  );
};

export default Country;
