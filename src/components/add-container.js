import React from 'react';
import { Card } from 'antd';
import { useLocation } from 'react-router-dom';

const AddContainer = ({ children, pathUrl, add, edit, extra }) => {
  // path name from url
  const location = useLocation();
  const pathName = location.pathname.substr(1);
  return (
    <Card title={pathName === pathUrl ? add : edit} extra={extra}>
      {children}
    </Card>
  );
};

export default AddContainer;
