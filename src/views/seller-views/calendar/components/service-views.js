import React, { useContext } from 'react';
import DrawerView from './drawer-view';
import { BookingContext } from '../provider';
import UpdateForm from './update-form';
import UpdateService from './update-service-form';
import Footer from './update-form-footer';
import InfoForm from './info-form';
import InfoFormFooter from './info-form-footer';
import ServiceForm from './service-form';
import UpdateServiceFooter from './update-service-form-footer';
import BookingNotes from './notes';
import DrawerContentTypeMenu from './service-type-menu';
import BookingForms from './forms';
import BookingActivity from './activity';
import AddBlockTime from './add-block-time';
import BlockTimeFooter from './blocktime-footer';
import UpdateBlockTime from './update-block-time';

const ServiceViews = () => {
  const { viewContent, setViewContent } = useContext(BookingContext);

  const renderView = () => {
    switch (viewContent) {
      case 'addService':
        return <InfoForm />;
      case 'serviceForm':
        return <ServiceForm />;
      case 'updateForm':
        return <UpdateForm />;
      case 'updateService':
        return <UpdateService />;
      case 'notes':
        return <BookingNotes />;
      case 'forms':
        return <BookingForms />;
      case 'activity':
        return <BookingActivity />;
      case 'blockTime':
        return <AddBlockTime />;
      case 'updateBlockTime':
        return <UpdateBlockTime />;
      default:
        <UpdateForm />;
    }
  };
  const renderFooter = () => {
    switch (viewContent) {
      case 'addService':
        return <InfoFormFooter />;
      case 'updateForm':
        return <Footer />;
      case 'updateService':
        return <UpdateServiceFooter />;
      case 'blockTime':
        return <BlockTimeFooter />;
      case 'updateBlockTime':
        return <BlockTimeFooter />;
      default:
        return '';
    }
  };

  return (
    <DrawerView
      open={viewContent}
      setOpen={setViewContent}
      footer={renderFooter()}
    >
      <>
        {viewContent !== 'addService' &&
          viewContent !== 'serviceForm' &&
          viewContent !== 'blockTime' &&
          viewContent !== 'updateBlockTime' && <DrawerContentTypeMenu />}
        {renderView()}
      </>
    </DrawerView>
  );
};

export default ServiceViews;
