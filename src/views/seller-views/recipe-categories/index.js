import React, { useContext, useEffect, useState } from 'react';
import {
  ClearOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Image, Space, Table, Tabs, Tag, Switch } from 'antd';
import { export_url } from '../../../configs/app-global';
import { Context } from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomModal from '../../../components/modal';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  addMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import sellerCategoryService from '../../../services/seller/category';
import { useTranslation } from 'react-i18next';
import DeleteButton from '../../../components/delete-button';
import FilterColumns from '../../../components/filter-column';
import SearchInput from '../../../components/search-input';
import useDidUpdate from '../../../helpers/useDidUpdate';
import { CgExport, CgImport } from 'react-icons/cg';
import formatSortType from '../../../helpers/formatSortType';
import { fetchSellerRecipeCategories } from '../../../redux/slices/recipe-category';
const colors = ['blue', 'red', 'gold', 'volcano', 'cyan', 'lime'];

const { TabPane } = Tabs;
const roles = ['all', 'pending', 'published', 'unpublished'];

const RecipeCategories = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [role, setRole] = useState('all');
  const [active, setActive] = useState(null);
  const immutable = activeMenu.data?.role || role;

  function goToEdit(row) {
    dispatch(
      addMenu({
        url: `seller/recipe-category/edit/${row.uuid}`,
        id: 'category_edit',
        name: t('edit.category'),
      })
    );
    navigate(`/seller/recipe-category/edit/${row.uuid}`, { state: 'edit' });
  }

  const goToAddCategory = () => {
    dispatch(
      addMenu({
        id: 'category-add',
        url: 'seller/recipe-category/add',
        name: t('add.category'),
      })
    );
    navigate('/seller/recipe-category/add');
  };

  const goToImport = () => {
    dispatch(
      addMenu({
        url: `seller/recipe-categories/import`,
        id: 'category_import',
        name: t('import.category'),
      })
    );
    navigate(`/seller/recipe-categories/import`);
  };

  const goToClone = (uuid) => {
    dispatch(
      addMenu({
        id: `category-clone`,
        url: `seller/recipe-category-clone/${uuid}`,
        name: t('category.clone'),
      })
    );
    navigate(`/seller/recipe-category-clone/${uuid}`, { state: 'clone' });
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
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
      key: 'active',
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
      key: 'options',
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
            <Button
              icon={<CopyOutlined />}
              onClick={() => goToClone(row.uuid)}
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
    (state) => state.recipeCategory,
    shallowEqual
  );

  const data = activeMenu.data;
  const paramsData = {
    search: data?.search,
    pageSize: meta.per_page,
    page: data?.page || 1,
    status: immutable === 'all' ? undefined : immutable,
  };

  const categoryDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    sellerCategoryService
      .delete(params)
      .then(() => {
        dispatch(fetchSellerRecipeCategories(paramsData));
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
    if (activeMenu.refetch) {
      dispatch(fetchSellerRecipeCategories(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    dispatch(fetchSellerRecipeCategories(paramsData));
  }, [activeMenu.data]);

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

  const excelExport = () => {
    setDownloading(true);
    sellerCategoryService
      .export()
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
      })
    );
  };

  const handleClear = () => {
    dispatch(
      setMenuData({
        activeMenu,
        data: undefined,
      })
    );
  };

  const handleActive = () => {
    setLoadingBtn(true);
    sellerCategoryService.setActive(id).then(() => {
      setLoadingBtn(false);
      dispatch(fetchSellerRecipeCategories(paramsData));
      setIsModalVisible(false);
    });
  };

  return (
    <>
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
          <Button
            icon={<ClearOutlined />}
            onClick={handleClear}
            disabled={!activeMenu.data}
            style={{ minWidth: 100 }}
          />
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={goToAddCategory}
          >
            {t('add.category')}
          </Button>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      </Card>

      <Card title={t('categories')}>
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
            pageSize: meta.per_page,
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
            ? t('set.active.product')
            : text
            ? t('delete')
            : t('all.delete')
        }
        setText={setId}
        setActive={setActive}
        loading={loadingBtn}
      />
    </>
  );
};

export default RecipeCategories;
