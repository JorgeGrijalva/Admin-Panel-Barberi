import React from 'react';
import { Switch } from 'antd';

const Toggle = ({ checked, onChange }) => {
  return (
    <Switch
      className='toggle me-3'
      checked={checked}
      size='small'
      onChange={onChange}
    />
  );
};

export default Toggle;
