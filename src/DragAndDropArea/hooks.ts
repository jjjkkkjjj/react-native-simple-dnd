import React from 'react';

import { DragAndDropAreaType } from './presenter';
import {
  DroppableLayoutInformation,
  DroppableEventHandlers,
} from '../Droppable';
// import { DraggableEventHandlers } from '../Draggable';

export const DragAndDropAreaContext = React.createContext(
  {} as DragAndDropAreaType<any, any>,
);

/**
 * DragAndDropAreaで囲まれたComponentで使用可能
 */
export const useDragAndDrop = () => {
  return React.useContext(DragAndDropAreaContext);
};

export const useDragAndDropAreaAdmin = () => {
  const droppableLayoutInformationRef = React.useRef<{
    [key: string]: DroppableLayoutInformation;
  }>({});
  const droppableLayoutInformation = React.useMemo(
    () => droppableLayoutInformationRef.current,
    [droppableLayoutInformationRef],
  );
  const droppableEventHandlersRef = React.useRef<{
    [key: string]: {
      item?: any;
      insideParams?: any;
      insideParamsCallback: (_insideParams?: any) => any;
    } & DroppableEventHandlers<any, any>;
  }>({});
  const droppableEventHandlers = React.useMemo(
    () => droppableEventHandlersRef.current,
    [droppableEventHandlersRef],
  );

  return {
    droppableLayoutInformationRef,
    droppableLayoutInformation,
    droppableEventHandlersRef,
    droppableEventHandlers,
  };
};

/**
 * The hooks for admin
 */
export const useDragAndDropArea = () => {
  const droppableLayoutInformationRef = React.useRef<{
    [key: string]: DroppableLayoutInformation;
  }>({});
  const droppableLayoutInformation = React.useMemo(
    () => droppableLayoutInformationRef.current,
    [droppableLayoutInformationRef],
  );
  const droppableEventHandlersRef = React.useRef<{
    [key: string]: {
      item?: any;
      insideParams?: any;
      insideParamsCallback: (_insideParams?: any) => any;
    } & DroppableEventHandlers<any, any>;
  }>({});
  const droppableEventHandlers = React.useMemo(
    () => droppableEventHandlersRef.current,
    [droppableEventHandlersRef],
  );
  // Draggbale関係のEventHandlerは自身のComponent内でisDroppableを呼ぶからか
  // 以下の対策でも更新されなかった．
  // さらなる対策として，useDraggable内で呼ぶようにする
  // const draggableEventHandlersRef = React.useRef<{
  //   /** Draggableのキー */
  //   [key: string]: DraggableEventHandlers;
  // }>({});
  // const draggableEventHandlers = React.useMemo(
  //   () => draggableEventHandlersRef.current,
  //   [draggableEventHandlersRef],
  // );

  /**
   * The function to register the layout information for the droppable component
   * @param keyValue The unique key
   * @param information The layout information
   */
  const registerDroppableLayoutInformation = (
    keyValue: string,
    information: DroppableLayoutInformation,
  ) => {
    droppableLayoutInformationRef.current = {
      ...droppableLayoutInformationRef.current,
      [keyValue]: {
        ...information,
      },
    };
  };

  /**
   * The function to register the event handlers for the droppable component
   * @param keyValue The unique key
   * @param eventHandlers The event handlers
   * @param item The custom item
   * @param insideParams The custom inside paramters
   */
  const registerDroppableEventHandlers = <T, U extends object>(
    keyValue: string,
    eventHandlers: Partial<DroppableEventHandlers<T, U>>,
    insideParamsCallback: (_insideParams?: U) => U,
    item?: T,
    insideParams?: U,
  ) => {
    const prevEventHandlers = droppableEventHandlers[keyValue] ?? {};
    droppableEventHandlersRef.current = {
      ...droppableEventHandlersRef.current,
      [keyValue]: {
        ...prevEventHandlers,
        ...eventHandlers,
        item: item,
        insideParams: insideParams,
        insideParamsCallback: insideParamsCallback,
      },
    };
  };

  // /**
  //  * The function to register the event handlers for the draggable component
  //  * @param keyValue The unique key
  //  * @param eventHandlers The event handlers
  //  */
  // const registerDraggableEventHandlers = (
  //   keyValue: string,
  //   eventHandlers: Partial<DraggableEventHandlers>,
  // ) => {
  //   const prevEventHandlers = draggableEventHandlers[keyValue] ?? {};
  //   draggableEventHandlersRef.current = {
  //     ...draggableEventHandlers,
  //     [keyValue]: {
  //       ...prevEventHandlers,
  //       ...eventHandlers,
  //     },
  //   };
  //   console.log(
  //     'registerDraggableEventHandlers',
  //     draggableEventHandlersRef.current,
  //   );
  // };

  /**
   * The function to check if the draggable item is droppable or not
   * @param draggableKey The unique key of the draggable item
   * @param x The x coordinate
   * @param y The y coordinate
   * @param mode The mode
   * @returns Whether the draggable item is droppable or not
   */
  const isDroppable = <T>(
    draggableKey: string,
    x: number,
    y: number,
    mode: 'move' | 'release',
    draggedItem?: T,
    droppableCallback?: (_draggedItem?: T, _droppedItem?: any) => void,
    unDroppableCallback?: (_draggedItem?: T, _droppedItem?: any) => void,
  ) => {
    // The state will not be updated in the function. To avoid this, workaround is using the ref object
    // https://stackoverflow.com/questions/71447566/react-state-variables-not-updating-in-function
    const droppableLayoutInformation = droppableLayoutInformationRef.current;

    const droppableKeys = Object.keys(droppableLayoutInformation)
      .map((key: string) => key)
      .filter(
        (key: string) =>
          droppableLayoutInformation[key].x <= x &&
          x <=
            droppableLayoutInformation[key].x +
              droppableLayoutInformation[key].width &&
          droppableLayoutInformation[key].y <= y &&
          y <=
            droppableLayoutInformation[key].y +
              droppableLayoutInformation[key].height,
      );

    const droppable = droppableKeys.length > 0;
    if (droppable) {
      droppableKeys.forEach((key) => {
        const value = droppableEventHandlersRef.current[key];
        const droppedItem = !value ? undefined : value.item;
        switch (mode) {
          case 'move':
            value?.onCoveredByDraggableComponent?.(draggedItem, droppedItem);
            if (value?.onCoveredByDraggableComponentForInsideParams) {
              const insideParams =
                value.onCoveredByDraggableComponentForInsideParams(
                  value.insideParams,
                  draggedItem,
                  droppedItem,
                );
              value.insideParamsCallback(insideParams);
            }
            droppableCallback?.(draggedItem, droppedItem);
            // console.log('isDroppable', draggableEventHandlersRef.current);
            // draggableEventHandlersRef.current[
            //   draggableKey
            // ]?.onCoverDroppableComponent?.();
            break;
          case 'release':
            value?.onDroppedDraggableComponent?.(draggedItem, droppedItem);
            droppableCallback?.(draggedItem, droppedItem);
            break;
        }
      });
    } else {
      Object.keys(droppableLayoutInformation).map((key: string) => {
        const value = droppableEventHandlersRef.current[key];
        if (value?.onUncoveredByDraggableComponentForInsideParams) {
          const insideParams =
            value.onUncoveredByDraggableComponentForInsideParams(
              value.insideParams,
              draggedItem,
              undefined,
            );
          value.insideParamsCallback(insideParams);
        }
      });
      unDroppableCallback?.(draggedItem, undefined);
    }

    return droppable;
    // return Object.keys(droppableLayoutInformation).some(
    //   (key: string) =>
    //     droppableLayoutInformation[key].x <= x &&
    //     x <=
    //       droppableLayoutInformation[key].x +
    //         droppableLayoutInformation[key].width &&
    //     droppableLayoutInformation[key].y <= y &&
    //     y <=
    //       droppableLayoutInformation[key].y +
    //         droppableLayoutInformation[key].height,
    // );
  };

  return {
    droppableLayoutInformation,
    droppableEventHandlers,
    droppableEventHandlersRef,
    // draggableEventHandlers,
    registerDroppableLayoutInformation,
    registerDroppableEventHandlers,
    // registerDraggableEventHandlers,
    isDroppable,
  };
};
