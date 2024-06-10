import React from 'react';
import {
  Animated,
  View,
  PanResponderInstance,
  LayoutChangeEvent,
} from 'react-native';

import { DnDType } from '../types';

export const DnDable = <T, U extends object>(props: DnDableProps<T, U>) => {
  const {
    x,
    y,
    reverseX,
    reverseY,
    zIndex,
    children,
    viewRef,
    updatedStyleParams,
    dragging,
    pan,
    panResponder,
    onLayout,
  } = props;
  return (
    <Animated.View
      {...panResponder.panHandlers}
      ref={viewRef}
      style={{
        // margin auto
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        // position transform during dragging
        transform: pan.getTranslateTransform(),
        // initial position
        position: x === undefined && y === undefined ? undefined : 'absolute',
        top: !reverseY ? y : undefined,
        bottom: reverseY ? y : undefined,
        left: !reverseX ? x : undefined,
        right: reverseX ? x : undefined,
        // avoid overlapping during dragging
        zIndex: (zIndex ?? 10) + Number(dragging) * 15,
      }}
      onLayout={onLayout}
    >
      {typeof children === 'function' ? children(updatedStyleParams) : children}
    </Animated.View>
  );
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DnDableContainerProps<T, U extends object>
  extends DnDType<T, U> {}

export interface DnDableProps<T, U extends object>
  extends DnDableContainerProps<T, U> {
  /** The ref object of the container view */
  viewRef: React.RefObject<View>;
  /** The updated custom parameters for style */
  updatedStyleParams?: U;
  /** whether to be dragging or not */
  dragging: boolean;
  /** the coordinates */
  pan: Animated.ValueXY;
  /** EventHandlers */
  panResponder: PanResponderInstance;
  /** The function when this component is rendered */
  onLayout?: (_e: LayoutChangeEvent) => void;
}
