import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Image, Card } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { fetchPropertyValues } from 'redux/slices/propertyValue';
import propertyService from 'services/property';
import PropertyValueModal from './property-value-modal';
import PropertyDeleteModal from './property-delete-modal';
import DeleteButton from 'components/delete-button';
import { IMG_URL } from 'configs/app-global';
import { disableRefetch, setMenuData } from 'redux/slices/menu';
import FilterColumns from 'components/filter-column';
import { InfiniteSelect } from 'components/infinite-select';
import useDidUpdate from 'helpers/useDidUpdate';

export default function PropertyValue() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { propertyGroups } = useSelector(
    (state) => state.propertyGroup,
    shallowEqual
  );
  const { propertyValues, loading } = useSelector(
    (state) => state.propertyValue,
    shallowEqual
  );

  const [id, setId] = useState(null);
  const [modal, setModal] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('title'),
      dataIndex: 'group',
      key: 'group',
      is_show: true,
      render: (group) => group?.translation?.title,
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      is_show: true,
      render: (value, row) => (
        <Space className='extras'>
          {row.group.type === 'color' ? (
            <div
              className='extra-color-wrapper-contain'
              style={{ backgroundColor: row.value }}
            />
          ) : null}
          {row.group.type === 'image' ? (
            <Image
              width={100}
              src={IMG_URL + row.value}
              className='borderRadius'
            />
          ) : null}
          {row.group.type === 'image' ? null : <span>{row.value}</span>}
        </Space>
      ),
    },
    {
      title: t('options'),
      is_show: true,
      render: (record) => (
        <Space>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => setModal(record)}
          />
          <DeleteButton
            type='primary'
            danger
            icon={<DeleteOutlined />}
            onClick={() => setId([record.id])}
          />
        </Space>
      ),
    },
  ]);

  const handleCancel = () => setModal(null);

  const deleteProperty = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    propertyService
      .deleteValue(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setId(null);
        dispatch(fetchPropertyValues());
      })
      .finally(() => setLoadingBtn(false));
  };
  useDidUpdate(() => {
    dispatch(fetchPropertyValues({ group_id: activeMenu?.data?.group_id }));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchPropertyValues());
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  async function fetchPropertyGroups({ search, page }) {
    const params = {
      search: search?.length === 0 ? undefined : search,
      page: page,
    };
    return propertyService.getAllGroups(params).then((res) => {
      return res.data.map((item) => ({
        label: item.translation?.title,
        value: item.id,
      }));
    });
  }

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
    <Card
      title={t('property.value')}
      extra={
        <Space wrap>
          <InfiniteSelect
            placeholder={t('select.group')}
            fetchOptions={fetchPropertyGroups}
            loading={loading}
            style={{ minWidth: 180 }}
            onChange={(e) => handleFilter({ group_id: e?.value })}
            value={activeMenu.data?.group_id}
          />
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={() => setModal({})}
          >
            {t('add.property')}
          </Button>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        loading={loading}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={propertyValues}
        rowKey={(record) => record.id}
        pagination={false}
      />
      {modal && (
        <PropertyValueModal modal={modal} handleCancel={handleCancel} />
      )}
      {id && (
        <PropertyDeleteModal
          id={id}
          click={deleteProperty}
          text={t('delete.property')}
          loading={loadingBtn}
          handleClose={() => setId(null)}
        />
      )}
    </Card>
  );
}
