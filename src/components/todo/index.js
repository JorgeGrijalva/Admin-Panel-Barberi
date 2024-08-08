import React from 'react';
import { Card, Button } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { AddTodoForm } from './todo-form';
import { TodoList } from './todo-list';
import { addTodo, changeStatus, removeTodo } from '../../redux/slices/todo';
import { useTranslation } from 'react-i18next';

export const Todo = () => {
  const todos = useSelector((state) => state.todo.todos);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const handleFormSubmit = (todo) => dispatch(addTodo(todo));

  const handleRemoveTodo = () => {
    dispatch(
      removeTodo(todos.filter((todo) => todo.isComplete).map((todo) => todo.id))
    );
  };

  const handleToggleTodoStatus = (id) => dispatch(changeStatus(id));

  return (
    <Card
      className='h-100'
      title={t('todo.list')}
      extra={
        <Button
          danger
          type='primary'
          disabled={todos.filter((todo) => todo.isComplete).length === 0}
          onClick={handleRemoveTodo}
        >
          {t('archive')}
        </Button>
      }
    >
      <AddTodoForm onFormSubmit={handleFormSubmit} />
      <TodoList todos={todos} onTodoToggle={handleToggleTodoStatus} />
    </Card>
  );
};
