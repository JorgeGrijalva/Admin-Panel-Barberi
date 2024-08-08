import React, { useContext, useEffect, useState } from 'react';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Table, Card, Space, Tag, Tabs, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { export_url } from '../../../configs/app-global';
import { Context } from '../../../context/context';
import CustomModal from '../../../components/modal';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  addMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import productService from '../../../services/seller/product';
import { fetchSellerfetchAddons } from '../../../redux/slices/addons';
import { useTranslation } from 'react-i18next';
import formatSortType from '../../../helpers/formatSortType';
import useDidUpdate from '../../../helpers/useDidUpdate';
import SearchInput from '../../../components/search-input';
import DeleteButton from '../../../components/delete-button';
import FilterColumns from '../../../components/filter-column';
import { CgExport, CgImport } from 'react-icons/cg';
import RiveResult from '../../../components/rive-result';
const { TabPane } = Tabs;
const colors = ['blue', 'red', 'gold', 'volcano', 'cyan', 'lime'];
const roles = ['all', 'published', 'pending', 'unpublished'];

const SellerAddons = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myShop: shop } = useSelector((state) => state.myShop, shallowEqual);
  const [role, setRole] = useState('all');
  const [active, setActive] = useState(null);
  const clearData = () => {
    dispatch(
      setMenuData({
        activeMenu,
        data: null,
      })
    );
  };

  const goToEdit = (uuid) => {
    dispatch(
      addMenu({
        id: `addon-edit`,
        url: `seller/addon/${uuid}`,
        name: t('edit.addon'),
      })
    );
    clearData();
    navigate(`/seller/addon/${uuid}`);
  };

  const goToClone = (uuid) => {
    dispatch(
      addMenu({
        id: `addon-clone`,
        url: `seller/addon-clone/${uuid}`,
        name: t('clone.addon'),
      })
    );
    clearData();
    navigate(`/seller/addon-clone/${uuid}`);
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      is_show: true,
      sorter: true,
    },
    {
      title: t('name'),
      dataIndex: 'name',
      is_show: true,
      render: (_, data) => data.translation?.title,
    },
    {
      title: t('status'),
      is_show: true,
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <div>
          {status === 'published' ? (
            <Tag color='blue'>{t(status)}</Tag>
          ) : status === 'unpublished' ? (
            <Tag color='error'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
        </div>
      ),
    },
    {
      title: t('translations'),
      dataIndex: 'locales',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            {row.locales?.map((item, index) => (
              <Tag className='text-uppercase' color={[colors[index]]}>
                {item}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: t('shop'),
      dataIndex: 'shop_id',
      is_show: true,
      render: (_, row) => {
        return row.shop?.translation?.title;
      },
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
              setId(row.uuid);
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
              onClick={() => goToEdit(row.uuid)}
            />
            <Button
              icon={<CopyOutlined />}
              onClick={() => goToClone(row.uuid)}
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

  const [id, setId] = useState(false);
  const { setIsModalVisible } = useContext(Context);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [text, setText] = useState(null);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { addonsList, meta, loading, params } = useSelector(
    (state) => state.addons,
    shallowEqual
  );
  const immutable = activeMenu.data?.role || role;
  const data = activeMenu.data;

  const paramsData = {
    search: data?.search,
    brand_id: data?.brand?.value,
    category_id: data?.category?.value,
    shop_id: data?.shop?.value,
    sort: data?.sort,
    status: immutable === 'all' ? undefined : immutable,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
    addon: 1,
  };

  const goToImport = () => {
    dispatch(
      addMenu({
        data: activeMenu.data.shop,
        id: 'addon-import',
        url: `seller/addon/import`,
        name: t('addon.import'),
      })
    );
    navigate(`/seller/addon/import`);
  };

  const productDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };

    productService
      .delete(params)
      .then(() => {
        setIsModalVisible(false);
        toast.success(t('successfully.deleted'));
        dispatch(fetchSellerfetchAddons(paramsData));
      })
      .finally(() => {
        setId(null);
        setLoadingBtn(false);
      });
  };

  const handleActive = () => {
    setLoadingBtn(true);
    productService
      .setActive(id)
      .then(() => {
        setIsModalVisible(false);
        dispatch(fetchSellerfetchAddons(paramsData));
        toast.success(t('successfully.updated'));
        setActive(true);
      })
      .finally(() => setLoadingBtn(false));
  };

  function onChangePagination(pagination, filter, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, perPage, page, column, sort },
      })
    );
  }

  useDidUpdate(() => {
    dispatch(fetchSellerfetchAddons(paramsData));
  }, [activeMenu.data]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchSellerfetchAddons(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const excelExport = () => {
    setDownloading(true);
    const params = {
      shop_id: shop.id,
      addon: 1,
    };
    productService
      .export(params)
      .then((res) => {
        const body = export_url + res.data.file_name;
        window.location.href = body;
      })
      .finally(() => setDownloading(false));
  };

  const goToAddProduct = () => {
    dispatch(
      addMenu({
        id: 'addon-add',
        url: 'seller/addon/add',
        name: t('add.addon'),
      })
    );
    clearData();
    navigate('/seller/addon/add');
  };

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      })
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
    <React.Fragment>
      <Card
        title={t('addons')}
        extra={
          <Space wrap>
            <Button disabled={!activeMenu?.data?.shop} onClick={goToImport}>
              <CgImport className='mr-2' />
              {t('import')}
            </Button>
            <Button
              loading={downloading}
              disabled={!activeMenu?.data?.shop}
              onClick={excelExport}
            >
              <CgExport className='mr-2' />
              {t('export')}
            </Button>

            <Button
              icon={<PlusCircleOutlined />}
              type='primary'
              onClick={goToAddProduct}
            >
              {t('addon.add')}
            </Button>
          </Space>
        }
      >
        <div className='d-flex justify-content-between'>
          <SearchInput
            placeholder={t('search')}
            handleChange={(e) => handleFilter({ search: e })}
            defaultValue={activeMenu.data?.search}
            resetSearch={!activeMenu.data?.search}
            className={'w-25'}
          />
          <Space wrap>
            <DeleteButton size='' onClick={allDelete}>
              {t('delete.selected')}
            </DeleteButton>
            <FilterColumns columns={columns} setColumns={setColumns} />
          </Space>
        </div>
      </Card>
      <Card>
        <Tabs
          className='mt-3'
          activeKey={immutable}
          onChange={(key) => {
            handleFilter({ role: key, page: 1 });
            setRole(key);
          }}
          type='card'
        >
          {roles.map((item) => (
            <TabPane tab={t(item)} key={item} />
          ))}
        </Tabs>
        <Table
          locale={{
            emptyText: <RiveResult id='nosell' />,
          }}
          scroll={{ x: true }}
          rowSelection={rowSelection}
          loading={loading}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={addonsList}
          pagination={{
            pageSize: params.perPage,
            page: activeMenu.data?.page || 1,
            total: meta.total,
            defaultCurrent: activeMenu.data?.page,
            current: activeMenu.data?.page,
          }}
          onChange={onChangePagination}
          rowKey={(record) => record.id}
        />
      </Card>
      <CustomModal
        click={active ? handleActive : productDelete}
        text={
          active ? t('set.active.addon') : text ? t('delete') : t('all.delete')
        }
        loading={loadingBtn}
        setText={setId}
        setActive={setActive}
      />
    </React.Fragment>
  );
};

export default SellerAddons;
