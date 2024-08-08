import List from '../List/index';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';
import { Spin } from 'antd';
import Scrollbars from 'react-custom-scrollbars';
import {
  clearCurrentOrders,
  clearItems,
  setItems,
} from '../../../../../redux/slices/waiterOrder';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { mockOrderList } from '../../../../../constants';
import OrderCardLoader from '../../../../../components/order-card-loader';
import { toast } from 'react-toastify';
import orderService from '../../../../../services/waiter/order';
import OrderCardWaiter from 'components/order-card-waiter';
const statuses = [
  'new',
  'accepted',
  'ready',
  'on_a_way',
  'delivered',
  'canceled',
];
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
  setType,
}) => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.waiterOrder, shallowEqual);
  const orders = useSelector((state) => state.waiterOrder, shallowEqual);
  const [key, setKey] = useState('');
  const [current, setCurrent] = useState({});
  const [currentCId, setCurrentCId] = useState({});

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
    orderService.updateStatus(id, params).then((res) => {
      toast.success(`#${id} order status changed`);
    });
  };

  const onDragStart = (task) => {
    const id = statuses.findIndex((item) => item === task.source.droppableId);
    setCurrent(task);
    setCurrentCId(id);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    if (
      result.destination &&
      current.source.droppableId !== result.destination.droppableId
    ) {
      changeStatus(result.draggableId, {
        status: result.destination.droppableId,
      });
    }
    const listCopy = { ...items };
    const sourceList = listCopy[result.source.droppableId];
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
    );
    listCopy[result.source.droppableId] = newSourceList;
    const destinationList = listCopy[result.destination.droppableId];
    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement
    );
    dispatch(setItems(listCopy));
    setCurrentCId(null);
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
          !orders[key].loading
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

  const checkIsEmpty = () => {
    const array = Object.keys(items).map((item) => {
      if (items[item].length === 0) {
        return true;
      } else {
        return false;
      }
    });

    if (array.includes(true)) return true;
    else return false;
  };

  const checkDisable = (index) => {
    if (index === 0 && currentCId === statuses.length - 1) return false;
    if (Boolean(currentCId > index)) return true;
    else return false;
  };

  useEffect(() => {
    dispatch(clearItems());
    // if (checkIsEmpty()) {
    fetchOrderAllItem();
    // }
  }, []);

  const reloadOrder = (item) => {
    dispatch(clearCurrentOrders(item));
    fetchOrders({ status: item });
  };

  return (
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
              loading={orders[item].loading}
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
                {!Boolean(orders[item].loading && !items[item]?.length)
                  ? items[item]?.map((data, index) => (
                      <>
                        <Draggable
                          key={data.id}
                          draggableId={data.id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <OrderCardWaiter
                                data={data}
                                goToShow={goToShow}
                              />
                            </div>
                          )}
                        </Draggable>
                      </>
                    ))
                  : mockOrderList[item]?.map(() => (
                      <OrderCardLoader loading={true} />
                    ))}
                {orders[item].loading && item === key && (
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
  );
};

export default Incorporate;
