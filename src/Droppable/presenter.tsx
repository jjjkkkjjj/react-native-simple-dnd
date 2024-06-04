import React from 'react';
import { View, LayoutChangeEvent } from 'react-native';

import { DragAndDropSharedType } from '../DragAndDropArea';

export const Droppable = <T, U extends object>(props: DroppableProps<T, U>) => {
  const {
    containerStyle,
    x,
    y,
    reverseX,
    reverseY,
    zIndex,
    viewRef,
    managedInsideParams,
    children,
    onLayout,
  } = props;
  return (
    <View
      ref={viewRef}
      onLayout={onLayout}
      style={[
        {
          zIndex: zIndex ?? 5,
          position: x === undefined && y === undefined ? undefined : 'absolute',
          top: !reverseY ? y : undefined,
          bottom: reverseY ? y : undefined,
          left: !reverseX ? x : undefined,
          right: reverseX ? x : undefined,
        },
        containerStyle,
      ]}
    >
      {typeof children === 'function'
        ? children(managedInsideParams)
        : children}
    </View>
  );
};

export interface DroppableLayoutInformation {
  /** X座標値 */
  x: number;
  /** Y座標値 */
  y: number;
  /** 幅 */
  width: number;
  /** 高さ */
  height: number;
}

export interface DroppableEventHandlers<T, U extends object> {
  /** DraggableComponentが通った場合に呼ばれる関数 */
  onCoveredByDraggableComponentForInsideParams?: (
    _insideParams?: U,
    _draggedItem?: T,
    _droppedItem?: T,
  ) => U;
  /** DraggableComponentが通った場合に呼ばれる関数 */
  onUncoveredByDraggableComponentForInsideParams?: (
    _insideParams?: U,
    _draggedItem?: T,
    _droppedItem?: T,
  ) => U;
  /** DraggableComponentが通った場合に呼ばれる関数 */
  onCoveredByDraggableComponent?: (_draggedItem?: T, _droppedItem?: T) => void;
  /** DraggableComponentがReleaseされた際に呼ばれる関数 */
  onDroppedDraggableComponent?: (_draggedItem?: T, _droppedItem?: T) => void;
}

export interface DroppableContainerProps<T, U extends object>
  extends DragAndDropSharedType<T, U> {
  /** EventHandler */
  eventHandlers?: DroppableEventHandlers<T, U>;
}

export interface DroppableProps<T, U extends object>
  extends DroppableContainerProps<T, U> {
  /** ViewのRef */
  viewRef: React.RefObject<View>;
  /** 描画された際に呼ばれる関数 */
  onLayout: (_e: LayoutChangeEvent) => void;
  /** 更新された内部のパラメータ */
  managedInsideParams?: U;
}
