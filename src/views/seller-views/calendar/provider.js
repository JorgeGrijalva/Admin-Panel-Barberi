import { Form } from 'antd';
import React, { useState } from 'react';
import { createContext } from 'react';
import { useSearchParams } from 'react-router-dom';
export const BookingContext = createContext(null);

const BookingContextProvider = ({ children }) => {
  let [params] = useSearchParams();
  const service_id = params.get('service_id');
  const disabled_slot_id = params.get('disabled_slot_id');

  const [serviceForm] = Form.useForm();
  const [infoForm] = Form.useForm();
  const [blocktimeForm] = Form.useForm();
  const [serviceData, setServiceData] = useState([]);
  const [calculatedData, setCalculatedData] = useState({});
  const [infoData, setInfoData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState(null);
  const [isLoalding, setIsLoading] = useState(false);
  const [viewContent, setViewContent] = useState('');
  const [isAddForm, setIsAddForm] = useState(false);
  const [formDetailId, setFormDetailId] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);

  const sumInterval = calculatedData?.items?.reduce(
    (acc, curr) => acc + curr?.service_master?.interval,
    0,
  );

  return (
    <BookingContext.Provider
      value={{
        infoForm,
        serviceForm,
        serviceData,
        setServiceData,
        calculatedData,
        setCalculatedData,
        selectedSlots,
        setSelectedSlots,
        isModalOpen,
        setIsModalOpen,
        isLoalding,
        setIsLoading,
        viewContent,
        setViewContent,
        sumInterval,
        infoData,
        setInfoData,
        service_id,
        isAddForm,
        setIsAddForm,
        disabled_slot_id,
        blocktimeForm,
        formDetailId,
        setFormDetailId,
        updateStatus,
        setUpdateStatus,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContextProvider;
