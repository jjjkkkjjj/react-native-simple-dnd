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
  /** The x coordinates relative to parent */
  x: number;
  /** The y coordinates relative to parent */
  y: number;
  /** The width of this component */
  width: number;
  /** The height of this component */
  height: number;
}

export interface DroppableEventHandlers<T, U extends object> {
  /** The function for custom inside parameters when the draggable component covers this component */
  onCoveredByDraggableComponentForInsideParams?: (
    _insideParams?: U,
    _draggedItem?: T,
    _droppedItem?: T,
  ) => U;
  /** The function for custom inside parameters when the draggable component UNcovers this component */
  onUncoveredByDraggableComponentForInsideParams?: (
    _insideParams?: U,
    _draggedItem?: T,
    _droppedItem?: T,
  ) => U;
  /** The function when the draggable component covers this component */
  onCoveredByDraggableComponent?: (_draggedItem?: T, _droppedItem?: T) => void;
  /** The function when the draggable component is dropped on this component */
  onDroppedDraggableComponent?: (_draggedItem?: T, _droppedItem?: T) => void;
}

export interface DroppableContainerProps<T, U extends object>
  extends DragAndDropSharedType<T, U> {
  /** EventHandlers */
  eventHandlers?: DroppableEventHandlers<T, U>;
}

export interface DroppableProps<T, U extends object>
  extends DroppableContainerProps<T, U> {
  /** The ref object of the container View */
  viewRef: React.RefObject<View>;
  /** The function when this component is rendered */
  onLayout: (_e: LayoutChangeEvent) => void;
  /** The updated custom inside parameters */
  managedInsideParams?: U;
}
