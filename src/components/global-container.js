import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'antd';
import { useDispatch } from 'react-redux';
import { addMenu } from '../redux/slices/menu';
import { PlusCircleOutlined } from '@ant-design/icons';

const GlobalContainer = ({
  children,
  containerName,
  headerTitle,
  subtitle,
  navLInkTo,
  buttonTitle,
  state,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addMenuItem = () => {
    let url = '';
    const linkArr = navLInkTo.split('');
    if (linkArr[0] === '/') {
      linkArr.shift();
    }
    url = linkArr.join('');
    const data = { id: url, url, name: buttonTitle };
    dispatch(addMenu(data));
    navigate(navLInkTo);
  };

  return (
    <div className={containerName}>
      <Card
        title={headerTitle}
        extra={
          buttonTitle ? (
            <Button
              type='primary'
              icon={<PlusCircleOutlined />}
              onClick={addMenuItem}
            >
              {buttonTitle}
            </Button>
          ) : null
        }
      >
        {children}
      </Card>
    </div>
  );
};

export default GlobalContainer;
