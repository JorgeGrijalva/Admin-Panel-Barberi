import { Card } from 'antd';
import React, { useContext, useRef } from 'react';
import { FormOptionContext } from './form-option-context';
import FormItemPreview from './form-item-preview';
import { shallowEqual, useSelector } from 'react-redux';

function FormPreview({ form }) {
  const { defaultLang } = useSelector((state) => state.formLang, shallowEqual);
  const { formOptionsState } = useContext(FormOptionContext);

  const { current: title } = useRef(
    form.getFieldsValue()[`title[${defaultLang}]`]
  );
  const { current: description } = useRef(
    form.getFieldsValue()[`description[${defaultLang}]`]
  );

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className='border rounded'>
        <Card className='mb-0'>
          <h3>{title}</h3>
          <p>{description}</p>
        </Card>
        {/*<Divider className='my-0' />*/}
        <div className='border-top'>
          <Card className='mb-0'>
            {formOptionsState.formItemsList.map((item, index) => (
              <FormItemPreview data={item} index={index} key={index} />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default FormPreview;
