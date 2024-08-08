import React, { useState } from 'react';
import {
  Button,
  Dropdown,
  Menu,
  Space,
  Switch,
  Tooltip,
  Typography,
} from 'antd';
import { TableOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
const { Text } = Typography;

const FilterColumns = ({
  columns = [],
  setColumns,
  style,
  size = '',
  iconOnly,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const menu = (
    <Menu>
      {columns?.map((item, key) => (
        <Menu.Item key={item + key}>
          <Space className='d-flex justify-content-between'>
            <Text>{item.title}</Text>
            <Switch
              defaultChecked
              onClick={() => onChange(item)}
              disabled={
                // item.title === 'Title' ||
                // item.title === 'Name' ||
                // item.title === 'Client'
                key === 1
              }
            />
          </Space>
        </Menu.Item>
      ))}
    </Menu>
  );

  const handleVisibleChange = (flag) => {
    setOpen(flag);
  };
  function onChange(checked) {
    const newArray = columns?.map((item) => {
      if (item.dataIndex === checked.dataIndex) {
        item.is_show = !item?.is_show;
      }
      return item;
    });
    setColumns(newArray);
  }

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      onVisibleChange={handleVisibleChange}
      visible={open}
    >
      <Tooltip title={t('change.columns')}>
        <Button style={{ ...style }} size={size} icon={<TableOutlined />}>
          {iconOnly ? null : t('Columns')}
        </Button>
      </Tooltip>
    </Dropdown>
  );
};

export default FilterColumns;
