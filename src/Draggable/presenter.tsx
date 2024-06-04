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
            zIndex: zIndex ?? 10,
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
  /** DroppableComponent上を通った場合に呼ばれる関数 */
  onCoverDroppableComponentForInsideParams?: (_insideParams?: U) => U;
  /** DroppableComponent上を通らなかった場合に呼ばれる関数 */
  onUncoverDroppableComponentForInsideParams?: (_insideParams?: U) => U;
  /** DroppableComponent上を通った場合に呼ばれる関数 */
  onCoverDroppableComponent?: (_draggedItem?: T, _droppedItem?: T) => void;
  /** DroppableComponent上でReleaseした際に呼ばれる関数 */
  onDropOverDroppableComponent?: (_draggedItem?: T, _droppedItem?: T) => void;
}

export interface DraggableContainerProps<T, U extends object>
  extends DragAndDropSharedType<T, U> {
  /** EventHandler */
  eventHandlers?: DraggableEventHandlers<T, U>;
}

export interface DraggableProps<T, U extends object>
  extends DraggableContainerProps<T, U> {
  /** 座標値 */
  pan: Animated.ValueXY;
  /** EventHandler諸々 */
  panResponder: PanResponderInstance;
  /** 更新された内部のパラメータ */
  managedInsideParams?: U;
}
