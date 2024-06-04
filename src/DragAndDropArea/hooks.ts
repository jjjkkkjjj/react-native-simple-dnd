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
    /** Droppableのキー */
    [key: string]: DroppableLayoutInformation;
  }>({});
  const droppableLayoutInformation = React.useMemo(
    () => droppableLayoutInformationRef.current,
    [droppableLayoutInformationRef],
  );
  const droppableEventHandlersRef = React.useRef<{
    /** Droggableのキー */
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
 * 管理用Hooks
 */
export const useDragAndDropArea = () => {
  const droppableLayoutInformationRef = React.useRef<{
    /** Droppableのキー */
    [key: string]: DroppableLayoutInformation;
  }>({});
  const droppableLayoutInformation = React.useMemo(
    () => droppableLayoutInformationRef.current,
    [droppableLayoutInformationRef],
  );
  const droppableEventHandlersRef = React.useRef<{
    /** Droggableのキー */
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
   * Droppableの描画情報を登録する関数
   * @param keyValue ユニークキー
   * @param information 描画情報
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
   * DroppableのEventHandlerを登録する関数
   * @param keyValue ユニークキー
   * @param eventHandlers 任意のEventHandler
   * @param item 任意の管理値
   * @param insideParams 内部のパラメータ
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
  //  * DraggableのEventHandlerを登録する関数
  //  * @param keyValue ユニークキー
  //  * @param eventHandlers 任意のEventHandler
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
   * Drop可能かを判定する関数
   * @param draggableKey Draggbleのユニークキー
   * @param x X座標値
   * @param y Y座標値
   * @param mode 呼び出しタイミング．
   * @returns Drop可能かどうか
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
    // 関数内だとStateが更新されないので対症療法
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
