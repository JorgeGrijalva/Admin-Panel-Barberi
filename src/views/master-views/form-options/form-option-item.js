import { useContext } from 'react';
import { FormOptionContext } from './form-option-context';
import { ACTION_TYPES } from './utils';
import FormItemBuilder from './form-item-builder';
import FormItemPreview from './form-item-preview';

function FormOptionItem({ active, data, index }) {
  const { formOptionsDispatch } = useContext(FormOptionContext);
  const handleClick = () => {
    formOptionsDispatch({
      type: ACTION_TYPES.startUpdatingFormItem,
      payload: index,
    });
  };
  return active ? (
    <FormItemBuilder data={data} />
  ) : (
    <FormItemPreview data={data} disabled onClick={handleClick} />
  );
}

export default FormOptionItem;
