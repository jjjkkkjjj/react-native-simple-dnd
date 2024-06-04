import React from 'react';
import { Animated, PanResponder } from 'react-native';

import { useDragAndDrop } from '../DragAndDropArea';
import { DraggableEventHandlers } from './presenter';

export const useDraggable = <T, U extends object>(
  keyValue: string,
  eventHandlers?: DraggableEventHandlers<T, U>,
  item?: T,
  insideParams?: U,
) => {
  const [value, setValue] = React.useState({ x: 0, y: 0 });
  const [managedInsideParams, setManagedInsideParams] = React.useState<
    U | undefined
  >(insideParams);
  const { isDroppable } = useDragAndDrop();
  const pan = React.useRef(new Animated.ValueXY()).current;
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      // onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (e, gesture) => {
        // console.log(e.nativeEvent.pageX, e.nativeEvent.pageY);
        if (
          isDroppable(
            keyValue,
            e.nativeEvent.pageX,
            e.nativeEvent.pageY,
            'move',
            item,
            (draggedItem, droppedItem) => {
              eventHandlers?.onCoverDroppableComponent?.(
                draggedItem,
                droppedItem,
              );
              setManagedInsideParams(
                (prevInsideParams) =>
                  eventHandlers?.onCoverDroppableComponentForInsideParams?.(
                    prevInsideParams,
                    draggedItem,
                    droppedItem,
                  ),
              );
            },
            (draggedItem, droppedItem) => {
              setManagedInsideParams(
                (prevInsideParams) =>
                  eventHandlers?.onUncoverDroppableComponentForInsideParams?.(
                    prevInsideParams,
                    draggedItem,
                    droppedItem,
                  ),
              );
            },
          )
        ) {
          // eventHandlers?.onCoverDroppableComponent?.(item);
          // console.log('Droppable');
        } else {
          // console.log('Not Droppable');
        }
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(e, gesture);
      },
      onPanResponderGrant: () => {
        pan.setOffset({ x: value.x, y: value.y });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderRelease: (e) => {
        // absolute
        console.log('Released', e.nativeEvent.pageX, e.nativeEvent.pageY);
        // relative
        // console.log(e.nativeEvent.locationX, e.nativeEvent.locationY);
        if (
          isDroppable(
            keyValue,
            e.nativeEvent.pageX,
            e.nativeEvent.pageY,
            'release',
            item,
            (draggedItem, droppedItem) => {
              eventHandlers?.onDropOverDroppableComponent?.(
                draggedItem,
                droppedItem,
              );
              setManagedInsideParams(
                (prevInsideParams) =>
                  eventHandlers?.onCoverDroppableComponentForInsideParams?.(
                    prevInsideParams,
                  ),
              );
            },
          )
        ) {
          // eventHandlers?.onDropOverDroppableComponent?.(item);
          setManagedInsideParams(
            (prevInsideParams) =>
              eventHandlers?.onUncoverDroppableComponentForInsideParams?.(
                prevInsideParams,
              ),
          );
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;
  React.useEffect(() => {
    pan.addListener((value) => setValue(value));
    return () => pan.removeAllListeners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { value, pan, panResponder, managedInsideParams };
};
