import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  todos: [],
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo(state, action) {
      state.todos.push({
        ...action.payload,
        id: state.todos.at(-1)
          ? state.todos.at(-1).id + 1
          : state.todos.length + 1,
        isComplete: false,
        date: Date.now()
      });
    },
    removeTodo(state, action) {
      state.todos = state.todos.filter((todo) =>
        !action.payload.includes(todo.id)
      );
    },
    changeStatus(state, action) {
      state.todos = state.todos.map((todo) => {
        if (todo.id === action.payload) {
          return { ...todo, isComplete: !todo.isComplete };
        }
        return todo;
      });
    },
  },
});

export const { addTodo, removeTodo, changeStatus } = todoSlice.actions;
export default todoSlice.reducer;
