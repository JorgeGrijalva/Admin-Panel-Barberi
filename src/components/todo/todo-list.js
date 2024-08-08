import React from 'react';

import { Checkbox, List, Space, Typography } from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

export const TodoList = ({ todos, onTodoToggle }) => {
  const { t } = useTranslation();
  return (
    <>
      {todos.length === 0 || (
        <Typography.Text>
          {todos.filter((todo) => todo.isComplete).length} of {todos.length}{' '}
          {t('remaining')}
        </Typography.Text>
      )}
      <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
        <List
          locale={{
            emptyText: t('todo.empty'),
          }}
          dataSource={todos}
          renderItem={(todo) => (
            <List.Item
              style={{ paddingRight: 0, paddingLeft: 0 }}
              key={todo.id}
              onClick={() => onTodoToggle(todo.id)}
            >
              <Space className='w-100 justify-content-between'>
                <Space className='align-items-end'>
                  <Checkbox checked={todo.isComplete} />
                  <Typography.Text delete={todo.isComplete}>
                    {todo.name}
                  </Typography.Text>
                </Space>
                <Typography.Text>
                  {moment(todo.date).format('MMM DD YYYY hh:mm a')}
                </Typography.Text>
              </Space>
            </List.Item>
          )}
        />
      </div>
    </>
  );
};
