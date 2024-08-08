import { useState } from 'react';
import ServiceMasterTable from './service-master';
import DisabledTimesTable from '../disabled-times/disabled-times';
import ServiceMasterAdd from './add';
import ServiceMasterEdit from './edit';

function ServiceMaster() {
  const [visibleComponent, setVisibleComponent] = useState('table');
  const [editId, setEditId] = useState();

  switch (visibleComponent) {
    case 'table':
      return (
        <ServiceMasterTable
          setVisibleComponent={setVisibleComponent}
          setEditId={setEditId}
        />
      );
    case 'add-form':
      return <ServiceMasterAdd setVisibleComponent={setVisibleComponent} />;
    case 'edit-form':
      return (
        <ServiceMasterEdit
          editId={editId}
          setVisibleComponent={setVisibleComponent}
        />
      );
    default:
      return (
        <ServiceMasterTable
          editId={editId}
          setVisibleComponent={setVisibleComponent}
        />
      );
  }
}

export default ServiceMaster;
