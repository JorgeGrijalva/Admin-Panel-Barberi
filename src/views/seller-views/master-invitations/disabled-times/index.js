import { useState } from 'react';
import DisabledTimesTable from './disabled-times';
import DisabledTimeAdd from './add';
import DisabledTimeEdit from './edit';

function DisabledTimes() {
  const [visibleComponent, setVisibleComponent] = useState('table');
  const [editId, setEditId] = useState();

  switch (visibleComponent) {
    case 'table':
      return (
        <DisabledTimesTable
          setVisibleComponent={setVisibleComponent}
          setEditId={setEditId}
        />
      );
    case 'add-form':
      return <DisabledTimeAdd setVisibleComponent={setVisibleComponent} />;
    case 'edit-form':
      return (
        <DisabledTimeEdit
          editId={editId}
          setVisibleComponent={setVisibleComponent}
        />
      );
    default:
      return <DisabledTimesTable />;
  }
}

export default DisabledTimes;
