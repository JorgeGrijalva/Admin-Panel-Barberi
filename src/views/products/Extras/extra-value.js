import React, { useState, useEffect, useContext } from 'react';
import { Button, Space, Table, Image, Card } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { fetchExtraValues } from 'redux/slices/extraValue';
import extraService from 'services/extra';
import ExtraValueModal from './extra-value-modal';
import DeleteButton from 'components/delete-button';
import { IMG_URL } from 'configs/app-global';
import { disableRefetch, setMenuData } from 'redux/slices/menu';
import FilterColumns from 'components/filter-column';
import formatSortType from 'helpers/formatSortType';
import useDidUpdate from 'helpers/useDidUpdate';
import { InfiniteSelect } from 'components/infinite-select';
import { Context } from 'context/context';
import CustomModal from 'components/modal';

export default function ExtraValue() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { extraValues, loading, meta } = useSelector(
    (state) => state.extraValue,
    shallowEqual,
  );
  const { setIsModalVisible } = useContext(Context);
  const paramsData = {
    perPage: activeMenu?.data?.perPage || 10,
    page: activeMenu?.data?.page || 1,
    group_id: activeMenu?.data?.group_id || null,
  };

  const [id, setId] = useState(null);
  const [modal, setModal] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [text, setText] = useState(null);
  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('title'),
      dataIndex: 'extra_group_id',
      key: 'extra_group_id',
      is_show: true,
      render: (_, row) => row?.group?.translation?.title,
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      is_show: true,
      render: (value, row) => (
        <Space className='extras'>
          {row?.group?.type === 'color' ? (
            <div
              className='extra-color-wrapper-contain'
              style={{ backgroundColor: row?.value }}
            />
          ) : null}
          {row?.group?.type === 'image' ? (
            <Image
              width={100}
              src={IMG_URL + row?.value}
              className='borderRadius'
            />
          ) : null}
          {row?.group?.type === 'image' ? null : <span>{row?.value}</span>}
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
            onClick={() => {
              setId([record.id]);
              setIsModalVisible(true);
              setText(true);
            }}
          />
        </Space>
      ),
    },
  ]);

  const handleCancel = () => setModal(null);

  function onChangePagination(pagination, filter, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, perPage, page, column, sort },
      }),
    );
  }

  const deleteExtra = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };
    extraService
      .deleteValue(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setId(null);
        dispatch(fetchExtraValues(paramsData));
      })
      .finally(() => {
        setIsModalVisible(false);
        setLoadingBtn(false);
        setId(null);
      });
  };

  useDidUpdate(() => {
    dispatch(fetchExtraValues(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchExtraValues(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  async function fetchExtraGroups({ search, page }) {
    const params = {
      search: search?.length === 0 ? undefined : search,
      page: page,
    };
    return extraService.getAllGroups(params).then((res) => {
      return res.data.map((item) => ({
        label: item?.translation?.title,
        value: item.id,
        key: item.id,
      }));
    });
  }

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      }),
    );
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
      setText(false);
    }
  };

  return (
    <Card
      title={t('extra.value')}
      extra={
        <Space wrap>
          <InfiniteSelect
            placeholder={t('select.group')}
            fetchOptions={fetchExtraGroups}
            loading={loading}
            style={{ minWidth: 180 }}
            onChange={(e) => handleFilter({ group_id: e?.value })}
            value={activeMenu.data?.group_id}
          />
          <DeleteButton icon={<DeleteOutlined />} onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={() => setModal({})}
          >
            {t('add.extra')}
          </Button>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <Table
        scroll={{ x: true }}
        loading={loading}
        columns={columns?.filter((item) => item.is_show)}
        rowSelection={rowSelection}
        dataSource={extraValues}
        rowKey={(record) => record.id}
        pagination={{
          pageSize: 10,
          page: activeMenu.data?.page || 1,
          total: meta.total,
          defaultCurrent: activeMenu.data?.page,
          current: activeMenu.data?.page,
        }}
        onChange={onChangePagination}
      />
      {modal && (
        <ExtraValueModal
          isVisible={modal}
          modal={modal}
          handleCancel={handleCancel}
          paramsData={paramsData}
        />
      )}
      <CustomModal
        click={deleteExtra}
        text={text ? t('delete') : t('all.delete')}
        loading={loadingBtn}
        setText={setId}
      />
    </Card>
  );
}
