import React, { useContext, useEffect, useState } from 'react';
import {
  ClearOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Image, Space, Switch, Table, Tabs, Tag } from 'antd';
import { export_url } from '../../configs/app-global';
import { Context } from '../../context/context';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomModal from '../../components/modal';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from '../../redux/slices/menu';
import categoryService from '../../services/category';
import { fetchCategories } from '../../redux/slices/category';
import { useTranslation } from 'react-i18next';
import DeleteButton from '../../components/delete-button';
import FilterColumns from '../../components/filter-column';
import SearchInput from '../../components/search-input';
import useDidUpdate from '../../helpers/useDidUpdate';
import { CgExport, CgImport } from 'react-icons/cg';
import formatSortType from '../../helpers/formatSortType';
import CategoryStatusModal from './categoryStatusModal';
const colors = ['blue', 'red', 'gold', 'volcano', 'cyan', 'lime'];

const { TabPane } = Tabs;
const roles = ['all', 'pending', 'published', 'unpublished'];

const CategoryList = ({
  parentId,
  type = 'main',
  parent_type,
  isRefetch = false,
  handleAddAction = () => {},
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [role, setRole] = useState('all');
  const immutable = activeMenu.data?.role || role;
  const { uuid: parentUuid } = useParams();
  const [active, setActive] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState(null);

  function goToEdit(row) {
    dispatch(
      addMenu({
        url: `category/${row.uuid}`,
        id: parentId ? 'category_sub_edit' : 'category_edit',
        name: parentId ? t('edit.sub.category') : t('edit.category'),
      }),
    );
    navigate(`/category/${row.uuid}`, { state: { parentId, parentUuid } });
  }
  function goToShow(row) {
    dispatch(
      addMenu({
        url: `category/show/${row.uuid}`,
        id: 'category_show',
        name: t('category.show'),
      }),
    );
    navigate(`/category/show/${row.uuid}`, { state: { parentId, parentUuid } });
  }

  const goToAddCategory = () => {
    if (parentId) {
      handleAddAction(parentId);
    } else {
      dispatch(
        addMenu({
          id: parentId ? 'sub-category-add' : 'category-add',
          url: 'category/add',
          name: parentId ? t('add.sub.category') : t('add.category'),
        }),
      );
      navigate('/category/add', { state: { parentId, parentUuid } });
    }
  };

  const goToImport = () => {
    dispatch(
      addMenu({
        url: `catalog/categories/import`,
        id: parentId ? 'sub_category_import' : 'category_import',
        name: parentId ? t('import.sub.category') : t('import.category'),
      }),
    );
    navigate(`/catalog/categories/import`, { state: { parentId, parentUuid } });
  };

  const goToClone = (uuid) => {
    dispatch(
      addMenu({
        id: parentId ? 'sub-category-clone' : `category-clone`,
        url: `category-clone/${uuid}`,
        name: parentId ? t('sub.category.clone') : t('category.clone'),
      }),
    );
    navigate(`/category-clone/${uuid}`, { state: { parentId, parentUuid } });
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      is_show: true,
    },
    {
      title: t('sort'),
      dataIndex: 'input',
      key: 'input',
      is_show: true,
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      is_show: true,
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
      title: t('image'),
      dataIndex: 'img',
      key: 'img',
      is_show: true,
      render: (img, row) => {
        return (
          <Image
            src={img || 'https://via.placeholder.com/150'}
            alt='img_gallery'
            width={100}
            className='rounded'
            preview
            placeholder
            key={img + row.id}
          />
        );
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
      title: t('status'),
      is_show: true,
      dataIndex: 'status',
      key: 'status',
      render: (status, row) => (
        <div>
          {status === 'pending' ? (
            <Tag color='blue'>{t(status)}</Tag>
          ) : status === 'unpublished' ? (
            <Tag color='error'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
          <EditOutlined onClick={() => setCategoryDetails(row)} />
        </div>
      ),
    },
    {
      title: t('options'),
      key: 'options',
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button icon={<EyeOutlined />} onClick={() => goToShow(row)} />
            <Button
              icon={<CopyOutlined />}
              onClick={() => goToClone(row.uuid)}
            />
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row)}
            />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setId([row.id]);
                setIsModalVisible(true);
                setText(true);
              }}
            />
          </Space>
        );
      },
    },
  ]);

  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [text, setText] = useState(null);

  const { categories, meta, loading } = useSelector(
    (state) => state.category,
    shallowEqual,
  );

  const data = activeMenu.data;
  const paramsData = {
    search: data?.search,
    perPage: activeMenu?.data?.perPage || 10,
    page: data?.page || 1,
    status: immutable === 'all' ? undefined : immutable,
    type: type,
    parent_id: parentId,
  };

  const categoryDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };
    categoryService
      .delete(params)
      .then(() => {
        dispatch(fetchCategories(paramsData));
        toast.success(t('successfully.deleted'));
      })
      .finally(() => {
        setIsModalVisible(false);
        setLoadingBtn(false);
        setText(null);
        setId(null);
      });
  };

  useEffect(() => {
    dispatch(fetchCategories(paramsData));
    dispatch(disableRefetch(activeMenu));
  }, [activeMenu.refetch, type, parentId]);

  useEffect(() => {
    if (isRefetch) dispatch(fetchCategories(paramsData));
  }, [isRefetch]);

  useDidUpdate(() => {
    dispatch(fetchCategories(paramsData));
  }, [activeMenu.data]);

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

  const excelExport = () => {
    setDownloading(true);
    categoryService
      .export(paramsData)
      .then((res) => {
        const body = export_url + res.data.file_name;
        window.location.href = body;
      })
      .finally(() => setDownloading(false));
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

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      }),
    );
  };

  const handleClear = () => {
    dispatch(
      setMenuData({
        activeMenu,
        data: undefined,
      }),
    );
  };

  const handleActive = () => {
    setLoadingBtn(true);
    categoryService
      .setActive(id)
      .then(() => {
        setIsModalVisible(false);
        dispatch(fetchCategories(paramsData));
        toast.success(t('successfully.updated'));
        setActive(false);
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <>
      {!parentId && (
        <Card className='p-0'>
          <Space wrap size={[14, 20]}>
            <SearchInput
              placeholder={t('search')}
              className='w-25'
              handleChange={(e) => {
                handleFilter({ search: e });
              }}
              defaultValue={activeMenu.data?.search}
              resetSearch={!activeMenu.data?.search}
              style={{ minWidth: 300 }}
            />
            <DeleteButton size='' onClick={allDelete}>
              {t('delete.selected')}
            </DeleteButton>

            <Button style={{ minWidth: 150 }} onClick={goToImport}>
              <CgImport className='mr-2' />
              {t('import')}
            </Button>
            <Button
              style={{ minWidth: 150 }}
              loading={downloading}
              onClick={excelExport}
            >
              <CgExport className='mr-2' />
              {t('export')}
            </Button>
            {parent_type !== 'child' && (
              <Button
                type='primary'
                icon={<PlusCircleOutlined />}
                onClick={goToAddCategory}
              >
                {t('add.category')}
              </Button>
            )}
            <Button
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!activeMenu.data}
              style={{ minWidth: 100 }}
            />
            <FilterColumns columns={columns} setColumns={setColumns} />
          </Space>
        </Card>
      )}

      <Card title={parentId ? t('sub.category') : t('categories')}>
        {parentId && (
          <Space wrap size={[14, 20]}>
            <SearchInput
              placeholder={t('search')}
              className='w-25'
              handleChange={(e) => {
                handleFilter({ search: e });
              }}
              defaultValue={activeMenu.data?.search}
              resetSearch={!activeMenu.data?.search}
              style={{ minWidth: 300 }}
            />
            <DeleteButton size='' onClick={allDelete}>
              {t('delete.selected')}
            </DeleteButton>

            <Button style={{ minWidth: 150 }} onClick={goToImport}>
              <CgImport className='mr-2' />
              {t('import')}
            </Button>
            <Button
              style={{ minWidth: 150 }}
              loading={downloading}
              onClick={excelExport}
            >
              <CgExport className='mr-2' />
              {t('export')}
            </Button>
            {parent_type !== 'child' && (
              <Button
                type='primary'
                icon={<PlusCircleOutlined />}
                onClick={goToAddCategory}
              >
                {t('add.category')}
              </Button>
            )}
            <Button
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!activeMenu.data}
              style={{ minWidth: 100 }}
            />
            <FilterColumns columns={columns} setColumns={setColumns} />
          </Space>
        )}
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
          scroll={{ x: true }}
          rowSelection={rowSelection}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={categories}
          pagination={{
            pageSize: activeMenu.data?.perPage || 10,
            page: data?.page || 1,
            total: meta.total,
            defaultCurrent: data?.page,
            current: activeMenu.data?.page,
          }}
          rowKey={(record) => record.id}
          onChange={onChangePagination}
          loading={loading}
        />
      </Card>

      <CustomModal
        click={active ? handleActive : categoryDelete}
        text={
          active
            ? t('set.active.category')
            : text
              ? t('delete')
              : t('all.delete')
        }
        setText={setId}
        loading={loadingBtn}
      />

      {categoryDetails && (
        <CategoryStatusModal
          categoryDetails={categoryDetails}
          handleCancel={() => setCategoryDetails(null)}
          paramsData={paramsData}
        />
      )}
    </>
  );
};

export default CategoryList;
