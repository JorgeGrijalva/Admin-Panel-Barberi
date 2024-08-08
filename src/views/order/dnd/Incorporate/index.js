import List from '../List/index';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';
import { Spin } from 'antd';
import OrderCard from 'components/order-card';
import Scrollbars from 'react-custom-scrollbars';
import orderService from 'services/order';
import { clearCurrentOrders, clearItems, setItems } from 'redux/slices/orders';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { mockOrderList } from '../../../../constants';
import OrderCardLoader from 'components/order-card-loader';
import { toast } from 'react-toastify';
import Loading from 'components/loading';
import OrderNoteModal from 'views/order/orderNoteModal';

const Incorporate = ({
  goToEdit,
  goToShow,
  fetchOrderAllItem,
  fetchOrders,
  setLocationsMap,
  setId,
  setIsModalVisible,
  setText,
  setDowloadModal,
  type,
  setTabType,
}) => {
  const dispatch = useDispatch();
  const { statusList, loading } = useSelector(
    (state) => state.orderStatus,
    shallowEqual,
  );
  const statuses = statusList?.map((status) => {
    return status?.name;
  });
  const { items } = useSelector((state) => state.orders, shallowEqual);
  const orders = useSelector((state) => state.orders, shallowEqual);
  const [key, setKey] = useState('');
  const [current, setCurrent] = useState({});
  const [result, setResult] = useState({});
  const [currentCId, setCurrentCId] = useState({});
  const [statusChangedOrder, setStatusChangedOrder] = useState(null);
  const [modalNoteType, setModalNoteType] = useState('');
  const removeFromList = (list, index) => {
    const result = Array.from(list);
    const [removed] = result.splice(index, 1);
    return [removed, result];
  };

  const addToList = (list, index, element) => {
    const result = Array.from(list);
    result.splice(index, 0, element);
    return result;
  };

  const changeStatus = (id, params) => {
    orderService.updateStatus(id, params).then(() => {
      toast.success(`#${id} order status changed`);
    });
  };

  const onDragStart = (task) => {
    const id = statuses.findIndex((item) => item === task.source.droppableId);
    setCurrent(task);
    setCurrentCId(id);
  };
  const changeColumnData = (result) => {
    const listCopy = { ...items };
    const sourceList = listCopy[result.source.droppableId];
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index,
    );
    listCopy[result.source.droppableId] = newSourceList;
    const destinationList = listCopy[result.destination.droppableId];
    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement,
    );
    dispatch(setItems(listCopy));
    setCurrentCId(null);
  };
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    setResult(result);
    // if (result.destination.droppableId === 'canceled') {
    //   setModalNoteType('canceled');
    //   setStatusChangedOrder(result.draggableId);
    // } else if (result.destination.droppableId === 'pause') {
    //   setModalNoteType('pause');
    //   setStatusChangedOrder(result.draggableId);
    // } else if (
    //   result.destination &&
    //   current.source.droppableId !== result.destination.droppableId
    // ) {
    changeStatus(result.draggableId, {
      status: result.destination.droppableId,
    });
    changeColumnData(result);
    // }
  };

  const handleScroll = (event, key) => {
    const lastProductLoaded = event.target.lastChild;
    const pageOffset = event.target.clientHeight + event.target.scrollTop;
    if (lastProductLoaded) {
      const lastProductLoadedOffset =
        lastProductLoaded.offsetTop + lastProductLoaded.clientHeight + 19.9;
      if (pageOffset > lastProductLoadedOffset) {
        if (
          orders[key].meta.last_page > orders[key].meta.current_page &&
          !orders[key]?.loading
        ) {
          setKey(key);
          fetchOrders({
            page: orders[key].meta.current_page + 1,
            perPage: 5,
            status: key,
          });
        }
      }
    }
  };

  const checkDisable = (index) => {
    if (index === 0 && currentCId === statuses.length - 1) return false;
    return Boolean(currentCId > index);
  };

  useEffect(() => {
    dispatch(clearItems());
    // if (checkIsEmpty()) {
    fetchOrderAllItem();
    // }
  }, [type]);

  const reloadOrder = (item) => {
    dispatch(clearCurrentOrders(item));
    fetchOrders({ status: item });
  };

  return (
    <>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <div className='order-board'>
            {statuses?.map((item, index) => (
              <div key={item} className='dnd-column'>
                <List
                  title={item}
                  onDragEnd={onDragEnd}
                  name={item}
                  isDropDisabled={checkDisable(index)}
                  total={items[item]?.length}
                  loading={orders[item]?.loading}
                  reloadOrder={() => reloadOrder(item)}
                >
                  <Scrollbars
                    onScroll={(e) => handleScroll(e, item)}
                    autoHeight
                    autoHeightMin={'75vh'}
                    autoHeightMax={'75vh'}
                    autoHide
                    id={item}
                  >
                    {!Boolean(orders[item]?.loading && !items[item]?.length)
                      ? items[item]?.map((data, index) => (
                          <>
                            <Draggable
                              key={data.id}
                              draggableId={data.id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <OrderCard
                                    data={data}
                                    goToEdit={goToEdit}
                                    goToShow={goToShow}
                                    setLocationsMap={setLocationsMap}
                                    setId={setId}
                                    setIsModalVisible={setIsModalVisible}
                                    setText={setText}
                                    setDowloadModal={setDowloadModal}
                                    setTabType={setTabType}
                                  />
                                </div>
                              )}
                            </Draggable>
                          </>
                        ))
                      : mockOrderList[item]?.map(() => (
                          <OrderCardLoader loading={true} />
                        ))}
                    {orders[item]?.loading && item === key && (
                      <Spin
                        indicator={
                          <LoadingOutlined
                            style={{
                              fontSize: 24,
                            }}
                            spin
                          />
                        }
                      />
                    )}
                  </Scrollbars>
                </List>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
      {statusChangedOrder && (
        <OrderNoteModal
          result={result}
          changeColumnData={changeColumnData}
          statusChangedOrder={statusChangedOrder}
          setStatusChangedOrder={setStatusChangedOrder}
          modalNoteType={modalNoteType}
        />
      )}
    </>
  );
};

export default Incorporate;
