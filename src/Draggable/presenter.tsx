import React from 'react';
import { Animated, PanResponderInstance } from 'react-native';

import { DragAndDropSharedType } from '../DragAndDropArea';

export const Draggable = <T, U extends object>(props: DraggableProps<T, U>) => {
  const {
    containerStyle,
    x,
    y,
    reverseX,
    reverseY,
    zIndex,
    pan,
    panResponder,
    dragging,
    managedInsideParams,
    children,
  } = props;

  return (
    <>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          {
            transform: pan.getTranslateTransform(),
            zIndex: (zIndex ?? 10) + Number(dragging) * 5,
            position:
              x === undefined && y === undefined ? undefined : 'absolute',
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
      </Animated.View>
    </>
  );
};

export interface DraggableEventHandlers<T, U extends object> {
  /** The function for custom inside parameters when this component covers the droppable component */
  onCoverDroppableComponentForInsideParams?: (
    _insideParams?: U,
    _draggedItem?: T,
    _droppedItem?: T,
  ) => U;
  /** The function for custom inside parameters when this component UNcovers the droppable component */
  onUncoverDroppableComponentForInsideParams?: (
    _insideParams?: U,
    _draggedItem?: T,
    _droppedItem?: T,
  ) => U;
  /** The function when this component covers the droppable component */
  onCoverDroppableComponent?: (_draggedItem?: T, _droppedItem?: T) => void;
  /** The function when this component is dropped on the droppable component */
  onDropOverDroppableComponent?: (_draggedItem?: T, _droppedItem?: T) => void;
}

export interface DraggableContainerProps<T, U extends object>
  extends DragAndDropSharedType<T, U> {
  /** EventHandlers */
  eventHandlers?: DraggableEventHandlers<T, U>;
}

export interface DraggableProps<T, U extends object>
  extends DraggableContainerProps<T, U> {
  /** the coordinates */
  pan: Animated.ValueXY;
  /** EventHandlers */
  panResponder: PanResponderInstance;
  /** whether to be dragging or not */
  dragging: boolean;
  /** The updated custom inside parameters */
  managedInsideParams?: U;
}
