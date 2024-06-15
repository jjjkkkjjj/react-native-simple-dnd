import React from 'react';
import {
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  Animated,
  LayoutRectangle,
} from 'react-native';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { DnDable, DnDableContainerProps } from './presenter';
import { useDnDable } from './hooks';
import { useDroppable, useDraggable, useReloadLayout } from '../DnDArea/hooks';
import { DnDEventHandlers, DroppableInformation } from '../types';
import { checkDroppable, checkDragStartable } from '../utils';

const DnDableContainer = <T, U extends object>(
  props: DnDableContainerProps<T, U>,
) => {
  const {
    pan,
    offset,
    viewRef,
    styleParams,
    setStyleParams,
    dragRelativeOffset,
    setDragRelativeOffset,
  } = useDnDable(props.styleParams);
  const [droppableInformation, setDroppableInformation] = useDroppable();
  const [draggableInformation, setDraggableInformation] = useDraggable();
  const { reloadLayoutSwitch } = useReloadLayout();
  const startShouldSetHandler = React.useCallback(
    (e: GestureResponderEvent, _gesture: PanResponderGestureState): boolean => {
      const { pageX: x, pageY: y } = e.nativeEvent;
      // TODO: Support overlapped children
      // Current implementation doesn't support overlapped DnDable children

      // Check if this component is child or not first;
      // if it is child;
      //  if droppable component exists, then it is allowed to drag
      // if it is parent
      //  if droppable component doesn't exist, then it is allowed to drag
      return (
        checkDragStartable(
          props.keyValue,
          props.parentkeyValue,
          { x, y },
          droppableInformation,
        )
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [droppableInformation],
  );
  const grantEventHandler = React.useCallback(
    (_e: GestureResponderEvent, _gesture: PanResponderGestureState) => {
      pan.setOffset({ x: offset.x, y: offset.y });
      pan.setValue({ x: 0, y: 0 });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const startEventHandler = React.useCallback(
    (e: GestureResponderEvent, _gesture: PanResponderGestureState) => {
      setDraggableInformation((prev) => {
        const draggedInformation = draggableInformation[props.keyValue];
        const parent = props.parentkeyValue
          ? {
              [props.parentkeyValue]: {
                ...draggableInformation[props.parentkeyValue],
                dragging: true,
              },
            }
          : {};
        return {
          ...draggableInformation,
          ...prev,
          ...parent,
          [props.keyValue]: { ...draggedInformation, dragging: true },
        };
      });
      // Event Handling
      props.eventHandlers?.onDragStart?.();
      // Event Handling for Style Parameters
      if (props.eventHandlers?.onDragStartForStyleParams) {
        const newStyleParams =
          props.eventHandlers.onDragStartForStyleParams(styleParams);
        setStyleParams((prev) => ({
          ...prev,
          ...newStyleParams,
        }));
      } else {
        setStyleParams(() => props.styleParams);
      }
      // Set Drag offset relative to DnDable
      const { pageX: x, pageY: y } = e.nativeEvent;
      const layout: LayoutRectangle =
        droppableInformation[props.keyValue].layout;
      setDragRelativeOffset(() => ({
        x: x - layout.x,
        y: y - layout.y,
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draggableInformation, droppableInformation, styleParams],
  );
  const endEventHandler = React.useCallback(
    (_e: GestureResponderEvent, _gesture: PanResponderGestureState) => {
      setDraggableInformation((prev) => {
        const draggedInformation = draggableInformation[props.keyValue];
        const parent = props.parentkeyValue
          ? {
              [props.parentkeyValue]: {
                ...draggableInformation[props.parentkeyValue],
                dragging: false,
              },
            }
          : {};
        return {
          ...draggableInformation,
          ...prev,
          ...parent,
          [props.keyValue]: { ...draggedInformation, dragging: false },
        };
      });
      // Event Handling
      props.eventHandlers?.onDragEnd?.();
      // Event Handling for Style Parameters
      if (props.eventHandlers?.onDragEndForStyleParams) {
        const newStyleParams =
          props.eventHandlers.onDragEndForStyleParams(styleParams);
        setStyleParams((prev) => ({
          ...prev,
          ...newStyleParams,
        }));
      } else {
        setStyleParams(() => props.styleParams);
      }
      // Set Drag offset relative to DnDable
      setDragRelativeOffset(() => ({
        x: 0,
        y: 0,
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draggableInformation, droppableInformation, styleParams],
  );
  const resetAll = React.useCallback(() => {
    // Reset All
    setDragRelativeOffset(() => ({
      x: 0,
      y: 0,
    }));
    Object.keys(droppableInformation).forEach((keyValue) => {
      const eventHandlers: DnDEventHandlers<T, U> =
        droppableInformation[keyValue].eventHandlers;
      eventHandlers?._resetStyleParams?.();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggableInformation, droppableInformation, styleParams]);

  const moveEventHandler = React.useCallback(
    (e: GestureResponderEvent, gesture: PanResponderGestureState) => {
      const { pageX: x, pageY: y } = e.nativeEvent;
      const layout: LayoutRectangle =
        droppableInformation[props.keyValue].layout;
      checkDroppable(
        props.keyValue,
        { x, y },
        dragRelativeOffset,
        layout,
        droppableInformation,
        // droppable
        (
          _droppableKeyValue: string,
          droppableInfo: DroppableInformation<T, U>,
        ) => {
          droppableInfo.eventHandlers.onDraggedItemHovered?.({
            keyValue: props.keyValue,
            item: props.item,
          });
          droppableInfo.eventHandlers._onDraggedItemHoveredForStyleParams?.({
            keyValue: props.keyValue,
            item: props.item,
          });
        },
        // not droppable
        (
          _droppableKeyValue: string,
          droppableInfo: DroppableInformation<T, U>,
        ) => {
          droppableInfo.eventHandlers._onDraggedItemNotHoveredForStyleParams?.({
            keyValue: props.keyValue,
            item: props.item,
          });
        },
      );
      Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      })(e, gesture);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [droppableInformation, dragRelativeOffset],
  );
  const releaseEventHandler = React.useCallback(
    (e: GestureResponderEvent, _gesture: PanResponderGestureState) => {
      const { pageX: x, pageY: y } = e.nativeEvent;
      const layout: LayoutRectangle =
        droppableInformation[props.keyValue].layout;
      checkDroppable(
        props.keyValue,
        { x, y },
        dragRelativeOffset,
        layout,
        droppableInformation,
        // droppable
        (
          droppableKeyValue: string,
          droppableInfo: DroppableInformation<T, U>,
        ) => {
          props.eventHandlers?.onDropped?.(
            {
              keyValue: props.keyValue,
              item: props.item,
            },
            { keyValue: droppableKeyValue, item: droppableInfo.item },
          );
        },
        // not droppable
        // (eventHandlers: DnDEventHandlers<T, U>) => {
        //   eventHandlers._onDraggedItemNotHoveredForStyleParams?.();
        // },
      );

      resetAll();
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        friction: 5,
        useNativeDriver: false,
      }).start();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [droppableInformation, dragRelativeOffset],
  );
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: startShouldSetHandler,
        // onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderMove: moveEventHandler,
        onPanResponderGrant: grantEventHandler,
        onPanResponderRelease: releaseEventHandler,
        onPanResponderStart: startEventHandler,
        onPanResponderEnd: endEventHandler,
        onPanResponderTerminate: resetAll,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [droppableInformation, draggableInformation],
  );
  const dragging = React.useMemo(
    () => Boolean(draggableInformation[props.keyValue]?.dragging),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draggableInformation],
  );

  // Set Draggable State
  React.useEffect(() => {
    setDraggableInformation((prev) => {
      return {
        ...prev,
        [props.keyValue]: {
          dragging: false,
        },
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDraggedItemHoveredForStyleParams = React.useCallback(
    (draggedItem: { keyValue: string; item?: any }) => {
      const droppedItem = {
        keyValue: props.keyValue,
        item: props.item,
      };
      setStyleParams((prev) => {
        const newStyleParams =
          props.eventHandlers?.onDraggedItemHoveredForStyleParams?.(
            prev,
            draggedItem,
            droppedItem,
          );
        return { ...prev, ...props.styleParams, ...newStyleParams } as U;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setStyleParams],
  );

  const handleDraggedItemNotHoveredForStyleParams = React.useCallback(
    (draggedItem: { keyValue: string; item?: any }) => {
      setStyleParams((prev) => {
        const newStyleParams =
          props.eventHandlers?.onDraggedItemNotHoveredForStyleParams?.(
            prev,
            draggedItem,
          );
        return { ...prev, ...props.styleParams, ...newStyleParams } as U;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setStyleParams],
  );

  const resetStyleParams = React.useCallback(() => {
    setStyleParams(() => props.styleParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setStyleParams]);

  // Set Layout information because of setting the position relative to parent
  // When the transition is occurred, the values from the measure method is invalid
  // e.g. width, height = 0, 0
  // That's why call this function to update layout in 2 cases;
  // First case: The first rendering;
  //  Update layout in the useEffect hooks because the ref object will be null yet in the onLayout
  // Second case: user calling by `reloadLayout` function from `useDragAndDrop`
  //  React-Native's View doesn't have the resize event handler (as far as I know).
  //  That's why I prepare the reloadLayout function as workaround.
  const registerDroppableInformation = React.useCallback(() => {
    if (viewRef?.current) {
      // console.log('viewRef', props.keyValue);
      viewRef.current.measure((x, y, width, height, pageX, pageY) => {
        // console.log(
        //   'viewRef',
        //   props.keyValue,
        //   x,
        //   y,
        //   width,
        //   height,
        //   pageX,
        //   pageY,
        // );
        setDroppableInformation((prev) => {
          const prevEventHandlers = prev[props.keyValue];
          return {
            ...prev,
            [props.keyValue]: {
              eventHandlers: {
                ...props.eventHandlers,
                ...prevEventHandlers?.eventHandlers,
                _onDraggedItemHoveredForStyleParams:
                  handleDraggedItemHoveredForStyleParams,
                _onDraggedItemNotHoveredForStyleParams:
                  handleDraggedItemNotHoveredForStyleParams,
                _resetStyleParams: resetStyleParams,
              },
              layout: { width, height, x: pageX, y: pageY },
              item: props.item,
            },
          };
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    handleDraggedItemHoveredForStyleParams,
    handleDraggedItemNotHoveredForStyleParams,
    resetStyleParams,
    setDroppableInformation,
    viewRef,
  ]);
  React.useEffect(() => {
    registerDroppableInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewRef, reloadLayoutSwitch]);

  // Update item when the props.item is changed
  // I don't know why React.useEffect causes the infinity loop...
  // To avoid it, I use `useDeepCompareEffect`
  useDeepCompareEffect(() => {
    // console.log('called', props.keyValue, props.item);
    setDroppableInformation((prev) => {
      const prevInfo = prev[props.keyValue];
      return {
        ...prev,
        [props.keyValue]: {
          ...prevInfo,
          item: props.item,
        },
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.item]);

  // console.log('dragging', props.keyValue, dragging);
  // console.log('rendered', props.keyValue, droppableInformation);
  // console.log('offset', dragRelativeOffset, offset);
  // console.log('parent', dndAreaRef);

  return (
    <DnDable
      {...props}
      viewRef={viewRef}
      updatedStyleParams={styleParams}
      dragging={dragging}
      pan={pan}
      panResponder={panResponder}
      // onLayout={(e) => {
      //   registerDroppableInformation();
      //   setDroppableInformation((prev) => {
      //     const prevEventHandlers = prev[props.keyValue];
      //     return {
      //       ...prev,
      //       [props.keyValue]: {
      //         eventHandlers: {
      //           ...props.eventHandlers,
      //           ...prevEventHandlers?.eventHandlers,
      //         },
      //         layout: e.nativeEvent.layout,
      //       },
      //     };
      //   });
      // }}
    />
  );
};

export default DnDableContainer;
