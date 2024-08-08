import {
  BookOutlined,
  FieldTimeOutlined,
  FileTextOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useContext } from 'react';
import { BookingContext } from '../provider';

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const DrawerContentTypeMenu = () => {
  const { setViewContent, service_id } = useContext(BookingContext);
  const onChange = (menu) => {
    setViewContent(menu.key);
  };
  const items = [
    getItem(
      'Info',
      service_id ? 'updateForm' : 'addService',
      <IdcardOutlined />
    ),
    getItem('Forms', 'forms', <FileTextOutlined />),
    getItem('Activity', 'activity', <FieldTimeOutlined />),
    getItem('Notes', 'notes', <BookOutlined />),
  ];

  return (
    <div className='content-menu'>
      <Menu
        mode='inline'
        items={items}
        defaultSelectedKeys={['info']}
        onClick={(key) => onChange(key)}
      />
    </div>
  );
};
export default DrawerContentTypeMenu;
