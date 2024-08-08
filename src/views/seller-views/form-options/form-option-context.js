import { createContext, useReducer } from 'react';
import { ACTION_TYPES } from './utils';

export const FormOptionContext = createContext({});

const initialState = {
  activeItemIndex: 0,
  formItemsList: [
    {
      answer_type: 'short_answer',
      question: 'New question',
      required: true,
    },
  ],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.addNewFormItem:
      return {
        activeItemIndex: state.formItemsList.length,
        formItemsList: [...state.formItemsList, action.payload],
      };
    case ACTION_TYPES.updateFormItem: {
      const newFormItemsList = [...state.formItemsList];
      newFormItemsList[state.activeItemIndex] = action.payload;
      return {
        activeItemIndex: -1,
        formItemsList: newFormItemsList,
      };
    }
    case ACTION_TYPES.cancelFormItem:
      return {
        activeItemIndex: -1,
        formItemsList: state.formItemsList,
      };
    case ACTION_TYPES.startUpdatingFormItem:
      return {
        activeItemIndex: action.payload,
        formItemsList: state.formItemsList,
      };
    case ACTION_TYPES.deleteActiveFormItem: {
      const newFormItemsList = [...state.formItemsList];
      newFormItemsList.splice(state.activeItemIndex, 1);
      return {
        activeItemIndex: -1,
        formItemsList: newFormItemsList,
      };
    }
    case ACTION_TYPES.setFormItemsState:
      return {
        activeItemIndex: -1,
        formItemsList: action.payload,
      };
    case ACTION_TYPES.moveUpQuestion: {
      const newFormItemsList = [...state.formItemsList];
      const movingQuestion = newFormItemsList[state.activeItemIndex];
      newFormItemsList[state.activeItemIndex] =
        newFormItemsList[state.activeItemIndex - 1];
      newFormItemsList[state.activeItemIndex - 1] = movingQuestion;

      return {
        activeItemIndex: state.activeItemIndex - 1,
        formItemsList: newFormItemsList,
      };
    }
    case ACTION_TYPES.moveDownQuestion: {
      const newFormItemsList = [...state.formItemsList];
      const movingQuestion = newFormItemsList[state.activeItemIndex];
      newFormItemsList[state.activeItemIndex] =
        newFormItemsList[state.activeItemIndex + 1];
      newFormItemsList[state.activeItemIndex + 1] = movingQuestion;

      return {
        activeItemIndex: state.activeItemIndex + 1,
        formItemsList: newFormItemsList,
      };
    }
    case ACTION_TYPES.copyFormItem: {
      const newFormItemsList = [...state.formItemsList];
      newFormItemsList.splice(state.activeItemIndex + 1, 0, action.payload);

      return {
        activeItemIndex: state.activeItemIndex + 1,
        formItemsList: newFormItemsList,
      };
    }
    default:
      return state;
  }
};

function FormOptionContextProvider({ children }) {
  const [formOptionsState, formOptionsDispatch] = useReducer(
    reducer,
    initialState,
  );

  return (
    <FormOptionContext.Provider
      value={{ formOptionsState, formOptionsDispatch }}
    >
      {children}
    </FormOptionContext.Provider>
  );
}

export default FormOptionContextProvider;
